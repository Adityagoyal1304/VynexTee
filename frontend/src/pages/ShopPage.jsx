// src/pages/ShopPage.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import ProductGrid from "@/components/product/ProductGrid";
import CategoryFilter from "@/components/product/CategoryFilter";

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  const { data: products = [], isLoading, isError, refetch } = useProducts(activeCategory);

  const pageTitle =
    activeCategory === "tshirt" ? "T-Shirts" :
    activeCategory === "bag"    ? "Bags"      :
    "All Products";

  return (
    <div className="min-h-screen pt-24 pb-20 animate-fadeIn" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span style={{ color: "var(--accent)" }}>Shop</span>
          {activeCategory && (
            <>
              <span>/</span>
              <span style={{ color: "var(--accent)" }}>{pageTitle}</span>
            </>
          )}
        </div>

        {/* Page Header */}
        <div className="mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
          >
            {pageTitle}
          </h1>
          {!isLoading && (
            <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
              {products.length} product{products.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-8">
          <CategoryFilter productCount={products.length} />
        </div>

        <div className="h-px mb-8" style={{ backgroundColor: "var(--border-light)" }} />

        {/* Grid */}
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
