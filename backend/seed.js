import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import User from "./models/User.js";

await connectDB(process.env.MONGO_URI);

const userData = {
  name: "Test User",
  collegeId: "TMU12345",
  email: "paras@tmu.ac.in",
  password: "123",
  role: "student"
};

async function seed() {
  try {
    const exists = await User.findOne({ $or: [{ email: userData.email }, { collegeId: userData.collegeId }] });
    if (exists) {
      console.log("Test user already exists");
      process.exit(0);
    }
    const user = new User(userData);
    await user.save();
    console.log("Test user created:", user.email, "password: 123");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
