import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { userId, password } = await req.json();

    if (!userId || !password) {
      return NextResponse.json({ message: "User ID and password are required" }, { status: 400 });
    }

    await connectMongoDB();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Set password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
