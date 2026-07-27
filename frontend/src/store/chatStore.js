// src/store/chatStore.js
// Zustand chat store with localStorage persistence for messages

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChatStore = create(
  persist(
    (set) => ({
      messages: [],
      isOpen: false,
      isLoading: false,

      // ── Actions ─────────────────────────────────────────────────
      addMessage: (msg) =>
        set((state) => ({
          messages: [...state.messages, msg],
        })),

      toggleOpen: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),

      setLoading: (val) =>
        set({
          isLoading: val,
        }),

      clearChat: () =>
        set({
          messages: [],
        }),
    }),
    {
      name: "vynextee-chat", // localStorage key
      // Only persist the messages array — exclude UI states like isOpen and isLoading
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);

export { useChatStore };
export default useChatStore;
