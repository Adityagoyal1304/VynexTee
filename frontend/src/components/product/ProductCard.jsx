// src/components/product/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import Badge from "@/components/ui/Badge";

// Product color swatch placeholder when no real image is available
const ProductImagePlaceholder = ({ color, name }) => (
  <div
    className="absolute inset-0 flex items-center justify-center"
    style={{ backgroundColor: color || "#1e293b" }}
  >
    <div className="text-center px-4">
      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 flex items-center justify-center">
        <ShoppingBag size={28} className="text-white/40" />
      </div>
      <p className="text-white/30 text-xs font-medium line-clamp-2">{name}</p>
    </div>
  </div>
);

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { id, name, price, category, badge, images, color } = product;

  const hasRealImage =
    images?.[0] && !images[0].includes("placeholder") && images[0].startsWith("/");

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${name} added to cart!`, {
      style: {
        background: "#111827",
        color: "#f8f8f8",
        border: "1px solid #1e293b",
      },
      iconTheme: { primary: "#60a5fa", secondary: "#0a0a16" },
    });
  };

  return (
    <article className="group product-card rounded-2xl overflow-hidden bg-[#111827] border border-white/5 hover:border-[#60a5fa]/20 transition-all duration-300">
      <Link to={`/product/${id}`} className="block" aria-label={`View ${name}`}>
        {/* Image Area */}
        <div className="relative aspect-square overflow-hidden bg-[#1a2332]">
          {hasRealImage ? (
            <img
              src={images[0]}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <ProductImagePlaceholder color={color} name={name} />
          )}

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3">
              <Badge label={badge} variant={badge} />
            </div>
          )}

          {/* Quick Add Button — appears on hover */}
          <div className="absolute bottom-3 left-3 right-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#3b82f6] text-white text-sm font-semibold hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-[#60a5fa] focus:ring-offset-2 focus:ring-offset-[#111827]"
              aria-label={`Add ${name} to cart`}
            >
              <ShoppingBag size={15} strokeWidth={2} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Category */}
          <div className="mb-2">
            <Badge
              label={category === "tshirt" ? "T-Shirt" : "Bag"}
              variant={category}
            />
          </div>

          {/* Name */}
          <h3 className="text-sm font-semibold text-white/90 leading-snug mb-2 line-clamp-2 group-hover:text-white transition-colors">
            {name}
          </h3>

          {/* Price Row */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-white">
              {formatPrice(price)}
            </span>
            <button
              onClick={handleAddToCart}
              className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#3b82f6]/20 text-[#60a5fa] text-xs font-semibold border border-[#3b82f6]/30 hover:bg-[#3b82f6] hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
              aria-label={`Add ${name} to cart`}
            >
              <ShoppingBag size={13} />
              Add
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
