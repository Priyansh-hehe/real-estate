/**
 * ==============================================================================
 * INDIAN CURRENCY FORMATTER (src/lib/format.ts)
 * ==============================================================================
 * Formats price according to the Indian Numbering System:
 * - Under 1 Lakh (< 1,00,000): Standard INR format with commas (e.g., ₹50,000)
 * - 1 Lakh to < 1 Crore: Formatted in Lakhs (e.g., ₹1 Lakh, ₹25 Lakhs, ₹45.5 Lakhs)
 * - 1 Crore and above: Formatted in Crores (e.g., ₹1 Crore, ₹1.25 Crores, ₹3.5 Crores)
 * ==============================================================================
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined || isNaN(price)) {
    return "₹0";
  }

  // Under 1 Lakh (< 1,00,000)
  if (price < 100000) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  }

  // 1 Crore and above (>= 1,00,00,000)
  if (price >= 10000000) {
    const crores = price / 10000000;
    // Keep up to 2 decimal places and trim trailing zeros
    const formatted = parseFloat(crores.toFixed(2));
    return `₹${formatted} ${formatted === 1 ? "Crore" : "Crores"}`;
  }

  // 1 Lakh to < 1 Crore (>= 1,00,000 and < 1,00,00,000)
  const lakhs = price / 100000;
  const formatted = parseFloat(lakhs.toFixed(2));
  return `₹${formatted} ${formatted === 1 ? "Lakh" : "Lakhs"}`;
}
