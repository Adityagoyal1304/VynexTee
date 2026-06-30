// src/components/ui/Button.jsx
import React from "react";

const variants = {
  primary:
    "bg-brand-blue text-white hover:bg-blue-500 focus:ring-brand-blue shadow-lg shadow-blue-500/20",
  secondary:
    "bg-transparent border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white focus:ring-brand-blue",
  ghost:
    "bg-transparent text-brand-cream hover:bg-white/10 focus:ring-white",
  danger:
    "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  dark:
    "bg-brand-navy text-white border border-white/10 hover:border-brand-blue/50 focus:ring-brand-blue",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

/**
 * Base button component.
 * @param {Object} props
 * @param {"primary"|"secondary"|"ghost"|"danger"|"dark"} props.variant
 * @param {"sm"|"md"|"lg"} props.size
 * @param {boolean} props.fullWidth
 * @param {boolean} props.isLoading
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  disabled,
  ...rest
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-wide",
        "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        fullWidth ? "w-full" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {isLoading ? (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
