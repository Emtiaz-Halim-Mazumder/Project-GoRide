import mongoose from 'mongoose';

const emergencyContactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email address'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.EmergencyContact || mongoose.model('EmergencyContact', emergencyContactSchema);
