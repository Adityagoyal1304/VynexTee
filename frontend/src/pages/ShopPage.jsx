import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, Shirt, ShoppingBag } from "lucide-react";

const CATEGORIES = [
  { key: null,      label: "All"      },
  { key: "tshirt",  label: "T-Shirts" },
  { key: "bag",     label: "Bags"     },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  const pageTitle =
    activeCategory === "tshirt" ? "T-Shirts" :
    activeCategory === "bag"    ? "Bags"      :
    "All Products";

  const setCategory = (key) => {
    if (key) setSearchParams({ category: key });
    else setSearchParams({});
  };

  return (
    <div
      className="min-h-screen pt-24 pb-20 animate-fadeIn"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <div
          className="flex items-center gap-2 text-xs uppercase tracking-widest mb-6"
          style={{ color: "var(--text-muted)" }}
        >
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

        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl sm:text-5xl font-bold"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
          >
            {pageTitle}
          </h1>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {CATEGORIES.map(({ key, label }) => {
            const active = activeCategory === key;
            return (
              <button
                key={label}
                onClick={() => setCategory(key)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={
                  active
                    ? { backgroundColor: "var(--accent-deep)", color: "#fff" }
                    : {
                        backgroundColor: "var(--bg-card)",
                        border: "1px solid var(--border-light)",
                        color: "var(--text-secondary)",
                      }
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Empty state */}
        <div
          className="flex flex-col items-center justify-center py-32 rounded-2xl"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-light)",
          }}
        >
          <div
            className="h-16 w-16 rounded-2xl flex items-center justify-center mb-5"
            style={{ backgroundColor: "var(--accent-glow)" }}
          >
            {activeCategory === "tshirt" ? (
              <Shirt size={28} style={{ color: "var(--accent)" }} />
            ) : activeCategory === "bag" ? (
              <ShoppingBag size={28} style={{ color: "var(--accent)" }} />
            ) : (
              <Package size={28} style={{ color: "var(--accent)" }} />
            )}
          </div>
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "Syne, sans-serif", color: "var(--text-primary)" }}
          >
            No products yet
          </h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Products will appear here once they're added.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ShopPage;
