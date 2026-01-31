const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("./middlewares/mongoSanitize");
const xss = require("./middlewares/xssClean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalError = require("./middlewares/errorMiddleware");

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

// Routes
const mountRoutes = require("./routes");
const { webhookCheckout } = require("./controllers/orderController");

const app = express();

// Stripe webhook (must be before express.json())
app.post(
  "/api/v1/orders/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout,
);

// Middlewares
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://e-commerce-frontend-five-pink.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Allow any vercel.app subdomain
      if (origin && origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.options(/.*/, cors());
app.use(compression());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(express.json({ limit: "20kb" }));
app.use(mongoSanitize());
app.use(xss());

// Rate Limiter
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  }),
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Swagger docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount Routes
mountRoutes(app);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handling Middleware
app.use(globalError);

module.exports = app;
