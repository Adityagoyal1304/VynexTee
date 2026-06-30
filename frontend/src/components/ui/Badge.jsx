// src/components/ui/Badge.jsx
import React from "react";

const variantMap = {
  Bestseller: "bg-amber-400/20 text-amber-300 border border-amber-400/30",
  New: "bg-brand-blue/20 text-blue-300 border border-brand-blue/30",
  tshirt: "bg-purple-500/20 text-purple-300 border border-purple-500/30",
  bag: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
  default: "bg-white/10 text-white/70 border border-white/20",
};

/**
 * Small pill badge.
 * @param {string} props.label - Text content
 * @param {"Bestseller"|"New"|"tshirt"|"bag"|"default"} props.variant
 */
const Badge = ({ label, variant = "default", className = "" }) => {
  const style = variantMap[variant] || variantMap.default;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ${style} ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;
