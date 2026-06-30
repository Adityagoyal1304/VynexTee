// src/utils/formatPrice.js
/**
 * Formats a numeric price into Indian Rupee display string.
 * @param {number} amount - Price in INR
 * @returns {string} e.g. "₹1,499"
 */
export const formatPrice = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default formatPrice;
