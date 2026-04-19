import dbConnect from '@/lib/mongodb';
import Ride from '@/models/Ride';

export async function GET(request) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl?.searchParams ?? new URL(request.url).searchParams;
    const department  = searchParams.get('department');
    const building    = searchParams.get('building');
    const origin      = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date        = searchParams.get('date');
    const vehicleType = searchParams.get('vehicleType');
    const status      = searchParams.get('status');

    const query = {};

    if (department)  query.department  = department;
    if (building)    query.buildingName = building;
    if (vehicleType) query.vehicleType  = vehicleType;
    if (status)      query.status       = status;

    if (origin)      query.origin      = { $regex: origin.trim(),      $options: 'i' };
    if (destination) query.destination = { $regex: destination.trim(), $options: 'i' };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const rides = await Ride.find(query).sort({ createdAt: -1 });
    return Response.json(
      {
        success: true,
        data: rides,
        total: rides.length,
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
  try {
    await dbConnect();
    const body = await request.json();

    // Map form data to Ride schema
    const { origin, destination, date, availableSeats, startTime, endTime, vehicleType, preferences, department, buildingName } = body;

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
      preferences: Array.isArray(preferences) ? preferences : [],
      department: department || '',
      buildingName: buildingName || '',
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