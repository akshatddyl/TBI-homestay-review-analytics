/**
 * Centralized error-handling middleware.
 * Catches errors forwarded by routes / other middleware and
 * returns a consistent JSON error response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  const statusCode = res.statusCode && res.statusCode >= 400 ? res.statusCode : 500;

  console.error(`[ERROR] ${err.message}`);
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
