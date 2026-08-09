/**
 * Catch-all middleware for unmatched routes.
 * Returns a JSON 404 response.
 */
const notFound = (req, res, _next) => {
  res.status(404).json({
    status: "error",
    message: `Not found — ${req.method} ${req.originalUrl}`,
  });
};

module.exports = notFound;
