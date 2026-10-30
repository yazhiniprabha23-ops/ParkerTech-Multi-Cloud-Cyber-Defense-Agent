const Threat = require("../models/Threat");

const getThreats = async (req, res) => {
  try {
    const threats = await Threat.find()
      .sort({ detectedAt: -1 });

    res.status(200).json(threats);
  } catch (error) {
    console.error("Error fetching threats:", error);

    res.status(500).json({
      message: "Failed to fetch threats",
    });
  }
};

const getThreatStats = async (req, res) => {
  try {
    const [critical, blocked, monitoring, secure] = await Promise.all([
      Threat.countDocuments({ severity: "Critical" }),
      Threat.countDocuments({ status: "Blocked" }),
      Threat.countDocuments({ status: "Monitoring" }),
      Threat.countDocuments({
        status: "Resolved",
      }),
    ]);

    res.status(200).json({
      critical,
      blocked,
      monitoring,
      secure,
    });
  } catch (error) {
    console.error("Error fetching threat statistics:", error);

    res.status(500).json({
      message: "Failed to fetch threat statistics",
    });
  }
};

module.exports = {
  getThreats,
  getThreatStats,
};