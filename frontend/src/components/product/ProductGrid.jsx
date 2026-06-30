// src/components/product/ProductGrid.jsx
import React, { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import Spinner from "@/components/ui/Spinner";
import { RefreshCw, PackageSearch } from "lucide-react";

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-[#111827] border border-white/5 animate-pulse">
    <div className="aspect-square skeleton" />
    <div className="p-4 space-y-3">
      <div className="h-3 w-16 skeleton rounded-full" />
      <div className="h-4 w-4/5 skeleton rounded-md" />
      <div className="h-4 w-3/5 skeleton rounded-md" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-5 w-20 skeleton rounded-md" />
        <div className="h-8 w-16 skeleton rounded-lg" />
      </div>
    </div>
  </div>
);

const sortProducts = (products, sortKey) => {
  const sorted = [...products];
  if (sortKey === "price-asc") return sorted.sort((a, b) => a.price - b.price);
  if (sortKey === "price-desc") return sorted.sort((a, b) => b.price - a.price);
  // "newest" — keep original order (id ascending)
  return sorted;
};

const ProductGrid = ({ products = [], isLoading = false, isError = false, onRetry }) => {
  const [searchParams] = useSearchParams();
  const sortKey = searchParams.get("sort") || "newest";

  const sorted = useMemo(
    () => sortProducts(products, sortKey),
    [products, sortKey]
  );

  // Loading skeletons
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-live="polite" aria-busy="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <RefreshCw size={28} className="text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">Failed to load products</h3>
        <p className="text-sm text-white/40 max-w-xs">
          Something went wrong while fetching products. Please try again.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#3b82f6] text-white text-sm font-semibold hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
            aria-label="Retry loading products"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        )}
      </div>
    );
  }

  // Empty state
  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-[#1e293b] flex items-center justify-center">
          <PackageSearch size={28} className="text-white/30" />
        </div>
        <h3 className="text-lg font-semibold text-white">No products found</h3>
        <p className="text-sm text-white/40 max-w-xs">
          We couldn't find any products matching your filters. Try a different category.
        </p>
        <Link
          to="/shop"
          className="mt-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 text-sm font-medium hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
        >
          View All Products
        </Link>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      aria-live="polite"
    >
      {sorted.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
