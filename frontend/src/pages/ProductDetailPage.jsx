// src/pages/ProductDetailPage.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Minus, Plus, ArrowLeft, Package, RefreshCw, Truck, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import ProductCard from "@/components/product/ProductCard";
import Spinner from "@/components/ui/Spinner";

// Skeleton for loading state
const DetailSkeleton = () => (
  <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 animate-pulse">
    <div className="aspect-square skeleton rounded-3xl" />
    <div className="space-y-4 py-4">
      <div className="h-3 w-24 skeleton rounded-full" />
      <div className="h-8 w-4/5 skeleton rounded-xl" />
      <div className="h-8 w-3/5 skeleton rounded-xl" />
      <div className="h-6 w-28 skeleton rounded-xl" />
      <div className="h-px bg-white/5 my-4" />
      <div className="space-y-2">
        <div className="h-4 skeleton rounded-md" />
        <div className="h-4 w-4/5 skeleton rounded-md" />
        <div className="h-4 w-3/5 skeleton rounded-md" />
      </div>
      <div className="h-12 skeleton rounded-xl mt-6" />
    </div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { data: product, isLoading, isError } = useProduct(id);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);

  // Fetch related products (same category)
  const { data: allProducts = [] } = useProducts(product?.category);
  const otherProducts = allProducts
    .filter((p) => p._id !== id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart({ ...product, qty: 1 });
    // Add qty times if more than 1
    for (let i = 1; i < qty; i++) {
      addToCart(product);
    }
    toast.success(`${product.name} added to cart!`, {
      style: { background: "#111827", color: "#f8f8f8", border: "1px solid #1e293b" },
      iconTheme: { primary: "#60a5fa", secondary: "#0a0a16" },
    });
  };

  const hasRealImage =
    product?.images?.[0] &&
    !product.images[0].includes("placeholder") &&
    product.images[0].startsWith("/");

  return (
    <div className="min-h-screen bg-[#0a0a16] pt-24 pb-20 animate-fadeIn">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8 group"
          aria-label="Go back to previous page"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back
        </button>

        {isLoading && <DetailSkeleton />}

        {isError && (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <Package size={48} className="text-white/20" />
            <h2 className="text-xl font-bold text-white">Product not found</h2>
            <p className="text-white/40 text-sm">The product you're looking for doesn't exist or was removed.</p>
            <Link
              to="/shop"
              className="mt-2 px-6 py-3 rounded-xl bg-[#3b82f6] text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {product && (
          <>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-white/30 mb-8 uppercase tracking-widest" aria-label="Breadcrumb">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
              <ChevronRight size={12} />
              <Link
                to={`/shop?category=${product.category}`}
                className="hover:text-white transition-colors"
              >
                {product.category === "tshirt" ? "T-Shirts" : "Bags"}
              </Link>
              <ChevronRight size={12} />
              <span className="text-white/60 normal-case">{product.name}</span>
            </nav>

            {/* Main Detail Grid */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
              {/* Image */}
              <div className="group">
                <div
                  className="aspect-square rounded-3xl overflow-hidden border border-white/5 shadow-2xl shadow-black/50 relative"
                  style={{ backgroundColor: hasRealImage ? undefined : product.color || "#1e293b" }}
                >
                  {hasRealImage ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center gap-4">
                      {product.category === "tshirt" ? (
                        <ShoppingBag size={80} className="text-white/20" />
                      ) : (
                        <ShoppingBag size={80} className="text-white/20" />
                      )}
                      <p className="text-white/20 text-sm">Image coming soon</p>
                    </div>
                  )}

                  {product.badge && (
                    <div className="absolute top-4 left-4">
                      <Badge label={product.badge} variant={product.badge} />
                    </div>
                  )}
                </div>
              </div>

              {/* Details Panel */}
              <div className="flex flex-col">
                {/* Category & Badge */}
                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    label={product.category === "tshirt" ? "T-Shirt" : "Bag"}
                    variant={product.category}
                  />
                  {product.badge && (
                    <Badge label={product.badge} variant={product.badge} />
                  )}
                </div>

                {/* Name */}
                <h1
                  className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {product.name}
                </h1>

                {/* Price */}
                <p className="text-3xl font-bold text-[#60a5fa] mb-6">
                  {formatPrice(product.price)}
                </p>

                <div className="h-px bg-white/5 mb-6" />

                {/* Description */}
                <p className="text-white/60 leading-relaxed text-sm mb-6">
                  {product.description}
                </p>

                {/* Size Selector */}
                {product.sizes && product.sizes.length > 1 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-white/70 mb-3 tracking-wide">
                      Size: <span className="text-white">{selectedSize || "Select"}</span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          aria-label={`Select size ${size}`}
                          aria-pressed={selectedSize === size}
                          className={`h-10 min-w-[2.5rem] px-3 rounded-xl text-sm font-semibold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] ${
                            selectedSize === size
                              ? "bg-[#3b82f6] border-[#3b82f6] text-white shadow-lg shadow-blue-500/20"
                              : "bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-8">
                  <p className="text-sm font-semibold text-white/70 mb-3 tracking-wide">Quantity</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        aria-label="Decrease quantity"
                        className="h-9 w-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                      >
                        <Minus size={15} strokeWidth={2.5} />
                      </button>
                      <span
                        className="w-10 text-center font-bold text-white text-base"
                        aria-live="polite"
                        aria-label={`Quantity: ${qty}`}
                      >
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(qty + 1)}
                        aria-label="Increase quantity"
                        className="h-9 w-9 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
                      >
                        <Plus size={15} strokeWidth={2.5} />
                      </button>
                    </div>
                    <span className="text-sm text-white/30">In stock</span>
                  </div>
                </div>

                {/* Add to Cart */}
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  className="text-base mb-4"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag size={18} />
                  Add to Cart — {formatPrice(product.price * qty)}
                </Button>

                {/* Shipping Info */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { Icon: Truck, text: "Free over ₹999" },
                    { Icon: RefreshCw, text: "15-day returns" },
                    { Icon: Package, text: "Secure packaging" },
                  ].map(({ Icon, text }) => (
                    <div
                      key={text}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5 text-center"
                    >
                      <Icon size={16} className="text-[#60a5fa]" />
                      <span className="text-xs text-white/40">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Products */}
            {otherProducts.length > 0 && (
              <section className="mt-24" aria-label="Related products">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <p className="text-xs text-[#60a5fa] font-semibold tracking-widest uppercase mb-1">
                      You might also like
                    </p>
                    <h2
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: "Syne, sans-serif" }}
                    >
                      Related Products
                    </h2>
                  </div>
                  <Link
                    to={`/shop?category=${product.category}`}
                    className="text-sm text-white/40 hover:text-white transition-colors hidden sm:block"
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {otherProducts.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
