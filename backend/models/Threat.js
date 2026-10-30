const mongoose = require("mongoose");

const threatSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },

    ip: {
      type: String,
      required: true,
      trim: true,
    },

    cloud: {
      type: String,
      required: true,
      enum: ["AWS", "Azure", "GCP"],
    },

    severity: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High", "Critical"],
    },

    status: {
      type: String,
      required: true,
      enum: ["Monitoring", "Investigating", "Blocked", "Resolved"],
      default: "Monitoring",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    detectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Threat", threatSchema);