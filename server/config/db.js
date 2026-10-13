const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  // If already connected or connecting, reuse the connection
  if (cachedConnection && mongoose.connection.readyState >= 1) {
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
    cachedConnection = conn;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Do not call process.exit(1) on Vercel as it crashes the entire lambda container
    throw error;
  }
};

module.exports = connectDB;
