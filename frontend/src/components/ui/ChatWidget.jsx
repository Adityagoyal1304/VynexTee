// src/components/ui/ChatWidget.jsx
// Floating AI Shopping Assistant chatbot widget

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Trash2, Bot, User, Sparkles, Lock, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";
import { useTheme } from "@/context/ThemeContext";
import { sendMessage } from "@/services/chatService";

const ChatWidget = () => {
  const {
    messages,
    isOpen,
    isLoading,
    addMessage,
    toggleOpen,
    setLoading,
    clearChat,
  } = useChatStore();

  const { user, isAuthenticated } = useAuthStore();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // INVERTED THEME:
  // If website isDark (dark theme) -> chatbot uses light theme
  // If website isLight (light theme) -> chatbot uses dark theme
  const chatIsDark = !isDark;

  const themeStyles = {
    cardBg: chatIsDark ? "#0f172a" : "#ffffff",
    headerBg: chatIsDark ? "#1e293b" : "#f8fafc",
    inputBg: chatIsDark ? "#1e293b" : "#f8fafc",
    textPrimary: chatIsDark ? "#f8fafc" : "#0f172a",
    textMuted: chatIsDark ? "#94a3b8" : "#64748b",
    textSecondary: chatIsDark ? "#cbd5e1" : "#475569",
    border: chatIsDark ? "#334155" : "#e2e8f0",
    botBubbleBg: chatIsDark ? "#1e293b" : "#f1f5f9",
    botBubbleText: chatIsDark ? "#f8fafc" : "#0f172a",
    botBubbleBorder: chatIsDark ? "#334155" : "#cbd5e1",
    accentGlow: chatIsDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.08)",
    shadow: chatIsDark
      ? "0 25px 50px -12px rgba(0, 0, 0, 0.75)"
      : "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
  };

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevUserIdRef = useRef(user?._id || null);

  useEffect(() => {
    const currentUserId = user?._id || null;
    if (prevUserIdRef.current !== currentUserId) {
      clearChat();
      prevUserIdRef.current = currentUserId;
    }
  }, [user?._id, clearChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages, isLoading]);

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    const userMsg = { role: "user", content: text };
    addMessage(userMsg);

    // Send the last 10 messages as history
    const historyToSend = messages.slice(-10);

    setLoading(true);
    try {
      const response = await sendMessage(text, historyToSend);
      if (response?.reply) {
        addMessage({ role: "assistant", content: response.reply });
      } else {
        toast.error("Received an empty response from chat assistant.");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Chat assistant is unavailable right now.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* ── Chat Window ─────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="mb-4 flex flex-col w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[calc(100vh-120px)] rounded-2xl overflow-hidden border animate-fadeIn transition-all duration-300"
          style={{
            backgroundColor: themeStyles.cardBg,
            borderColor: themeStyles.border,
            boxShadow: themeStyles.shadow,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b transition-colors duration-300"
            style={{
              backgroundColor: themeStyles.headerBg,
              borderColor: themeStyles.border,
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6] text-white shadow-sm">
                <Sparkles size={17} />
              </div>
              <div>
                <h3
                  className="text-sm font-bold leading-tight"
                  style={{ color: themeStyles.textPrimary }}
                >
                  VynexTee Assistant
                </h3>
                <p
                  className="text-[11px]"
                  style={{ color: themeStyles.textMuted }}
                >
                  {isAuthenticated && user?.name
                    ? `Personal Guide for ${user.name.split(" ")[0]}`
                    : "AI Shopping Guide"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {isAuthenticated && messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    clearChat();
                    toast.success("Chat cleared");
                  }}
                  title="Clear chat"
                  className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                  style={{ color: themeStyles.textSecondary }}
                  aria-label="Clear chat"
                >
                  <Trash2 size={15} />
                </button>
              )}
              <button
                type="button"
                onClick={toggleOpen}
                title="Close chat"
                className="p-1.5 rounded-lg transition-colors hover:bg-white/10"
                style={{ color: themeStyles.textSecondary }}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {!isAuthenticated ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner relative"
                style={{ backgroundColor: themeStyles.accentGlow }}
              >
                <Bot size={30} className="text-[#3b82f6]" />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#3b82f6] text-white shadow">
                  <Lock size={12} />
                </div>
              </div>

              <div className="space-y-1.5 max-w-[260px]">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  ✨ Members Only Feature
                </span>
                <h4
                  className="text-base font-bold"
                  style={{ color: themeStyles.textPrimary }}
                >
                  Sign In to Chat with AI
                </h4>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: themeStyles.textMuted }}
                >
                  Sign in to get instant answers about stock, sizes, fabrics, and personalized VynexTee shopping advice.
                </p>
              </div>

              <div className="flex flex-col w-full gap-2 pt-2 max-w-[240px]">
                <button
                  type="button"
                  onClick={() => {
                    toggleOpen();
                    navigate("/login");
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-medium text-xs bg-[#3b82f6] text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-600 hover:shadow-blue-500/30"
                >
                  <LogIn size={15} />
                  Sign In to Continue
                </button>

                <button
                  type="button"
                  onClick={() => {
                    toggleOpen();
                    navigate("/register");
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl font-medium text-xs border transition-colors hover:bg-white/5"
                  style={{
                    color: themeStyles.textPrimary,
                    borderColor: themeStyles.border,
                  }}
                >
                  <UserPlus size={15} />
                  Create Free Account
                </button>
              </div>

              <p className="text-[10px] pt-1" style={{ color: themeStyles.textMuted }}>
                🔒 Your conversation is private and cleared on logout.
              </p>
            </div>
          ) : (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4 gap-2">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: themeStyles.accentGlow }}
                    >
                      <Bot size={24} className="text-[#3b82f6]" />
                    </div>
                    <p
                      className="text-sm font-semibold mt-1"
                      style={{ color: themeStyles.textPrimary }}
                    >
                      Hi there! 👋
                    </p>
                    <p
                      className="text-xs max-w-[240px]"
                      style={{ color: themeStyles.textMuted }}
                    >
                      Ask me anything about VynexTee T-shirts, premium bags, pricing, or stock.
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isUser = msg.role === "user";
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-2 ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isUser && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-white mt-0.5 shadow-sm">
                            <Bot size={14} />
                          </div>
                        )}
                        <div
                          className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                            isUser
                              ? "bg-[#3b82f6] text-white rounded-tr-sm shadow-sm"
                              : "rounded-tl-sm shadow-sm"
                          }`}
                          style={
                            isUser
                              ? {}
                              : {
                                  backgroundColor: themeStyles.botBubbleBg,
                                  color: themeStyles.botBubbleText,
                                  border: `1px solid ${themeStyles.botBubbleBorder}`,
                                }
                          }
                        >
                          {msg.content}
                        </div>
                        {isUser && (
                          <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white mt-0.5 shadow-sm"
                            style={{ backgroundColor: "#3b82f6" }}
                          >
                            <User size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {isLoading && (
                  <div className="flex items-center gap-2 justify-start">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-white shadow-sm">
                      <Bot size={14} />
                    </div>
                    <div
                      className="px-3.5 py-2 rounded-2xl rounded-tl-sm text-xs flex items-center gap-1 shadow-sm"
                      style={{
                        backgroundColor: themeStyles.botBubbleBg,
                        color: themeStyles.textMuted,
                        border: `1px solid ${themeStyles.botBubbleBorder}`,
                      }}
                    >
                      <span>typing…</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 p-3 border-t transition-colors duration-300"
                style={{
                  backgroundColor: themeStyles.inputBg,
                  borderColor: themeStyles.border,
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about T-shirts, bags, sizes..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#3b82f6] transition-colors"
                  style={{
                    color: themeStyles.textPrimary,
                    borderColor: themeStyles.border,
                  }}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3b82f6] text-white transition-all hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* ── Toggle Button ───────────────────────────────────────── */}
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={isOpen ? "Close assistant" : "Open shopping assistant"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3b82f6] text-white shadow-lg shadow-blue-500/30 transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatWidget;
