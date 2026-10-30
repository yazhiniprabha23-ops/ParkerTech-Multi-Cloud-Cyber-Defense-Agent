
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const gcpRoutes = require("./routes/gcpRoutes");

const {
  CloudTrailClient,
  LookupEventsCommand,
} = require("@aws-sdk/client-cloudtrail");

const AwsEvent = require("./models/AwsEvent");
const threatRoutes = require("./routes/threatRoutes");
const responseRoutes = require("./routes/responseRoutes");
const analyzeAwsEvent = require("./awsEventAnalyzer");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/threats", threatRoutes);
app.use("/api/responses", responseRoutes);
app.use("/api/gcp", gcpRoutes);

app.get("/api/gcp-debug", (req, res) => {
  res.json({
    message: "GCP debug route works",
    routeFile: "./routes/gcpRoutes.js",
  });
});

const cloudTrailClient = new CloudTrailClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
});

// Backend health check.
app.get("/", (req, res) => {
  res.json({
    message: "ParkerTech Cyber Defense Backend is running",
  });
});

// Retrieve, analyze, and save AWS CloudTrail events.
app.get("/api/aws/events", async (req, res) => {
  try {
    const result = await cloudTrailClient.send(
      new LookupEventsCommand({
        MaxResults: 10,
      })
    );

    const events = (result.Events || [])
      .filter((event) => event.EventId && event.EventName)
      .map((event) => {
        let details = {};

        try {
          details = JSON.parse(event.CloudTrailEvent || "{}");
        } catch {
          // Continue if optional event details cannot be parsed.
        }

        const analysis = analyzeAwsEvent(event);

        return {
          eventId: event.EventId,
          eventName: event.EventName,
          eventTime: event.EventTime || null,
          username: event.Username || "Unknown",
          source: event.EventSource || "Unknown",
          awsRegion:
            event.AwsRegion ||
            process.env.AWS_REGION ||
            "ap-southeast-2",
          sourceIPAddress: details.sourceIPAddress || null,
          suspicious: analysis.suspicious,
          findings: analysis.findings,
        };
      });

    if (events.length > 0) {
      await AwsEvent.bulkWrite(
        events.map((event) => ({
          updateOne: {
            filter: { eventId: event.eventId },
            update: { $set: event },
            upsert: true,
          },
        }))
      );
    }

    const suspiciousCount = events.filter(
      (event) => event.suspicious
    ).length;

    res.status(200).json({
      message: "AWS events retrieved, analyzed and saved successfully",
      count: events.length,
      suspiciousCount,
      events,
    });
  } catch (error) {
    console.error("AWS CloudTrail error:", error);

    res.status(500).json({
      message: "Failed to retrieve, analyze and save AWS events",
      error: error.name,
      details: error.message,
    });
  }
});

const PORT = 5050;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log("Cyber Defense Backend running on port " + PORT);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
