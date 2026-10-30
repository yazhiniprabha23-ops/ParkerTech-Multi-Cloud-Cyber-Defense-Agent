
const mongoose = require("mongoose");

const findingSchema = new mongoose.Schema(
  {
    severity: {
      type: String,
      enum: ["High", "Medium"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const awsEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventTime: {
      type: Date,
      default: null,
    },
    username: {
      type: String,
      default: "Unknown",
    },
    source: {
      type: String,
      default: "Unknown",
    },
    awsRegion: {
      type: String,
      default: "ap-southeast-2",
    },
    sourceIPAddress: {
      type: String,
      default: null,
    },
    suspicious: {
      type: Boolean,
      default: false,
    },
    findings: {
      type: [findingSchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AwsEvent", awsEventSchema);
