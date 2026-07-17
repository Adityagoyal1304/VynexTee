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
 * @param {{ name: string, email: string, password: string }} payload
 * @returns {Promise<{ _id, name, email, role, token }>}
 */
export const registerUser = async ({ name, email, password }) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

/**
 * Login an existing user.
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ _id, name, email, role, token }>}
 */
export const loginUser = async ({ email, password }) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export default { registerUser, loginUser };
