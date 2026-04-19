import dbConnect from '@/lib/mongodb';
import Ride from '@/models/Ride';
import User from '@/models/User';
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET || "fallback_default_secret_please_change_in_production";
  return new TextEncoder().encode(secret);
};

export async function GET(request) {
  await dbConnect();

  try {
    const rides = await Ride.find({}).populate('creator', 'name department phone').sort({ createdAt: -1 });
    return Response.json(
      {
        success: true,
        data: rides,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  try {
    const body = await request.json();

    // Map form data to Ride schema
    const { origin, destination, date, availableSeats, startTime, endTime, vehicleType, preferences, fare, distanceKm, duration } = body;

    // Validate required fields
    if (!origin || !destination || !date || !availableSeats || !startTime || !endTime || !vehicleType) {
      return Response.json(
        {
          success: false,
          error: 'Please fill in all required fields',
        },
        { status: 400 }
      );
    }

    // Create time string from startTime and endTime
    const timeString = `${startTime} - ${endTime}`;

    // Create ride object with form data
    const rideData = {
      origin: origin.trim(),
      destination: destination.trim(),
      date: new Date(date),
      time: timeString,
      seats: parseInt(availableSeats),
      vehicleType: vehicleType,
      vehicleNumber: 'TBD', // To be updated by user
      driverName: 'TBD', // To be updated by user
      driverPhone: 'TBD', // To be updated by user
      fare: fare ? parseInt(fare) : 0,
      description: '',
      status: 'active',
      preferences: Array.isArray(preferences) ? preferences : [],
      ...(distanceKm && { distanceKm: parseFloat(distanceKm) }),
      ...(duration && { duration }),
    };

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, getJwtSecretKey());
        if (payload.userId) {
          rideData.creator = payload.userId;
        }
      } catch (err) {
        console.error("Token verification failed in POST /api/rides", err);
      }
    }

    const ride = await Ride.create(rideData);

    // Calculate and award impact points
    if (rideData.creator && rideData.distanceKm && rideData.seats) {
      const distance = rideData.distanceKm;
      const passengers = rideData.seats;
      const emission_solo = distance * 150 * passengers;
      const emission_shared = (distance * 150) / passengers;
      const reduced_emission = emission_solo - emission_shared;
      const points = Math.floor(reduced_emission / 150);

      if (points > 0) {
        await User.findByIdAndUpdate(rideData.creator, {
          $inc: { impactPoints: points }
        });
      }
    }

    return Response.json(
      {
        success: true,
        message: 'Ride offered successfully!',
        data: ride,
      },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error.message,
      },
      { status: 400 }
    );
  }
}
