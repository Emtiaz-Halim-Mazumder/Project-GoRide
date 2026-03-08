import dbConnect from "@/lib/mongodb";
import Schedule from "@/models/Schedule";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const schedules = await Schedule.find({});
    return NextResponse.json({ success: true, data: schedules });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const schedule = await Schedule.create(body);
    return NextResponse.json({ success: true, data: schedule }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { id, autoRide, recurring } = body;
    const updateData = {};
    if (autoRide !== undefined) updateData.autoRide = autoRide;
    if (recurring !== undefined) updateData.recurring = recurring;
    const schedule = await Schedule.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json({ success: true, data: schedule });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
