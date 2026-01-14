import { useState, useCallback } from "react";
import axios from "axios";
import axiosRetry from "axios-retry";

/**
 * Custom hook for API operations with retry logic and error handling
 * @param {object} config - Configuration object
 * @param {string} config.baseURL - Base URL for API calls
 * @param {number} config.timeout - Request timeout in ms
 * @param {number} config.retries - Number of retries on failure
 * @returns {object} API hook state and functions
 */
export const useApi = (config = {}) => {
  const {
    baseURL = "http://localhost:8000",
    timeout = 10000,
    retries = 3,
  } = config;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configure axios instance with retry logic
  const api = axios.create({
    baseURL,
    timeout,
  });

  axiosRetry(api, {
    retries,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
      return (
        axiosRetry.isNetworkOrIdempotentRequestError(error) ||
        error.code === "ECONNABORTED"
      );
    },
  });

  /**
   * Make a GET request
   * @param {string} url - Request URL
   * @param {object} config - Axios config
   * @returns {Promise<any>} Response data
   */
  const get = useCallback(
    async (url, config = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(url, config);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Request failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  /**
   * Make a POST request
   * @param {string} url - Request URL
   * @param {any} data - Request data
   * @param {object} config - Axios config
   * @returns {Promise<any>} Response data
   */
  const post = useCallback(
    async (url, data = {}, config = {}) => {
      // Check payload size
      const dataSize = JSON.stringify(data).length;
      const maxSize = 30 * 1024 * 1024; // 30MB
      if (dataSize >= maxSize) {
        console.log(
          `Package size notification: Payload size ${dataSize} bytes is 30MB or larger.`
        );
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.post(url, data, config);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Request failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  /**
   * Make a PUT request
   * @param {string} url - Request URL
   * @param {any} data - Request data
   * @param {object} config - Axios config
   * @returns {Promise<any>} Response data
   */
  const put = useCallback(
    async (url, data = {}, config = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.put(url, data, config);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Request failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  /**
   * Make a DELETE request
   * @param {string} url - Request URL
   * @param {object} config - Axios config
   * @returns {Promise<any>} Response data
   */
  const deleteRequest = useCallback(
    async (url, config = {}) => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.delete(url, config);
        return response.data;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Request failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  /**
   * Clear current error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    get,
    post,
    put,
    delete: deleteRequest,
    api, // Direct access to axios instance if needed
  };
};
