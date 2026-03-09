import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Verification from "@/models/Verification";

export async function POST(req) {
  try {
    await connectDB();

    const data = await req.formData();
    const name = data.get("name");
    const email = data.get("email");
    const file = data.get("idcard");

    if (!name || !email || !file) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save verification data to database
    const verification = await Verification.create({
      name,
      email,
      idCard: file.name, // Store the filename
      status: "pending",
    });

    return NextResponse.json(
      { success: true, message: "Verification submitted successfully", data: verification },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}