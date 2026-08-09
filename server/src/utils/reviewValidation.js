/**
 * Validates and cleans an array of reviews.
 * @param {any} reviewsRaw - The raw input for reviews
 * @returns {string[]} An array of cleaned reviews
 * @throws {Error} If the validation fails
 */
function validateAndCleanReviews(reviewsRaw) {
  if (!Array.isArray(reviewsRaw)) {
    throw new Error("'reviews' must be an array.");
  }

  if (reviewsRaw.length === 0) {
    throw new Error("'reviews' array must not be empty.");
  }

  if (reviewsRaw.length > 20) {
    throw new Error("Maximum 20 reviews per request allowed.");
  }

  const cleaned = [];
  for (let i = 0; i < reviewsRaw.length; i++) {
    if (typeof reviewsRaw[i] !== "string") {
      throw new Error(`Review at index ${i} must be a string.`);
    }

    const trimmed = reviewsRaw[i].trim();
    if (trimmed.length > 0) {
      if (trimmed.length > 2000) {
        throw new Error(`Review at index ${i} exceeds maximum length of 2000 characters.`);
      }
      cleaned.push(trimmed);
    }
  }

  if (cleaned.length === 0) {
    throw new Error("No valid reviews provided (all were empty).");
  }

  return cleaned;
}

module.exports = {
  validateAndCleanReviews,
};
