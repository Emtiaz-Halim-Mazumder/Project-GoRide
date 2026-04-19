import mongoose from "mongoose";

async function main() {
  await mongoose.connect("mongodb://localhost:27017/GoRide");
  const db = mongoose.connection;
  const users = await db.collection("users").find({}).toArray();
  console.log("USERS:", JSON.stringify(users, null, 2));
  process.exit(0);
}
main();
