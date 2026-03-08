import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Please add student name'],
      trim: true,
    },
    day: {
      type: String,
      required: [true, 'Please add a day'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    startTime: {
      type: String,
      required: [true, 'Please add start time'],
    },
    endTime: {
      type: String,
      required: [true, 'Please add end time'],
    },
    origin: {
      type: String,
      required: [true, 'Please add origin'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Please add destination'],
      trim: true,
    },
    autoRide: {
      type: Boolean,
      default: false,
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    seats: {
      type: Number,
      default: 1,
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Motorcycle', 'Bus', 'Van', 'Micro', 'Bike'],
      default: 'Car',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);
