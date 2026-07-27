// src/components/ui/ChatWidget.jsx
// Floating AI Shopping Assistant chatbot widget

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Trash2, Bot, User, Sparkles, Lock, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";
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
  const navigate = useNavigate();

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ── Chat Window ─────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="mb-4 flex flex-col w-[calc(100vw-2rem)] sm:w-96 h-[500px] max-h-[80vh] rounded-2xl shadow-2xl overflow-hidden border animate-fadeIn"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-light)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{
              backgroundColor: "var(--bg-page)",
              borderColor: "var(--border-light)",
            }}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6] text-white">
                <Sparkles size={17} />
              </div>
              <div>
                <h3
                  className="text-sm font-bold leading-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  VynexTee Assistant
                </h3>
                <p
                  className="text-[11px]"
                  style={{ color: "var(--text-muted)" }}
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
                  style={{ color: "var(--text-secondary)" }}
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
                style={{ color: "var(--text-secondary)" }}
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
                style={{ backgroundColor: "var(--accent-glow)" }}
              >
                <Bot size={30} style={{ color: "var(--accent)" }} />
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
                  style={{ color: "var(--text-primary)" }}
                >
                  Sign In to Chat with AI
                </h4>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
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
                    color: "var(--text-primary)",
                    borderColor: "var(--border-light)",
                  }}
                >
                  <UserPlus size={15} />
                  Create Free Account
                </button>
              </div>

              <p className="text-[10px] pt-1" style={{ color: "var(--text-muted)" }}>
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
                      style={{ backgroundColor: "var(--accent-glow)" }}
                    >
                      <Bot size={24} style={{ color: "var(--accent)" }} />
                    </div>
                    <p
                      className="text-sm font-semibold mt-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Hi there! 👋
                    </p>
                    <p
                      className="text-xs max-w-[240px]"
                      style={{ color: "var(--text-muted)" }}
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
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-white mt-0.5">
                            <Bot size={14} />
                          </div>
                        )}
                        <div
                          className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                            isUser
                              ? "bg-[#3b82f6] text-white rounded-tr-sm"
                              : "rounded-tl-sm"
                          }`}
                          style={
                            isUser
                              ? {}
                              : {
                                  backgroundColor: "var(--bg-page)",
                                  color: "var(--text-primary)",
                                  border: "1px solid var(--border-light)",
                                }
                          }
                        >
                          {msg.content}
                        </div>
                        {isUser && (
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white mt-0.5">
                            <User size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {isLoading && (
                  <div className="flex items-center gap-2 justify-start">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#3b82f6] text-white">
                      <Bot size={14} />
                    </div>
                    <div
                      className="px-3.5 py-2 rounded-2xl rounded-tl-sm text-xs flex items-center gap-1"
                      style={{
                        backgroundColor: "var(--bg-page)",
                        color: "var(--text-muted)",
                        border: "1px solid var(--border-light)",
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
                className="flex items-center gap-2 p-3 border-t"
                style={{
                  backgroundColor: "var(--bg-page)",
                  borderColor: "var(--border-light)",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about T-shirts, bags, sizes..."
                  className="flex-1 bg-transparent px-3 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
                  style={{
                    color: "var(--text-primary)",
                    borderColor: "var(--border-light)",
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
