import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL ? `${BASE_URL}/api` : "",
  headers: { "Content-Type": "application/json" },
});

// Intercept requests to attach token if user is logged in
api.interceptors.request.use((config) => {
  const authState = localStorage.getItem("vynex-auth");
  if (authState) {
    try {
      const parsed = JSON.parse(authState);
      const token = parsed?.state?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.error("Could not parse auth token", err);
    }
  }
  return config;
});

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
  const { data } = await api.post("/orders", orderData);
  return data;
};

/**
 * Get current user's orders
 */
export const getMyOrders = async () => {
  const { data } = await api.get("/orders/myorders");
  return data;
};

/**
 * Get order by ID
 */
export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data;
};

/**
 * ADMIN ONLY: Get all orders
 */
export const getAllOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};

/**
 * ADMIN ONLY: Update order status
 */
export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(`/orders/${id}/status`, { status });
  return data;
};

const orderService = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
export default orderService;
