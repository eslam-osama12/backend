const dotenv = require("dotenv");
const path = require("path");

// Load config.env only in development
// In production (Vercel), use environment variables from dashboard
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../config.env") });
}

// Validate required environment variables
const requiredEnvVars = ["DB_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
}

const app = require("../app");
const dbConnection = require("../config/db");

// Track connection promise
let isConnected = false;

// Wrapper to ensure DB is connected before handling requests
const handler = async (req, res) => {
  try {
    if (!isConnected) {
      console.log("Connecting to database...");
      await dbConnection();
      isConnected = true;
      console.log("Database connected successfully");
    }
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = handler;
