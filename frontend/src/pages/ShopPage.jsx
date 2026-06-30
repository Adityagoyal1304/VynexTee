// src/pages/ShopPage.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/product/ProductGrid";
import CategoryFilter from "@/components/product/CategoryFilter";

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  const { data: products = [], isLoading, isError, refetch } = useProducts(activeCategory);

  const pageTitle =
    activeCategory === "tshirt"
      ? "T-Shirts"
      : activeCategory === "bag"
      ? "Bags"
      : "All Products";

  return (
    <div className="min-h-screen bg-[#0a0a16] pt-24 pb-20 animate-fadeIn">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-white/40 mb-3 uppercase tracking-widest">
            <span>Home</span>
            <span>/</span>
            <span className="text-[#60a5fa]">Shop</span>
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-[#60a5fa]">{pageTitle}</span>
              </>
            )}
          </div>
          <h1
            className="text-4xl sm:text-5xl font-bold text-white"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {pageTitle}
          </h1>
          {!isLoading && (
            <p className="text-white/40 mt-2 text-sm">
              {products.length} product{products.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <CategoryFilter productCount={products.length} />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-8" />

        {/* Product Grid */}
        <ProductGrid
          products={products}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />
      </div>
    </div>
  );
};

export default ShopPage;
