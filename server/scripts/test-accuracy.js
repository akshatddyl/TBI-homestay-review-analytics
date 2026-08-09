const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const { classifyReviews } = require("../src/services/ai.service");
const testData = require("./test-reviews.json");

const REPORT_PATH = path.join(__dirname, "../../docs/test-report.md");

async function runAccuracyTest() {
  console.log("Starting Accuracy Test on 20 Reviews...");
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("Error: GEMINI_API_KEY is not set in server/.env");
    process.exit(1);
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
  const reviewsToAnalyze = testData.map(d => d.review);

  try {
    const results = await classifyReviews(reviewsToAnalyze);
    
    let sentimentCorrectCount = 0;
    let themeCorrectCount = 0;
    let combinedCorrectCount = 0;
    const reportRows = [];

    for (let i = 0; i < testData.length; i++) {
      const expected = testData[i];
      // Fallback in case results are fewer than expected
      const predicted = results[i] || { sentiment: "neutral", theme: "experience", response: "" };

      const isSentimentCorrect = predicted.sentiment === expected.expectedSentiment;
      const isThemeCorrect = predicted.theme === expected.expectedTheme;
      const isCombinedCorrect = isSentimentCorrect && isThemeCorrect;

      if (isSentimentCorrect) sentimentCorrectCount++;
      if (isThemeCorrect) themeCorrectCount++;
      if (isCombinedCorrect) combinedCorrectCount++;

      // Clean up response string for markdown table
      const safeResponse = (predicted.response || "").replace(/\\|/g, "-");

      reportRows.push(
        `| ${expected.review} | ${expected.expectedSentiment} | ${predicted.sentiment} | ${expected.expectedTheme} | ${predicted.theme} | ${safeResponse} | ${isCombinedCorrect ? "✅" : "❌"} |`
      );
    }

    const total = testData.length;
    const sentimentAcc = ((sentimentCorrectCount / total) * 100).toFixed(1);
    const themeAcc = ((themeCorrectCount / total) * 100).toFixed(1);
    const combinedAcc = ((combinedCorrectCount / total) * 100).toFixed(1);

    const reportContent = `
# Perlogo AI Accuracy Test Report

- **Date:** ${new Date().toLocaleDateString()}
- **Model Used:** ${modelName}
- **Total Reviews Evaluated:** ${total}

## Summary Metrics

- **Sentiment Accuracy:** ${sentimentAcc}% (${sentimentCorrectCount}/${total})
- **Theme Accuracy:** ${themeAcc}% (${themeCorrectCount}/${total})
- **Combined Accuracy (Strict):** ${combinedAcc}% (${combinedCorrectCount}/${total})

*(A review is considered correct in "Combined Accuracy" only if both the Sentiment and Theme precisely match expectations.)*

## Detailed Results Table

| Review | Expected Sentiment | Predicted Sentiment | Expected Theme | Predicted Theme | Suggested Response | Correct |
| ------ | ------------------ | ------------------- | -------------- | --------------- | ------------------ | ------- |
${reportRows.join("\n")}
    `.trim();

    fs.writeFileSync(REPORT_PATH, reportContent, "utf8");
    console.log(`Test complete! Report successfully generated at:\n${REPORT_PATH}`);
    console.log(`\nSentiment Accuracy: ${sentimentAcc}%`);
    console.log(`Theme Accuracy: ${themeAcc}%`);
    console.log(`Combined Accuracy: ${combinedAcc}%`);

  } catch (err) {
    console.error("AI service failed during test:\n", err.message);
    process.exit(1);
  }
}

runAccuracyTest();
