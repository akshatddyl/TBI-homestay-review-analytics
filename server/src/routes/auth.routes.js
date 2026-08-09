const { Router } = require("express");
const passport = require("passport");

const router = Router();

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
// Use the first origin for redirects (comma-separated support)
const redirectBase = FRONTEND_URL.split(",")[0].trim();

/**
 * GET /auth/google
 * Kick off the Google OAuth consent screen.
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

/**
 * GET /auth/google/callback
 * Handle the OAuth redirect from Google.
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${redirectBase}/login?error=google`,
  }),
  (req, res) => {
    res.redirect(`${redirectBase}/dashboard`);
  }
);

/**
 * GET /auth/me
 * Return the currently authenticated user or 401.
 */
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, displayName, email, avatar } = req.user;
    return res.json({
      user: { id: _id, displayName, email, avatar },
    });
  }

  return res.status(401).json({ user: null });
});

/**
 * POST /auth/logout
 * Destroy session, clear cookie, return success.
 */
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);

      res.clearCookie("perlogo_sid");
      return res.json({ success: true });
    });
  });
});

module.exports = router;
