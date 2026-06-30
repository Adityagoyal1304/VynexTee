// src/components/product/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";
import Badge from "@/components/ui/Badge";

const ProductImagePlaceholder = ({ color, name }) => (
  <div
    className="absolute inset-0 flex items-center justify-center"
    style={{ backgroundColor: color || "#1e293b" }}
  >
    {/* Mini diamond in placeholder */}
    <div
      className="absolute top-3 right-3 h-8 w-8 opacity-20"
      style={{ background: "rgba(0,0,0,0.3)", transform: "rotate(45deg)" }}
    />
    <div className="text-center px-4">
      <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-black/10 flex items-center justify-center">
        <ShoppingBag size={26} className="text-white/40" />
      </div>
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
      style: { background: "#111827", color: "#f8f8f8", border: "1px solid #1e293b" },
      iconTheme: { primary: "#60a5fa", secondary: "#0a0a16" },
    });
  };

  return (
    <article
      className="group product-card rounded-2xl overflow-hidden"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      <Link to={`/product/${id}`} className="block" aria-label={`View ${name}`}>
        {/* Image Area */}
        <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: "var(--bg-section-alt)" }}>
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

          {/* Dark overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

          {badge && (
            <div className="absolute top-3 left-3">
              <Badge label={badge} variant={badge} />
            </div>
          )}

          {/* Quick add — slides up on hover */}
          <div className="absolute bottom-3 left-3 right-3 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors focus:outline-none focus:ring-2"
              style={{ backgroundColor: "var(--accent-deep)" }}
              aria-label={`Add ${name} to cart`}
            >
              <ShoppingBag size={15} strokeWidth={2} />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="mb-2">
            <Badge
              label={category === "tshirt" ? "T-Shirt" : "Bag"}
              variant={category}
            />
          </div>
          <h3
            className="text-sm font-semibold leading-snug mb-2 line-clamp-2 transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            {name}
          </h3>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              {formatPrice(price)}
            </span>
            <button
              onClick={handleAddToCart}
              className="md:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 focus:outline-none"
              style={{
                background: "var(--accent-glow)",
                color: "var(--accent)",
                border: "1px solid var(--accent)",
                borderOpacity: 0.3,
              }}
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
