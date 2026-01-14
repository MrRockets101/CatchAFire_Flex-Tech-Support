import React, { createContext, useContext } from "react";
import { Alert } from "react-native";
import { useCurrency } from "./CurrencyContext";
import { useApi } from "../hooks";

// Order Context
const OrderContext = createContext();

// Order Provider Component
export const OrderProvider = ({ children }) => {
  const { selectedCurrency, rates, formatCurrency } = useCurrency();
  const { post, loading, error } = useApi();

  // Create order function
  const createOrder = async (orderData = null) => {
    // Default order data if none provided
    const defaultOrderData = orderData || {
      customer_id: 123,
      product_name: "Sample Product",
      quantity: 2,
      weight: null,
      total_price: 20.0,
      order_time: new Date().toISOString(),
      status: "pending",
      currency: selectedCurrency,
      delivery_address: "123 Main Street, Johannesburg, South Africa",
      customer_phone: "+27-11-123-4567",
      customer_name: "John Doe",
      delivery_instructions: "Please deliver to the front door",
    };

    try {
      const response = await post("orders/", defaultOrderData);

      // Check for large response warning
      const contentLength = response.headers["content-length"];
      if (contentLength && parseInt(contentLength) >= 30 * 1024 * 1024) {
        Alert.alert("Caution", "Response packet size is 30 MB or more.");
      }

      // Build success message
      let successMessage = `${
        response.data.message
      } Order ID: ${response.data.order_id
        .toString()
        .padStart(5, "0")} - Total: ${formatCurrency(
        20.0,
        selectedCurrency,
        rates
      )}`;

      if (response.data.delivery_info) {
        successMessage += `\n\nOrder added to DoorDash bulk CSV\nStatus: ${response.data.delivery_info.status}`;
        if (response.data.delivery_info.note) {
          successMessage += `\n${response.data.delivery_info.note}`;
        }
      }

      Alert.alert("Success", successMessage);
      return response.data;
    } catch (error) {
      if (error.response) {
        // Server responded with error status
        Alert.alert(
          "Error",
          `Server error: ${error.response.status} - ${
            error.response.data.detail || error.response.data
          }`
        );
      } else if (error.request) {
        // Request made but no response
        Alert.alert("Error", "Network error: No response from server.");
      } else {
        // Something else
        Alert.alert("Error", `Request error: ${error.message}`);
      }
      throw error;
    }
  };

  const value = {
    createOrder,
    selectedCurrency,
    loading,
    error,
  };

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

// Custom hook to use order context
export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
