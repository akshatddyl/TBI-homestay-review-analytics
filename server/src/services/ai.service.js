const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Normalizes sentiment and theme to allowed values,
 * and provides fallbacks if Gemini returns invalid ones.
 */
function normalizeResult(rawResult, originalReview) {
  const allowedSentiments = ["positive", "neutral", "negative"];
  const allowedThemes = ["food", "host", "location", "cleanliness", "value", "experience"];

  let sentiment = (rawResult.sentiment || "").toLowerCase().trim();
  let theme = (rawResult.theme || "").toLowerCase().trim();
  let response = (rawResult.response || "").trim();

  if (!allowedSentiments.includes(sentiment)) {
    sentiment = "neutral";
  }

  if (!allowedThemes.includes(theme)) {
    theme = "experience";
  }

  if (!response) {
    if (sentiment === "positive" || sentiment === "neutral") {
      response = "Thank you for your feedback.";
    } else {
      response = "We are sorry and will work to improve.";
    }
  }

  return {
    review: originalReview, // Always trust original input
    sentiment,
    theme,
    response,
  };
}

/**
 * Classifies an array of reviews using Gemini API.
 * @param {string[]} reviews - Array of review strings
 * @returns {Promise<Array>} Array of classification results
 */
async function classifyReviews(reviews) {
  if (!reviews || reviews.length === 0) return [];

  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";

  if (!apiKey) {
    const err = new Error("AI service is currently unavailable.");
    err.status = 502; // Bad Gateway
    throw err;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: modelName });

  const prompt = `
You are a hospitality assistant for Trishul Eco-Homestays.
Analyze the following guest reviews and return a strict JSON array of objects.

For each review, provide:
- "sentiment": must be exactly one of "positive", "neutral", or "negative".
- "theme": must be exactly one of "food", "host", "location", "cleanliness", "value", or "experience". Choose only the single most prominent theme.
- "response": a professional suggested management response. Must be one line, under 20 words. No markdown, no links. Positive: thank warmly. Neutral: thank and acknowledge. Negative: apologize briefly and mention improvement.

Rules:
- Output length MUST exactly match the input length, in the exact same order.
- Return ONLY valid JSON array. Do not include markdown code fences (e.g. \`\`\`json).
- Do NOT provide explanations.

Reviews:
${JSON.stringify(reviews, null, 2)}
`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0,
        responseMimeType: "application/json",
      },
    });

    const responseText = result.response.text();
    
    // Safely parse JSON
    let parsedData = null;
    let cleanText = responseText.trim();
    
    // Remove markdown code blocks if somehow present
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.substring(7);
      if (cleanText.endsWith("```")) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.substring(3);
      if (cleanText.endsWith("```")) {
        cleanText = cleanText.substring(0, cleanText.length - 3);
      }
    }

    try {
      parsedData = JSON.parse(cleanText);
    } catch (e) {
      // Regex extraction fallback if JSON.parse fails
      const match = responseText.match(/\\[[\\s\\S]*\\]/);
      if (match) {
        try {
          parsedData = JSON.parse(match[0]);
        } catch (e2) {
          parsedData = null;
        }
      }
    }

    if (!Array.isArray(parsedData)) {
      parsedData = [];
    }

    // Map results keeping input order and handling missing/extra items
    return reviews.map((review, index) => {
      const rawResult = parsedData[index] || {};
      return normalizeResult(rawResult, review);
    });

  } catch (error) {
    console.error("[AI Service] Error:", error.message);
    const err = new Error("AI service is currently unavailable.");
    err.status = 502;
    throw err;
  }
}

module.exports = {
  classifyReviews,
};
