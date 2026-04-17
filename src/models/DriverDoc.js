import mongoose from 'mongoose';

const driverDocSchema = new mongoose.Schema(
  {
    driverName: {
      type: String,
      required: [true, 'Please add driver name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add email'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add phone number'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      required: [true, 'Please add vehicle number'],
      trim: true,
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Micro', 'Bike'],
      required: [true, 'Please add vehicle type'],
    },
    licenseFileName: {
      type: String,
      required: [true, 'Please upload driving license'],
    },
    licenseOriginalName: {
      type: String,
    },
    registrationFileName: {
      type: String,
      required: [true, 'Please upload vehicle registration'],
    },
    registrationOriginalName: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.DriverDoc || mongoose.model('DriverDoc', driverDocSchema);
