require("dotenv").config({ path: __dirname + "/../.env" });
const { classifyReviews } = require("../src/services/ai.service");

async function main() {
  console.log("Starting smoke test for AI analysis...");

  const reviews = [
    "The food was delicious.",
    "The room was dirty and smelled bad.",
    "The host was friendly but the location was hard to reach.",
  ];

  try {
    const results = await classifyReviews(reviews);
    console.log("\nResults:\n", JSON.stringify(results, null, 2));
    console.log("\nSmoke test completed successfully.");
  } catch (err) {
    console.error("Smoke test failed:", err.message);
  }
}

main();
