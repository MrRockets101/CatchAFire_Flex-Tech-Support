import { useState, useEffect } from "react";
import axios from "axios";
import {
  formatCurrency,
  convertCurrency,
  getSupportedCurrencies,
  isValidCurrency,
} from "../utils";

/**
 * Custom hook for currency management
 * @returns {object} Currency hook state and functions
 */
export const useCurrencyManager = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("ZAR");
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch exchange rates from API
   * @param {string} baseCurrency - Base currency for rates (default: 'ZAR')
   */
  const fetchExchangeRates = async (baseCurrency = "ZAR") => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
      );

      setExchangeRates(response.data.rates);
    } catch (err) {
      setError("Failed to fetch exchange rates");
      console.error("Exchange rate fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format amount with selected currency
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code (optional, uses selected currency)
   * @returns {string} Formatted currency string
   */
  const formatAmount = (amount, currency = selectedCurrency) => {
    return formatCurrency(amount, currency, exchangeRates);
  };

  /**
   * Convert amount between currencies
   * @param {number} amount - Amount to convert
   * @param {string} fromCurrency - Source currency
   * @param {string} toCurrency - Target currency
   * @returns {number} Converted amount
   */
  const convertAmount = (amount, fromCurrency, toCurrency) => {
    return convertCurrency(amount, fromCurrency, toCurrency, exchangeRates);
  };

  /**
   * Change selected currency
   * @param {string} currency - New currency code
   */
  const changeCurrency = (currency) => {
    if (isValidCurrency(currency)) {
      setSelectedCurrency(currency);
    } else {
      console.warn(`Invalid currency: ${currency}`);
    }
  };

  /**
   * Get available currencies
   * @returns {Array<string>} Supported currency codes
   */
  const getAvailableCurrencies = () => {
    return getSupportedCurrencies();
  };

  // Fetch rates on mount
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  return {
    selectedCurrency,
    exchangeRates,
    loading,
    error,
    formatAmount,
    convertAmount,
    changeCurrency,
    getAvailableCurrencies,
    refreshRates: fetchExchangeRates,
  };
};
