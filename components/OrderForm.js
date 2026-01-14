import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  Alert,
  StyleSheet,
} from "react-native";

const OrderForm = ({
  productName,
  setProductName,
  quantity,
  setQuantity,
  totalPrice,
  setTotalPrice,
  selectedCurrency,
  getCurrencySymbol,
  selectCurrency,
  deliveryValidated,
  loading,
  handleCreateOrder,
  setDeliveryModalVisible,
  hasError,
  currentError,
  retryLastAction,
  clearError,
}) => {
  return (
    <>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Door Dash Bulk Order</Text>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          placeholderTextColor="#999"
          value={productName}
          onChangeText={setProductName}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          placeholderTextColor="#999"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
        <View style={styles.priceContainer}>
          <Text style={styles.currencySymbol}>
            {getCurrencySymbol(selectedCurrency || "ZAR")}
          </Text>
          <TextInput
            style={styles.priceInput}
            placeholder="Total Price"
            placeholderTextColor="#999"
            value={totalPrice}
            onChangeText={setTotalPrice}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.currencyButtonTouchable}
            onPress={selectCurrency}
          >
            <Text style={styles.currencyButtonText}>{selectedCurrency}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.checkLocationButton}
          onPress={() => {
            setDeliveryModalVisible(true);
          }}
        >
          <Text style={styles.checkLocationButtonText}>Delivery Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.createOrderButton,
            (loading || !deliveryValidated) && { opacity: 0.6 },
          ]}
          onPress={handleCreateOrder}
          disabled={loading || !deliveryValidated}
        >
          <Text style={styles.createOrderButtonText}>
            {loading
              ? "Placing..."
              : deliveryValidated
              ? "Place Order"
              : "Confirm Delivery Location First"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Error Display */}
      {hasError && currentError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>{currentError.icon}</Text>
          <Text style={styles.errorTitle}>{currentError.title}</Text>
          <Text style={styles.errorMessage}>{currentError.message}</Text>

          <View style={styles.errorActions}>
            {currentError.canRetry && (
              <Button title="Retry" onPress={retryLastAction} color="#007AFF" />
            )}
            {currentError.canCheckConnection && (
              <Button
                title="Check Connection"
                onPress={() => {
                  // Check network connectivity
                  if (navigator.onLine) {
                    Alert.alert(
                      "Connection",
                      "You are online. The issue might be with the server."
                    );
                  } else {
                    Alert.alert(
                      "Connection",
                      "You are offline. Please check your internet connection."
                    );
                  }
                }}
                color="#FF9500"
              />
            )}
            {currentError.canFixInput && (
              <Button title="Fix Input" onPress={clearError} color="#34C759" />
            )}
            <Button title="Dismiss" onPress={clearError} color="#8E8E93" />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    marginBottom: 30,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: "100%",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },
  priceInput: {
    flex: 1,
    padding: 10,
    fontSize: 16,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  currencyButtonTouchable: {
    backgroundColor: "#36E623",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  currencyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  checkLocationButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  checkLocationButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  createOrderButton: {
    backgroundColor: "#36E623",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  createOrderButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    borderRadius: 10,
    padding: 15,
    marginTop: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  errorIcon: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 5,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  errorActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
});

export default OrderForm;
