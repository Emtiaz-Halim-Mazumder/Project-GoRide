import dbConnect from '@/lib/mongodb';
import EmergencyContact from '@/models/EmergencyContact';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const contact = await EmergencyContact.findOne().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    // For simplicity in this demo, we'll just keep one emergency contact
    // If one exists, update it, otherwise create it.
    let contact = await EmergencyContact.findOne();
    if (contact) {
      contact.name = body.name;
      contact.phone = body.phone;
      await contact.save();
    } else {
      contact = await EmergencyContact.create(body);
    }
    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
