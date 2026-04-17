import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    rideId: {
      type: String,
      required: [true, 'Please add ride ID'],
      index: true,
    },
    senderName: {
      type: String,
      required: [true, 'Please add sender name'],
      trim: true,
    },
    senderRole: {
      type: String,
      enum: ['driver', 'rider'],
      default: 'rider',
    },
    content: {
      type: String,
      required: [true, 'Message cannot be empty'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
