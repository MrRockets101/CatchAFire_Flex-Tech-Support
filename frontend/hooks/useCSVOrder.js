import { useState, useCallback } from "react";
import { useApi } from "./useApi";

/**
 * Custom hook for CSV order operations (Task 1)
 * Handles creating orders and updating the CSV file in real-time
 */
export const useCSVOrder = () => {
  const { post, get, loading, error, clearError } = useApi();
  const [orders, setOrders] = useState([]);

  /**
   * Create a new CSV order
   * @param {Object} orderData - Order data
   * @param {number} orderData.customer_id - Customer ID
   * @param {string} orderData.product_name - Product name
   * @param {number} orderData.quantity - Quantity ordered
   * @param {number} orderData.total_price - Total price
   * @param {string|Date} orderData.order_time - Order timestamp
   * @returns {Promise<Object>} Order creation response
   */
  const createCSVOrder = useCallback(
    async (orderData) => {
      try {
        // Ensure order_time is in ISO format
        const orderPayload = {
          ...orderData,
          order_time:
            orderData.order_time instanceof Date
              ? orderData.order_time.toISOString()
              : new Date(orderData.order_time).toISOString(),
        };

        const response = await post("/orders/", orderPayload);

        // Refresh orders list after successful creation
        await fetchCSVOrders();

        return response;
      } catch (err) {
        console.error("Error creating CSV order:", err);
        throw err;
      }
    },
    [post]
  );

  /**
   * Fetch all CSV orders from the database
   * @returns {Promise<Array>} List of orders
   */
  const fetchCSVOrders = useCallback(async () => {
    try {
      const response = await get("/orders/");
      setOrders(response);
      return response;
    } catch (err) {
      console.error("Error fetching CSV orders:", err);
      throw err;
    }
  }, [get]);

  /**
   * Create a sample order for testing
   * @returns {Promise<Object>} Sample order creation response
   */
  const createSampleOrder = useCallback(async () => {
    const sampleOrder = {
      customer_id: Math.floor(Math.random() * 1000) + 1,
      product_name: `Sample Product ${Math.floor(Math.random() * 10) + 1}`,
      quantity: Math.floor(Math.random() * 5) + 1,
      total_price: Math.floor(Math.random() * 100) + 10,
      order_time: new Date().toISOString(),
    };

    return await createCSVOrder(sampleOrder);
  }, [createCSVOrder]);

  return {
    // State
    orders,
    loading,
    error,

    // Actions
    createCSVOrder,
    fetchCSVOrders,
    createSampleOrder,
    clearError,

    // Utilities
    setOrders,
  };
};
