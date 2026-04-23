<<<<<<< HEAD
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Message from '@/models/Message';

export async function GET(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const rideId = searchParams.get('rideId');
    const since = searchParams.get('since');

    if (!rideId) {
      return NextResponse.json({ success: false, error: 'rideId is required' }, { status: 400 });
=======
import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Message from "@/models/Message";

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const rideId = searchParams.get("rideId");
    const since = searchParams.get("since");

    if (!rideId) {
      return NextResponse.json(
        { success: false, error: "rideId is required" },
        { status: 400 },
      );
>>>>>>> eabe9ef568161056c02fa8517def6f4ff7d36ed7
    }

    const query = { rideId };
    if (since) {
      query.createdAt = { $gt: new Date(since) };
    }

<<<<<<< HEAD
    const messages = await Message.find(query).sort({ createdAt: 1 }).limit(100);
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
=======
    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .limit(100);
    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
>>>>>>> eabe9ef568161056c02fa8517def6f4ff7d36ed7
  }
}

export async function POST(req) {
  try {
<<<<<<< HEAD
    await dbConnect();
=======
    await connectMongoDB();
>>>>>>> eabe9ef568161056c02fa8517def6f4ff7d36ed7
    const body = await req.json();
    const { rideId, senderName, senderRole, content } = body;

    if (!rideId || !senderName || !content) {
<<<<<<< HEAD
      return NextResponse.json({ success: false, error: 'rideId, senderName, and content are required' }, { status: 400 });
=======
      return NextResponse.json(
        {
          success: false,
          error: "rideId, senderName, and content are required",
        },
        { status: 400 },
      );
>>>>>>> eabe9ef568161056c02fa8517def6f4ff7d36ed7
    }

    const message = await Message.create({
      rideId,
      senderName: senderName.trim(),
<<<<<<< HEAD
      senderRole: senderRole || 'rider',
=======
      senderRole: senderRole || "rider",
>>>>>>> eabe9ef568161056c02fa8517def6f4ff7d36ed7
      content: content.trim(),
    });

    return NextResponse.json({ success: true, data: message }, { status: 201 });
  } catch (error) {
<<<<<<< HEAD
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
=======
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
>>>>>>> eabe9ef568161056c02fa8517def6f4ff7d36ed7
  }
}
