const express = require("express");
const router = express.Router();
const { chatWithAssistant, wakeupChatbot } = require("../controllers/chatController");

router.route("/").post(chatWithAssistant);
router.route("/health").get(wakeupChatbot);

module.exports = router;

