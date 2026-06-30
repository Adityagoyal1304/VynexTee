// src/components/ui/Spinner.jsx
import React from "react";

/**
 * Accessible loading spinner.
 * @param {"sm"|"md"|"lg"} props.size
 * @param {string} props.className
 */
const Spinner = ({ size = "md", className = "" }) => {
  const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`flex items-center justify-center ${className}`}
    >
      <svg
        className={`${sizeMap[size]} animate-spin text-brand-blue`}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export default Spinner;
