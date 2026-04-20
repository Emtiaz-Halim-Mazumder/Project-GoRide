import connectMongoDB from "@/lib/mongodb";
import EmergencyContact from "@/models/EmergencyContact";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecretKey = () => {
  const secret =
    process.env.JWT_SECRET ||
    "fallback_default_secret_please_change_in_production";
  return new TextEncoder().encode(secret);
};

export async function GET(request) {
  await connectMongoDB();
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    const { payload } = await jwtVerify(token, getJwtSecretKey());
    const userId = payload.userId;

    const contact = await EmergencyContact.findOne({ userId }).sort({
      createdAt: -1,
    });
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}

export async function POST(req) {
  await connectMongoDB();
  try {
    const token = req.cookies.get("auth_token")?.value;
    if (!token)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );

    const { payload } = await jwtVerify(token, getJwtSecretKey());
    const userId = payload.userId;

    const body = await req.json();
    let contact = await EmergencyContact.findOne({ userId });
    if (contact) {
      contact.name = body.name;
      contact.phone = body.phone;
      contact.email = body.email;
      await contact.save();
    } else {
      contact = await EmergencyContact.create({ ...body, userId });
    }
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 },
    );
  }
}
