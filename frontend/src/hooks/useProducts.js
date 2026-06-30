// src/hooks/useProducts.js
// TanStack Query wrappers around productService — components never call service directly

import { useQuery } from "@tanstack/react-query";
import { getProducts, getProductById } from "@/services/productService";

/**
 * Fetch all products with optional category filter.
 * @param {string|null} category
 */
export const useProducts = (category = null) => {
  return useQuery({
    queryKey: ["products", category],
    queryFn: () => getProducts(category),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Fetch a single product by ID.
 * @param {string} id
 */
export const useProduct = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(id),
    retry: 2,
  });
};
