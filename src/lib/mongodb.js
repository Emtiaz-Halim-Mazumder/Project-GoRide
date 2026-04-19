import mongoose from "mongoose";
import validateEnv from "./env.js";

validateEnv();

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectMongoDB(maxRetries = 3) {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    // Retry logic for transient errors
    if (maxRetries > 1 && !error.message.includes("authentication")) {
      console.warn(
        `MongoDB connection failed (attempts left: ${maxRetries - 1}):`,
        error.message,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * (4 - maxRetries)),
      ); // Exponential backoff
      return connectMongoDB(maxRetries - 1);
    }

    // Atlas-specific guidance
    if (
      error.message.includes("whitelist") ||
      error.message.includes("IP Access") ||
      error.message.includes("access from an IP")
    ) {
      throw new Error(
        `Atlas IP Whitelist Error: ${error.message}\n` +
          "Fix: 1) Go to https://cloud.mongodb.com/ > Network Access > Add IP 0.0.0.0/0 (dev) or your IP.\n" +
          "2) Or use Network Access > Add Current IP Address.\n" +
          "Your IP: Check via https://whatismyipaddress.com/",
      );
    }

    console.error("❌ MongoDB Connection Error:", {
      message: error.message,
      code: error.code,
      uri: MONGODB_URI.replace(/\/\/[^@]*@/, "//***:***@"), // Hide creds
    });
    throw error;
  }

  return cached.conn;
}

export default connectMongoDB;
