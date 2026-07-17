// src/services/productService.js
// ALL API calls live here. No components call axios directly.
// To switch from mock → real backend:
//   Set VITE_API_BASE_URL=http://localhost:5000 in .env

import axios from "axios";
import { products as mockProducts } from "@/data/products";

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
 * Fetch all products, optionally filtered by category.
 * @param {string|null} category - "tshirt" | "bag" | null (all)
 * @returns {Promise<Array>}
 */
export const getProducts = async (category = null) => {
  if (BASE_URL) {
    const params = category ? { category } : {};
    const { data } = await api.get("/products", { params });
    return data;
  }
  // Mock mode
  await new Promise((r) => setTimeout(r, 400)); // simulate network
  if (!category) return mockProducts;
  return mockProducts.filter((p) => p.category === category);
};

/**
 * Fetch a single product by ID.
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const getProductById = async (id) => {
  if (BASE_URL) {
    const { data } = await api.get(`/products/${id}`);
    return data;
  }
  // Mock mode
  await new Promise((r) => setTimeout(r, 300));
  const product = mockProducts.find((p) => p._id === id);
  if (!product) throw new Error(`Product ${id} not found`);
  return product;
};

/**
 * ADMIN ONLY: Create a product
 */
export const createProduct = async (productData) => {
  const { data } = await api.post("/products", productData);
  return data;
};

/**
 * ADMIN ONLY: Update a product
 */
export const updateProduct = async (id, productData) => {
  const { data } = await api.put(`/products/${id}`, productData);
  return data;
};

/**
 * ADMIN ONLY: Delete a product
 */
export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};

/**
 * ADMIN ONLY: Upload an image
 * @param {File} file 
 * @returns {Promise<{ message: string, url: string }>}
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  
  // Override the default application/json header for this specific request
  const { data } = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

const productService = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadImage };
export default productService;
