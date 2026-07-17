import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "@/context/ThemeContext";
import PageWrapper from "@/components/layout/PageWrapper";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import NotFoundPage from "@/pages/NotFoundPage";
import LoginPage    from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage  from "@/pages/ProfilePage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
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
            <Route element={<PageWrapper />}>
              <Route path="/"             element={<HomePage />} />
              <Route path="/shop"         element={<ShopPage />} />
              <Route path="/product/:id"  element={<ProductDetailPage />} />
              <Route path="/cart"         element={<CartPage />} />
              <Route path="/login"        element={<LoginPage />} />
              <Route path="/register"     element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboardPage />
                  </ProtectedRoute>
                } 
              />

              <Route path="*"             element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
