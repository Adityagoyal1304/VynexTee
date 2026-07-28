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

    const makeChatRequest = async () => {
      return await axios.post(
        `${chatbotUrl}/chat`,
        {
          message: message.trim(),
          history: Array.isArray(history) ? history : [],
        },
        { timeout: 60000 }
      );
    };

    try {
      const response = await makeChatRequest();
      return res.json(response.data);
    } catch (error) {
      const isTimeout =
        error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";

      // Retry once if it was a timeout (cold start waking up)
      if (isTimeout) {
        try {
          console.log("Chatbot timeout on 1st attempt, retrying once...");
          const retryResponse = await makeChatRequest();
          return res.json(retryResponse.data);
        } catch (retryError) {
          console.error("Chatbot retry also failed:", {
            code: retryError.code,
            status: retryError.response?.status,
            body: retryError.response?.data,
          });
        }
      }

      console.error("Chatbot error:", {
        code: error.code,
        status: error.response?.status,
        body: error.response?.data,
      });

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

// @desc    Wake up / health check AI assistant microservice
// @route   GET /api/chat/health
// @access  Public
const wakeupChatbot = async (req, res) => {
  const chatbotUrl = (
    process.env.CHATBOT_SERVICE_URL || "http://localhost:8000"
  ).replace(/\/$/, "");

  try {
    await axios.get(`${chatbotUrl}/health`, { timeout: 90000 });
    res.json({ status: "ok" });
  } catch (error) {
    console.error("Chatbot health ping failed:", error.message);
    res.status(502).json({ status: "waking" });
  }
};

module.exports = {
  chatWithAssistant,
  wakeupChatbot,
};

