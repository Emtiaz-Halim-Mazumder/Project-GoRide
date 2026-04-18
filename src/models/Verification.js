import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Please add an email"],
      trim: true,
      lowercase: true,
    },

    sex: {
      type: String,
      required: false,
    },

    department: {
      type: String,
      required: false,
    },

    phone: {
      type: String,
      required: false,
    },

    address: {
      type: String,
      required: false,
    },

    // 🆕 Uploaded images (2-file system)
    barcodeImage: {
      type: String, // file path or URL
      required: true,
    },

    idCardImage: {
      type: String, // file path or URL
      required: true,
    },

    // 🆕 Extracted values from processing
    extractedBarcode: {
      type: String,
    },

    extractedStudentId: {
      type: String,
    },

    // 🟡 Verification status
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    // 🆕 Helpful debugging / audit field
    mismatchReason: {
      type: String, // e.g. "barcode_not_match", "ocr_failed"
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Verification ||
  mongoose.model("Verification", verificationSchema);