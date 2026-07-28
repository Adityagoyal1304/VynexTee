// src/services/chatService.js
// Service for AI shopping assistant chat API calls

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL ? `${BASE_URL}/api` : "/api",
  headers: { "Content-Type": "application/json" },
});

/**
 * Send a chat message to the AI shopping assistant.
 * @param {string} message - User message
 * @param {Array<{role: string, content: string}>} history - Previous conversation messages
 * @returns {Promise<{reply: string}>}
 */
export const sendMessage = async (message, history = []) => {
  const { data } = await api.post("/chat", { message, history });
  return data;
};

/**
 * Wake up the AI chatbot service in the background.
 */
export const wakeupChatbot = async () => {
  try {
    await api.get("/chat/health");
  } catch (error) {
    // Ignore errors for background wakeup
  }
};

const chatService = { sendMessage, wakeupChatbot };
export default chatService;

