const mongoose = require("mongoose");

// Cache the connection for serverless environments
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const dbConnection = async () => {
  // If connection exists, reuse it
  if (cached.conn) {
    console.log("Using cached database connection");
    return cached.conn;
  }

  // If no promise exists, create a new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(process.env.DB_URI, opts)
      .then((mongoose) => {
        console.log(`Database Connected: ${mongoose.connection.host}`);
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

module.exports = dbConnection;
