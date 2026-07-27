const express = require("express");
const router = express.Router();
const { chatWithAssistant } = require("../controllers/chatController");

router.route("/").post(chatWithAssistant);

module.exports = router;
