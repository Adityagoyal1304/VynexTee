// src/store/authStore.js
// Zustand store for authentication state.
// Uses localStorage persistence so the user stays logged in on refresh.
// Completely isolated — removing this file + auth pages strips auth entirely.

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,        // { _id, name, email, role }
      token: null,       // JWT string
      isAuthenticated: false,

      /** Call after successful login or register */
      setAuth: (userData) =>
        set({
          user: {
            _id:   userData._id,
            name:  userData.name,
            email: userData.email,
            role:  userData.role,
          },
          token: userData.token,
          isAuthenticated: true,
        }),

      /** Call on logout */
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "vynex-auth", // localStorage key
    }
  )
);

export default useAuthStore;
