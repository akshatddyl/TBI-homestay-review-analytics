/**
 * Middleware that blocks unauthenticated requests.
 * Attach to any route that requires a logged-in user.
 */
const requireAuth = (req, res, next) => {
  if (req.user) {
    return next();
  }

  return res.status(401).json({ error: "Unauthorized" });
};

module.exports = requireAuth;
