import mongoose from "mongoose";

const connectDB = async (delay = 5000) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected to ${mongoose.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.log(`⏳ Retrying in ${delay / 1000} seconds...`);
    setTimeout(() => connectDB(delay), delay);
  }
};

export default connectDB;
