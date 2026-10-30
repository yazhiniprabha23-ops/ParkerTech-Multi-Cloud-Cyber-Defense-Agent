const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        "Block Source IP",
        "Isolate Workload",
        "Disable Credential",
        "Generate Alert"
      ],
    },

    target: {
      type: String,
      required: true,
      trim: true,
    },

    cloud: {
      type: String,
      required: true,
      enum: ["AWS", "Azure", "GCP"],
    },

    status: {
      type: String,
      required: true,
      enum: ["Simulated", "Completed", "Failed"],
      default: "Simulated",
    },

    mode: {
      type: String,
      default: "Simulation",
    },

    executedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Response", responseSchema);