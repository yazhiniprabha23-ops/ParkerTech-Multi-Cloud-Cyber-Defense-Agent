const Response = require("../models/Response");

const createResponse = async (req, res) => {
  try {
    const { action, target, cloud } = req.body;

    if (!action || !target || !cloud) {
      return res.status(400).json({
        message: "Action, target, and cloud are required",
      });
    }

    const response = await Response.create({
      action,
      target,
      cloud,
      status: "Simulated",
      mode: "Simulation",
    });

    res.status(201).json({
      message: "Response simulated successfully",
      response,
    });

  } catch (error) {

    console.error("Error creating response:", error);

    res.status(500).json({
      message: "Failed to create response",
    });

  }
};


const getResponses = async (req, res) => {
  try {

    const responses = await Response.find()
      .sort({ executedAt: -1 });

    res.status(200).json(responses);

  } catch (error) {

    console.error("Error fetching responses:", error);

    res.status(500).json({
      message: "Failed to fetch responses",
    });

  }
};


module.exports = {
  createResponse,
  getResponses,
};