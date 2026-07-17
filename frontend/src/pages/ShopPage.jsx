import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, Shirt, ShoppingBag, ArrowRight } from "lucide-react";
import { getProducts } from "@/services/productService";

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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProds = async () => {
      setLoading(true);
      try {
        const data = await getProducts(activeCategory);
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProds();
  }, [activeCategory]);

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

        {/* Products Grid or Empty State */}
        {loading ? (
          <div className="py-32 text-center" style={{ color: "var(--text-muted)" }}>
            Loading amazing products...
          </div>
        ) : products.length === 0 ? (
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
              Check back soon for new drops.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-300"
                style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-light)" }}
              >
                {/* Image */}
                <div className="aspect-[4/5] relative overflow-hidden bg-black/20">
                  <img
                    src={product.images?.[0] || "https://via.placeholder.com/400x500?text=No+Image"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-black">
                      {product.badge}
                    </div>
                  )}
                  {/* Hover overlay button */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-full py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold flex items-center justify-center gap-2">
                      View Product <ArrowRight size={16} />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col grow">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-bold text-lg leading-tight" style={{ color: "var(--text-primary)" }}>
                      {product.name}
                    </h3>
                    <p className="font-semibold text-lg shrink-0" style={{ color: "var(--text-secondary)" }}>
                      ${product.price}
                    </p>
                  </div>
                  <p className="text-sm capitalize mt-auto" style={{ color: "var(--text-muted)" }}>
                    {product.category}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ShopPage;
