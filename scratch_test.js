const Tesseract = require('tesseract.js');
const { MultiFormatReader, BinaryBitmap, HybridBinarizer, RGBLuminanceSource } = require('@zxing/library');
const sharp = require('sharp');

async function testOCR(path) {
  const { data: { text } } = await Tesseract.recognize(path, 'eng');
  console.log("OCR Result:");
  console.log(text);
  const match = text.match(/Student ID\s*:\s*(\d+)/i);
  if (match) {
    console.log("Extracted ID:", match[1]);
  } else {
    // maybe just look for any 8 digit number?
    const match2 = text.match(/\b\d{8}\b/);
    if (match2) console.log("Extracted ID (fallback):", match2[0]);
  }
}

async function testBarcode(path) {
  const { data, info } = await sharp(path).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  // ZXing requires RGBLuminanceSource to have Uint8ClampedArray
  const arr = new Uint8ClampedArray(data);
  // Actually, wait, sharp raw output is pixel data. RGBLuminanceSource wants Uint8ClampedArray
  // and it might expect a different format if it's RGBA.
  // Wait, sharp can output just grayscale? No, let's output RGBA.
  // The constructor of RGBLuminanceSource takes (luminances, width, height) where luminances is a Uint8ClampedArray or Int32Array?
  // Let's check @zxing/library docs or source if possible.
  // A simple way is to use javascript-barcode-reader or similar, but let's try this first.
}

testOCR('front.jpg');
