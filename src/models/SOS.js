import mongoose from 'mongoose';

const sosSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Sent', 'Failed', 'Logged (Dev Mode)'],
      default: 'Sent',
    },
    errorMessage: {
      type: String,
    },
    previewUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.SOS || mongoose.model('SOS', sosSchema);
