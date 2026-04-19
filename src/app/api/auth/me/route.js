import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectMongoDB from "@/lib/mongodb";
import User from "@/models/User";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "fallback_default_secret_please_change_in_production";
  return new TextEncoder().encode(secret);
};

export async function GET(req) {
  try {
    const token = req.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
    }

    try {
      const { payload } = await jwtVerify(token, getJwtSecretKey());
      
      await connectMongoDB();
      
      const user = await User.findById(payload.userId).select("-password -__v");
      
      if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ user }, { status: 200 });
    } catch (jwtError) {
      return NextResponse.json({ message: "Unauthorized: Invalid or expired token" }, { status: 401 });
    }
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
