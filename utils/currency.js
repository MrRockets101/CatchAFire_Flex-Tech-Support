/**
 * Currency formatting and conversion utilities
 */

/**
 * Format a currency amount with proper localization
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'ZAR')
 * @param {object} rates - Exchange rates object
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = "ZAR", rates = {}) => {
  const convertedAmount =
    currency === "ZAR" ? amount : amount * (rates[currency] || 1);
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency }).format(
    convertedAmount
  );
};

/**
 * Convert amount between currencies
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency code
 * @param {string} toCurrency - Target currency code
 * @param {object} rates - Exchange rates object
 * @returns {number} Converted amount
 */
export const convertCurrency = (
  amount,
  fromCurrency,
  toCurrency,
  rates = {}
) => {
  if (fromCurrency === toCurrency) return amount;

  // Convert to ZAR first (base currency)
  const amountInZAR =
    fromCurrency === "ZAR" ? amount : amount / (rates[fromCurrency] || 1);

  // Convert from ZAR to target currency
  return toCurrency === "ZAR"
    ? amountInZAR
    : amountInZAR * (rates[toCurrency] || 1);
};

/**
 * Get supported currencies
 * @returns {Array<string>} Array of supported currency codes
 */
export const getSupportedCurrencies = () => {
  return ["ZAR", "USD", "EUR"];
};

/**
 * Validate currency code
 * @param {string} currency - Currency code to validate
 * @returns {boolean} True if currency is supported
 */
export const isValidCurrency = (currency) => {
  return getSupportedCurrencies().includes(currency);
};
