import { NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export async function POST(req) {

  const data = await req.formData();
  const file = data.get("idcard");

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await Tesseract.recognize(buffer, "eng");

  const text = result.data.text;

  return NextResponse.json({
    extractedText: text
  });
}