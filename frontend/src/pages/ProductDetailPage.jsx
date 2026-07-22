// src/pages/ProductDetailPage.jsx
import React, { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Minus, Plus, ArrowLeft, Package, RefreshCw, Truck, ChevronRight, ChevronLeft } from "lucide-react";
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
  const [selectedImg, setSelectedImg] = useState(0);

  // Touch swipe tracking
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const images = product?.images?.length ? product.images : [];
  const totalImgs = images.length;

  const prevImg = () => setSelectedImg((i) => (i - 1 + totalImgs) % totalImgs);
  const nextImg = () => setSelectedImg((i) => (i + 1) % totalImgs);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    // Only treat as horizontal swipe if dx is dominant
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
      dx < 0 ? nextImg() : prevImg();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Fetch ALL products (no category filter) for "You might also like".
  // Only enable once the current product has loaded to avoid a race condition.
  const { data: allProducts = [] } = useProducts(null);

  // Shuffle all products, exclude the current one, pick 4 random ones.
  const otherProducts = React.useMemo(() => {
    if (!allProducts.length) return [];
    const pool = allProducts.filter((p) => (p._id || p.id) !== id);
    // Fisher-Yates shuffle
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, 4);
  }, [allProducts, id]);

  const handleAddToCart = () => {
    const stock = product.stock ?? Infinity;
    const totalRequested = qty;

    if (totalRequested > stock) {
      toast.error("Out of stock!", {
        style: { background: "#111827", color: "#f8f8f8", border: "1px solid #1e293b" },
      });
      return;
    }

    // Add qty times (store increments by 1 each call)
    let failed = false;
    for (let i = 0; i < totalRequested; i++) {
      const result = addToCart(product);
      if (result?.success === false) {
        toast.error(result.message, {
          style: { background: "#111827", color: "#f8f8f8", border: "1px solid #1e293b" },
        });
        failed = true;
        break;
      }
    }

    if (!failed) {
      toast.success(`${product.name} added to cart!`, {
        style: { background: "#111827", color: "#f8f8f8", border: "1px solid #1e293b" },
        iconTheme: { primary: "#60a5fa", secondary: "#0a0a16" },
      });
    }
  };

  const hasRealImage =
    product?.images?.[0] &&
    !product.images[0].includes("placeholder");

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

              {/* ── Swipe Carousel ── */}
              <div className="relative group/carousel select-none">

                {/* Slides wrapper */}
                <div
                  className="relative aspect-square rounded-3xl overflow-hidden border border-white/5 shadow-2xl shadow-black/50"
                  style={{ backgroundColor: hasRealImage ? undefined : product.color || "#1e293b" }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Slide track */}
                  <div
                    className="flex h-full"
                    style={{
                      width: `${totalImgs * 100}%`,
                      transform: `translateX(-${(selectedImg * 100) / totalImgs}%)`,
                      transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {hasRealImage ? (
                      images.map((url, idx) => (
                        <div
                          key={idx}
                          className="h-full shrink-0"
                          style={{ width: `${100 / totalImgs}%` }}
                        >
                          <img
                            src={url}
                            alt={`${product.name} — view ${idx + 1}`}
                            className="h-full w-full object-cover"
                            draggable={false}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="h-full w-full flex flex-col items-center justify-center gap-4">
                        <ShoppingBag size={80} className="text-white/20" />
                        <p className="text-white/20 text-sm">Image coming soon</p>
                      </div>
                    )}
                  </div>

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge label={product.badge} variant={product.badge} />
                    </div>
                  )}

                  {/* Prev / Next arrows — desktop only, appear on hover */}
                  {totalImgs > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={prevImg}
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 focus:outline-none hidden sm:flex items-center justify-center"
                        style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(4px)" }}
                      >
                        <ChevronLeft size={20} strokeWidth={2.5} />
                      </button>
                      <button
                        type="button"
                        onClick={nextImg}
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full opacity-0 group-hover/carousel:opacity-100 transition-all duration-200 focus:outline-none hidden sm:flex items-center justify-center"
                        style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(4px)" }}
                      >
                        <ChevronRight size={20} strokeWidth={2.5} />
                      </button>
                    </>
                  )}

                  {/* Dot indicators */}
                  {totalImgs > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImg(idx)}
                          aria-label={`Go to image ${idx + 1}`}
                          className="rounded-full transition-all duration-300 focus:outline-none"
                          style={{
                            width: selectedImg === idx ? "20px" : "8px",
                            height: "8px",
                            backgroundColor: selectedImg === idx
                              ? "#fff"
                              : "rgba(255,255,255,0.4)",
                          }}
                        />
                      ))}
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
                        onClick={() => {
                          const maxQty = product.stock ?? Infinity;
                          setQty((prev) => Math.min(prev + 1, maxQty));
                        }}
                        disabled={product.stock != null && qty >= product.stock}
                        aria-label="Increase quantity"
                        className="h-9 w-9 flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          color: (product.stock != null && qty >= product.stock) ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
                        }}
                        onMouseEnter={(e) => { if (!(product.stock != null && qty >= product.stock)) e.currentTarget.style.color = "#fff"; }}
                        onMouseLeave={(e) => { if (!(product.stock != null && qty >= product.stock)) e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
                      >
                        <Plus size={15} strokeWidth={2.5} />
                      </button>
                    </div>
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
                    to="/shop"
                    className="text-sm text-white/40 hover:text-white transition-colors hidden sm:block"
                  >
                    View all →
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {otherProducts.map((p) => (
                    <ProductCard key={p._id || p.id} product={p} />
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
