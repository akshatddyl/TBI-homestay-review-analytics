const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const connectDB = require("./config/db");
const healthRoutes = require("./routes/health.routes");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

// ---------------------------------------------------------------------------
// App setup
// ---------------------------------------------------------------------------
const app = express();

app.set("trust proxy", 1);

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(express.json({ limit: "1mb" }));

// CORS — support comma-separated FRONTEND_URL values
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS not allowed for origin: ${origin}`));
      }
    },
    credentials: true,
  })
);

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/health", healthRoutes);

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[SERVER] Running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
    console.log(`[SERVER] CORS allowed origins: ${allowedOrigins.join(", ")}`);
  });
};

start();
