const express = require("express");

const {
  createResponse,
  getResponses,
} = require("../controllers/responseController");

const router = express.Router();

router.post("/", createResponse);

router.get("/", getResponses);

module.exports = router;