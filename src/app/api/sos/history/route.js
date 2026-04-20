import connectMongoDB from "@/lib/mongodb";
import SOS from "@/models/SOS";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  try {
    const alerts = await SOS.find().sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ success: true, data: alerts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
