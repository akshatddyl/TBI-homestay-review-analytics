const { Router } = require("express");
const mongoose = require("mongoose");

const router = Router();

/**
 * GET /health
 * Returns server and database status.
 */
router.get("/", (req, res) => {
  const dbState = mongoose.connection.readyState;
  // readyState: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const dbStatus = dbState === 1 ? "connected" : "disconnected";

  res.json({
    status: "ok",
    db: dbStatus,
  });
});

module.exports = router;
