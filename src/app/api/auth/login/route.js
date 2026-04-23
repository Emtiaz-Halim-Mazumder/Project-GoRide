import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import validateEnv from "@/lib/env.js";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

validateEnv();

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET missing from .env.local");
  }
  return new TextEncoder().encode(secret);
};

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    await connectMongoDB();

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    ); // Explicitly include password

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    if (!user.password) {
      return NextResponse.json(
        { message: "Account not fully set up. Please set a password first." },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Create JWT token
    const token = await new SignJWT({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getJwtSecretKey());

    // Create the response and set the cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error.message || error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
