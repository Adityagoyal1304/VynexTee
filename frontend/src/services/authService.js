// src/services/authService.js
// ALL auth API calls live here. Completely isolated — remove this file
// along with LoginPage, RegisterPage, and authStore to strip auth entirely.

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL ? `${BASE_URL}/api` : "",
  headers: { "Content-Type": "application/json" },
});

/**
 * Register a new user.
 */
export const registerUser = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

/**
 * Login an existing user.
 */
export const loginUser = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

/**
 * Request a password reset email.
 */
export const forgotPasswordRequest = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

/**
 * Reset password using token from email link.
 */
export const resetPasswordRequest = async (token, password) => {
  const { data } = await api.put(`/auth/reset-password/${token}`, { password });
  return data;
};

export default { registerUser, loginUser, forgotPasswordRequest, resetPasswordRequest };
