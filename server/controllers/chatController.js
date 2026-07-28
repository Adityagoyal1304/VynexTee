const axios = require("axios");

// @desc    Chat with AI assistant microservice
// @route   POST /api/chat
// @access  Public
const chatWithAssistant = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 500
    ) {
      return res.status(400).json({
        message:
          "Invalid message: must be a non-empty string up to 500 characters.",
      });
    }

    if (history !== undefined && !Array.isArray(history)) {
      return res.status(400).json({
        message: "Invalid history: must be an array.",
      });
    }

    const chatbotUrl = (
      process.env.CHATBOT_SERVICE_URL || "http://localhost:8000"
    ).replace(/\/$/, "");

    try {
      const response = await axios.post(`${chatbotUrl}/chat`, {
        message: message.trim(),
        history: Array.isArray(history) ? history : [],
      }, { timeout: 60000 }); // 60s timeout to handle Render cold starts
      return res.json(response.data);
    } catch (error) {
      console.error("Chatbot microservice error:", error.message);
      const isTimeout = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
      return res.status(502).json({
        message: isTimeout
          ? "Chat assistant is waking up, please try again in a moment."
          : "Chat assistant is unavailable right now.",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chatWithAssistant,
};
