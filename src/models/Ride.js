import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema(
  {
    origin: {
      type: String,
      required: [true, 'Please add an origin'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Please add a destination'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    time: {
      type: String,
      required: [true, 'Please add a time'],
    },
    seats: {
      type: Number,
      required: [true, 'Please add number of seats'],
      min: 1,
      max: 8,
    },
    fare: {
      type: Number,
      required: [true, 'Please add fare'],
      min: 0,
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Motorcycle', 'Bus', 'Van', 'Micro','Bike'],
      required: [true, 'Please add vehicle type'],
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Please add vehicle number'],
      trim: true,
    },
    driverName: {
      type: String,
      required: [true, 'Please add driver name'],
      trim: true,
    },
    driverPhone: {
      type: String,
      required: [true, 'Please add driver phone'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    preferences: {
      type: [String],
      default: [],
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    buildingName: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Ride || mongoose.model('Ride', rideSchema);
