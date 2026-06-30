// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import PageWrapper from "@/components/layout/PageWrapper";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Configure TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 min
      gcTime: 10 * 60 * 1000,      // 10 min (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        {/* Global toast notifications */}
        <Toaster
          position="bottom-right"
          gutter={12}
          containerStyle={{ bottom: 24, right: 24 }}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#111827",
              color: "#f8f8f8",
              border: "1px solid #1e293b",
              borderRadius: "12px",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            },
          }}
        />

        <Routes>
          {/* All routes share Navbar + Footer via PageWrapper */}
          <Route element={<PageWrapper />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
