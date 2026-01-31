const dotenv = require("dotenv");
const path = require("path");

// Load config.env only in development
// In production (Vercel), use environment variables from dashboard
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.resolve(__dirname, "../config.env") });
}

const app = require("../app");
const dbConnection = require("../config/db");

// Track connection promise
let isConnected = false;

// Wrapper to ensure DB is connected before handling requests
const handler = async (req, res) => {
  if (!isConnected) {
    await dbConnection();
    isConnected = true;
  }
  return app(req, res);
};

module.exports = handler;
