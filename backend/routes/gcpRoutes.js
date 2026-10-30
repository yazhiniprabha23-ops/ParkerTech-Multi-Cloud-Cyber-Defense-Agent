
const express = require("express");
const { execFile } = require("child_process");
const path = require("path");

const router = express.Router();

const PROJECT_ID = "project-43eab600-e619-48f2-bb1";
const GCLOUD = path.join(
  process.env.HOME,
  "Downloads/google-cloud-sdk/bin/gcloud"
);

const analyzer = require("../gcpEventAnalyzer");

function analyzeEvent(event) {
  if (typeof analyzer !== "function") return event;

  try {
    const result = analyzer(event);

    if (result && typeof result === "object") {
      return { ...event, ...result, simulated: false };
    }
  } catch (error) {
    console.error("GCP analyzer error:", error.message);
  }

  return event;
}

function getRealLogs() {
  return new Promise((resolve, reject) => {
    execFile(
      GCLOUD,
      [
        "logging",
        "read",
        'logName:"cloudaudit.googleapis.com" AND timestamp >= "2026-09-24T00:00:00Z"',
        `--project=${PROJECT_ID}`,
        "--limit=50",
        "--format=json"
      ],
      {
        timeout: 60000,
        maxBuffer: 10 * 1024 * 1024
      },
      (error, stdout, stderr) => {
        if (error) {
          console.error("GCP logging command failed:", error.message);
          console.error("GCP details:", stderr);
          reject(error);
          return;
        }

        try {
          const logs = JSON.parse(stdout || "[]");
          resolve(logs);
        } catch (parseError) {
          reject(new Error("Invalid JSON returned by gcloud"));
        }
      }
    );
  });
}

function normalizeEntry(entry) {
  const payload = entry.protoPayload || {};
  const methodName = payload.methodName || "Unknown";
  const principalEmail =
    payload.authenticationInfo?.principalEmail || "Unknown";

  return analyzeEvent({
    id: entry.insertId || `${entry.timestamp}-${methodName}`,
    timestamp: entry.timestamp || new Date().toISOString(),
    provider: "GCP",
    methodName,
    principalEmail,
    serviceName: payload.serviceName || "Google Cloud",
    resourceName: payload.resourceName || PROJECT_ID,
    severity: entry.severity || "DEFAULT",
    message: `${methodName} performed by ${principalEmail}`,
    suspicious: false,
    simulated: false,
    raw: entry
  });
}

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "GCP routes are working",
    projectId: PROJECT_ID
  });
});

router.get("/real-events", async (req, res) => {
  console.log("GCP REAL-EVENTS ROUTE HIT");
  try {
    const entries = await getRealLogs();
    console.log("GCP ROUTE FILE:", __filename);
    console.log("GCP RAW LOG COUNT:", entries.length);
    const events = entries.map(normalizeEntry);

    res.json({
      source: "Google Cloud Audit Logs",
      simulated: false,
      projectId: PROJECT_ID,
      count: events.length,
      suspiciousCount: events.filter(
        event =>
          event.suspicious === true ||
          event.isSuspicious === true ||
          event.threat === true
      ).length,
      events
    });
  } catch (error) {
    console.error("GCP real-events error:", error.message);

    res.status(502).json({
      source: "Google Cloud Audit Logs",
      simulated: false,
      projectId: PROJECT_ID,
      count: 0,
      suspiciousCount: 0,
      events: [],
      error: "Could not retrieve real Google Cloud audit logs."
    });
  }
});

module.exports = router;
