require("dotenv").config();

const mongoose = require("mongoose");
const Threat = require("../models/Threat");

const threats = [
  {
    type: "Brute Force Attack",
    ip: "192.168.1.45",
    cloud: "AWS",
    severity: "High",
    status: "Blocked",
    description:
      "Multiple failed authentication attempts detected from the same source IP.",
    detectedAt: new Date("2026-09-29T08:10:00"),
  },

  {
    type: "Suspicious Login",
    ip: "45.67.89.12",
    cloud: "Azure",
    severity: "Medium",
    status: "Investigating",
    description:
      "Login attempt detected from an unusual location and device.",
    detectedAt: new Date("2026-09-30T10:05:00"),
  },

  {
    type: "Malware Detected",
    ip: "103.21.45.67",
    cloud: "GCP",
    severity: "Critical",
    status: "Blocked",
    description:
      "Malicious file signature detected on a monitored cloud workload.",
    detectedAt: new Date("2026-10-01T07:58:00"),
  },

  {
    type: "Port Scanning",
    ip: "172.16.24.91",
    cloud: "AWS",
    severity: "Low",
    status: "Monitoring",
    description:
      "Repeated connection attempts detected across multiple service ports.",
    detectedAt: new Date("2026-10-01T11:20:00"),
  },

  {
    type: "Privilege Escalation Attempt",
    ip: "10.24.18.73",
    cloud: "Azure",
    severity: "High",
    status: "Investigating",
    description:
      "Unexpected attempt to access resources with elevated privileges.",
    detectedAt: new Date("2026-10-02T09:42:00"),
  },

  {
    type: "Suspicious API Request",
    ip: "64.23.91.14",
    cloud: "GCP",
    severity: "Medium",
    status: "Monitoring",
    description:
      "API activity deviated from the normal request pattern.",
    detectedAt: new Date("2026-10-03T07:35:00"),
  },

  {
    type: "Credential Attack",
    ip: "185.42.17.91",
    cloud: "AWS",
    severity: "Critical",
    status: "Blocked",
    description:
      "Repeated authentication failures indicate a possible credential attack.",
    detectedAt: new Date("2026-10-04T07:28:00"),
  },

  {
    type: "Unusual Network Traffic",
    ip: "10.10.45.22",
    cloud: "Azure",
    severity: "Low",
    status: "Monitoring",
    description:
      "Network traffic volume exceeded the normal baseline.",
    detectedAt: new Date("2026-10-04T07:20:00"),
  },
];


const seedDatabase = async () => {

  try {

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Connected to MongoDB");


    await Threat.deleteMany();

    console.log("Existing threats cleared");


    await Threat.insertMany(threats);

    console.log(
      `${threats.length} threats inserted successfully`
    );


    await mongoose.connection.close();

    console.log("Database connection closed");

  } catch (error) {

    console.error(
      "Error seeding threats:",
      error.message
    );

    process.exit(1);

  }

};


seedDatabase();