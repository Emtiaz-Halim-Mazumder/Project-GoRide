import dbConnect from '@/lib/mongodb';
import Ride from '@/models/Ride';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { id } = await params;
    const ride = await Ride.findById(id);

    if (!ride) {
      return Response.json(
        {
          success: false,
          error: 'Ride not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: ride,
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

export async function PUT(request, { params }) {
  await dbConnect();

  try {
    const { id } = await params;
    const body = await request.json();
    const ride = await Ride.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!ride) {
      return Response.json(
        {
          success: false,
          error: 'Ride not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: ride,
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

export async function DELETE(request, { params }) {
  await dbConnect();

  try {
    const { id } = await params;
    const ride = await Ride.findByIdAndDelete(id);

    if (!ride) {
      return Response.json(
        {
          success: false,
          error: 'Ride not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        data: {},
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
