const express = require("express");

const {
  getThreats,
  getThreatStats,
} = require("../controllers/threatController");

const router = express.Router();

router.get("/stats", getThreatStats);
router.get("/", getThreats);

module.exports = router;