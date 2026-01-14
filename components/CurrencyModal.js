import React from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";

const CurrencyModal = ({
  visible,
  onClose,
  selectedCurrency,
  onCurrencySelect,
}) => {
  const handleCurrencySelect = (currency) => {
    onCurrencySelect(currency);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Currency</Text>
          <Text style={styles.modalSubtitle}>
            Choose your preferred currency
          </Text>

          <View style={styles.currencyOptions}>
            <TouchableOpacity
              style={[
                styles.currencyOption,
                selectedCurrency === "ZAR" && styles.currencyOptionSelected,
              ]}
              onPress={() => handleCurrencySelect("ZAR")}
            >
              <Text
                style={[
                  styles.currencyOptionText,
                  selectedCurrency === "ZAR" &&
                    styles.currencyOptionTextSelected,
                ]}
              >
                🇿🇦 ZAR - South African Rand
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.currencyOption,
                selectedCurrency === "USD" && styles.currencyOptionSelected,
              ]}
              onPress={() => handleCurrencySelect("USD")}
            >
              <Text
                style={[
                  styles.currencyOptionText,
                  selectedCurrency === "USD" &&
                    styles.currencyOptionTextSelected,
                ]}
              >
                🇺🇸 USD - US Dollar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.currencyOption,
                selectedCurrency === "EUR" && styles.currencyOptionSelected,
              ]}
              onPress={() => handleCurrencySelect("EUR")}
            >
              <Text
                style={[
                  styles.currencyOptionText,
                  selectedCurrency === "EUR" &&
                    styles.currencyOptionTextSelected,
                ]}
              >
                🇪🇺 EUR - Euro
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  currencyOptions: {
    width: "100%",
    marginBottom: 20,
  },
  currencyOption: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: "center",
  },
  currencyOptionSelected: {
    borderColor: "#36E623",
    backgroundColor: "#F0FFF0",
  },
  currencyOptionText: {
    fontSize: 16,
    color: "#333",
  },
  currencyOptionTextSelected: {
    color: "#36E623",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CurrencyModal;
