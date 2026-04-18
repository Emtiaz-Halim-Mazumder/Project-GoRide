import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Verification from "@/models/Verification";
import User from "@/models/User";
import Tesseract from "tesseract.js";
import sharp from "sharp";
import { MultiFormatReader, BinaryBitmap, HybridBinarizer, RGBLuminanceSource, BarcodeFormat, DecodeHintType } from "@zxing/library";

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const name = formData.get("name");
    const email = formData.get("email");
    const sex = formData.get("sex");
    const department = formData.get("department");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const front = formData.get("front");
    const back = formData.get("back");

    if (!name || !email || !sex || !department || !phone || !address || !front || !back) {
      return NextResponse.json({ status: "ERROR", message: "Missing required fields" }, { status: 400 });
    }

    // save files to uploads directory
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const frontPath = path.join(uploadDir, `front_${Date.now()}.jpg`);
    const backPath = path.join(uploadDir, `back_${Date.now()}.jpg`);

    await saveFile(front, frontPath);
    await saveFile(back, backPath);

    // 1. Process Front Image (OCR)
    let extractedFrontId = null;
    try {
      const { data: { text } } = await Tesseract.recognize(frontPath, 'eng');
      const match = text.match(/Student ID\s*:\s*(\d+)/i);
      if (match) {
        extractedFrontId = match[1];
      } else {
        const fallbackMatch = text.match(/\b\d{8}\b/);
        if (fallbackMatch) extractedFrontId = fallbackMatch[0];
      }
    } catch (e) {
      console.error("OCR Error:", e);
    }

    // 2. Process Back Image (Barcode)
    let extractedBackId = null;
    try {
      const metadata = await sharp(backPath).metadata();
      const top = Math.floor(metadata.height * 0.75);
      const height = metadata.height - top;
      
      const { data, info } = await sharp(backPath)
        .extract({ left: 0, top, width: metadata.width, height })
        .grayscale()
        .normalize()
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const arr = new Uint8ClampedArray(data.buffer);
      const luminanceSource = new RGBLuminanceSource(arr, info.width, info.height);
      const binaryBitmap = new BinaryBitmap(new HybridBinarizer(luminanceSource));
      
      const hints = new Map();
      hints.set(DecodeHintType.TRY_HARDER, true);
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.CODE_128, BarcodeFormat.CODE_39]);

      const reader = new MultiFormatReader();
      const result = reader.decode(binaryBitmap, hints);
      extractedBackId = result.getText();
    } catch (e) {
      console.error("Barcode Error:", e);
    }

    // 3. Compare and Save to DB
    await connectMongoDB();
    
    let status = "pending";
    let mismatchReason = null;
    let finalMessage = "";

    if (!extractedFrontId) {
      status = "rejected";
      mismatchReason = "ocr_failed";
      finalMessage = "Verification Failed: Could not read Student ID from front image.";
    } else if (!extractedBackId) {
      status = "rejected";
      mismatchReason = "barcode_not_found";
      finalMessage = "Verification Failed: Could not read barcode from back image.";
    } else if (extractedFrontId === extractedBackId) {
      status = "verified";
      finalMessage = `Verification Successful! ID: ${extractedFrontId}. User profile created.`;
    } else {
      status = "rejected";
      mismatchReason = `mismatch: front(${extractedFrontId}) != back(${extractedBackId})`;
      finalMessage = `Verification Failed: ID mismatch (Front: ${extractedFrontId}, Back: ${extractedBackId})`;
    }

    const verificationRecord = await Verification.create({
      name,
      email,
      sex,
      department,
      phone,
      address,
      barcodeImage: backPath,
      idCardImage: frontPath,
      extractedBarcode: extractedBackId,
      extractedStudentId: extractedFrontId,
      status,
      mismatchReason,
    });

    // 4. Create User Profile if Verified
    let createdUser = null;
    if (status === "verified") {
      try {
        createdUser = await User.findOneAndUpdate(
          { studentId: extractedFrontId }, // Search by student ID
          {
            name,
            email,
            sex,
            department,
            phone,
            address,
            studentId: extractedFrontId
          },
          { upsert: true, new: true } // Create if doesn't exist, update if it does
        );
      } catch (userErr) {
        console.error("Failed to create User profile:", userErr);
        return NextResponse.json({ 
          status: "ERROR", 
          message: "Verification passed but failed to create user profile. Email or Student ID might already be registered to another account." 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      status, 
      message: finalMessage,
      record: verificationRecord,
      user: createdUser ? { _id: createdUser._id, studentId: createdUser.studentId } : null
    });

  } catch (err) {
    console.error("Verification API Error:", err);
    return NextResponse.json({ status: "ERROR", message: err.message }, { status: 500 });
  }
}

// helper: save file
async function saveFile(file, filePath) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  fs.writeFileSync(filePath, buffer);
}