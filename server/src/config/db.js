const mongoose = require("mongoose");

/**
 * Connect to MongoDB using Mongoose.
 * Exits the process with code 1 if MONGODB_URI is missing or connection fails.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("[DB] MONGODB_URI is not set in environment variables. Exiting.");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`[DB] MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
