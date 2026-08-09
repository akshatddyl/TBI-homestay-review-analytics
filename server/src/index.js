const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const passport = require("passport");

const connectDB = require("./config/db");
const configurePassport = require("./config/passport");
const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");

// ---------------------------------------------------------------------------
// Environment validation
// ---------------------------------------------------------------------------
const REQUIRED_ENV = [
  "MONGODB_URI",
  "SESSION_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "FRONTEND_URL",
];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[ENV] Missing required environment variables:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}

const IS_PROD = process.env.NODE_ENV === "production";

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
const allowedOrigins = process.env.FRONTEND_URL
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
// Session + Passport
// ---------------------------------------------------------------------------
app.use(
  session({
    name: "perlogo_sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

configurePassport();
app.use(passport.initialize());
app.use(passport.session());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/health", healthRoutes);
app.use("/auth", authRoutes);

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
