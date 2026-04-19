import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";

const MONGODB_URI =
  "mongodb+srv://rifatlions002_db_user:UGYLRYhddGkl2jDP@goride.p0ubr59.mongodb.net/GoRide";

async function createUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const hashedPassword = await bcrypt.hash("12341234", 10);

    const user = new User({
      name: "Test User",
      email: "okbro@gmail.com",
      studentId: "12345678",
      sex: "Male",
      department: "Computer Science",
      phone: "1234567890",
      address: "Test Address",
      password: hashedPassword,
      role: "user",
    });

    await user.save();
    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createUser();
