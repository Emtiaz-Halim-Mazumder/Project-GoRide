import connectMongoDB from "@/lib/mongodb";
import Ride from "@/models/Ride";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const getJwtSecretKey = () => {
  const secret =
    process.env.JWT_SECRET ||
    "fallback_default_secret_please_change_in_production";
  return new TextEncoder().encode(secret);
};

export async function POST(request, { params }) {
  await connectMongoDB();

  try {
    const { id } = await params;

    // Authenticate user
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    let userId;
    try {
      const { payload } = await jwtVerify(token, getJwtSecretKey());
      userId = payload.userId;
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 },
      );
    }

    // Find the ride
    const ride = await Ride.findById(id);
    if (!ride) {
      return NextResponse.json(
        { success: false, error: "Ride not found" },
        { status: 404 },
      );
    }

    // Check if user is the creator
    if (ride.creator && ride.creator.toString() === userId) {
      return NextResponse.json(
        { success: false, error: "You cannot accept your own ride" },
        { status: 400 },
      );
    }

    // Check if already accepted
    if (ride.passengers.includes(userId)) {
      return NextResponse.json(
        { success: false, error: "You have already accepted this ride" },
        { status: 400 },
      );
    }

    // Check available seats
    if (ride.seats <= 0) {
      return NextResponse.json(
        { success: false, error: "Ride is full" },
        { status: 400 },
      );
    }

    // Update ride
    ride.passengers.push(userId);
    ride.seats -= 1;
    await ride.save();

    return NextResponse.json(
      {
        success: true,
        message: "Ride accepted successfully",
        data: ride,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Accept ride error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
