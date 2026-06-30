// src/components/product/CategoryFilter.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import { Shirt, ShoppingBag as BagIcon, LayoutGrid } from "lucide-react";

const categories = [
  { value: null, label: "All", Icon: LayoutGrid },
  { value: "tshirt", label: "T-Shirts", Icon: Shirt },
  { value: "bag", label: "Bags", Icon: BagIcon },
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

const CategoryFilter = ({ productCount = 0 }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");
  const activeSort = searchParams.get("sort") || "newest";

  const setCategory = (val) => {
    const next = new URLSearchParams(searchParams);
    if (val) {
      next.set("category", val);
    } else {
      next.delete("category");
    }
    setSearchParams(next);
  };

  const setSort = (val) => {
    const next = new URLSearchParams(searchParams);
    next.set("sort", val);
    setSearchParams(next);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Category Tabs */}
      <div
        className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/5 w-fit"
        role="tablist"
        aria-label="Product category filter"
      >
        {categories.map(({ value, label, Icon }) => {
          const isActive = activeCategory === value;
          return (
            <button
              key={label}
              role="tab"
              aria-selected={isActive}
              onClick={() => setCategory(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] ${
                isActive
                  ? "bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={15} strokeWidth={1.8} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Right: Count + Sort */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-white/40 hidden sm:block">
          {productCount} product{productCount !== 1 ? "s" : ""}
        </span>
        <select
          value={activeSort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort products"
          className="px-4 py-2 rounded-xl text-sm text-white/80 bg-white/5 border border-white/10 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:border-[#60a5fa]"
        >
          {sortOptions.map(({ value, label }) => (
            <option key={value} value={value} className="bg-[#111827] text-white">
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default CategoryFilter;
