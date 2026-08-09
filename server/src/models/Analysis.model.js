const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    enum: ["positive", "neutral", "negative"],
  },
  theme: {
    type: String,
    enum: ["food", "host", "location", "cleanliness", "value", "experience"],
  },
  response: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Analysis", analysisSchema);
