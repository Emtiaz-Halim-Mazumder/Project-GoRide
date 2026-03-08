import dbConnect from '@/lib/mongodb';
import Ride from '@/models/Ride';

export async function GET(request) {
  await dbConnect();

  try {
    const rides = await Ride.find({}).sort({ createdAt: -1 });
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
    const { origin, destination, date, availableSeats, startTime, endTime, vehicleType } = body;

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
      fare: 0, // To be calculated
      description: '',
      status: 'active',
    };

    const ride = await Ride.create(rideData);

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
