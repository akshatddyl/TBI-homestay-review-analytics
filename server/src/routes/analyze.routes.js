const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const requireAuth = require("../middleware/requireAuth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const { validateAndCleanReviews } = require("../utils/reviewValidation");
const { classifyReviews } = require("../services/ai.service");
const Analysis = require("../models/Analysis.model");

const router = Router();

// Apply rate limiting: 15 minute window, max 20 requests per IP
const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    status: "error",
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * POST /analyze
 * Analyze an array of reviews using the Gemini API.
 */
router.post(
  "/",
  requireAuth,
  analyzeLimiter,
  asyncHandler(async (req, res) => {
    const { reviews: rawReviews } = req.body;

    let cleanedReviews;
    try {
      cleanedReviews = validateAndCleanReviews(rawReviews);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    // Call AI service
    const results = await classifyReviews(cleanedReviews);

    // Save each result to MongoDB
    const analysisDocs = results.map((result) => ({
      userId: req.user._id,
      review: result.review,
      sentiment: result.sentiment,
      theme: result.theme,
      response: result.response,
    }));

    await Analysis.insertMany(analysisDocs);

    return res.json({ results });
  })
);

module.exports = router;
