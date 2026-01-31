const mongoose = require("mongoose");

// Cache the connection for serverless environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnection = async () => {
  // Validate DB_URI
  if (!process.env.MONGO_URI) {
    throw new Error(
      "MONGO_URI environment variable is not set. Please add it to Vercel Environment Variables.",
    );
  }

  // If connection exists, reuse it
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  // If no promise exists, create a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    console.log("Attempting to connect to MongoDB...");
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, opts)
      .then((mongoose) => {
        console.log(`Database Connected: ${mongoose.connection.host}`);
        return mongoose;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("Failed to connect to database:", e.message);
    throw e;
  }

  return cached.conn;
};

module.exports = dbConnection;
