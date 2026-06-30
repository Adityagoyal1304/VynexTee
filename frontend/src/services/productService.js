// src/services/productService.js
// ALL API calls live here. No components call axios directly.
// To switch from mock → real backend:
//   Set VITE_API_BASE_URL=http://localhost:5000 in .env

import axios from "axios";
import { products as mockProducts } from "@/data/products";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL || "",
  headers: { "Content-Type": "application/json" },
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
  const product = mockProducts.find((p) => p.id === id);
  if (!product) throw new Error(`Product ${id} not found`);
  return product;
};

const productService = { getProducts, getProductById };
export default productService;
