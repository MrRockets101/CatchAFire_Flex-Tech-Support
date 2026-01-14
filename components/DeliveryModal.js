import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

const DeliveryModal = ({
  visible,
  onClose,
  streetAddress,
  setStreetAddress,
  apartment,
  setApartment,
  city,
  setCity,
  state,
  setState,
  zipCode,
  setZipCode,
  country,
  setCountry,
  onValidateDelivery,
  deliveryResult,
  onResetForm,
}) => {
  const handleValidateDelivery = async () => {
    // Validate required address fields
    if (
      !streetAddress.trim() ||
      !city.trim() ||
      !state.trim() ||
      !zipCode.trim() ||
      country === "Select Country"
    ) {
      onValidateDelivery(new Error("Incomplete address"), {
        customMessage:
          "Please fill in all required address fields: Street Address, City, State, ZIP Code, and Country.",
      });
      return;
    }

    // Simulate delivery validation (in real app, this would geocode the address)
    // For now, we'll assume delivery is valid if address is in Johannesburg area
    const isValidDelivery =
      city.toLowerCase().includes("johannesburg") ||
      zipCode.startsWith("200") ||
      zipCode.startsWith("219");

    const result = {
      valid: isValidDelivery,
      distance: isValidDelivery ? 5 : 15, // Mock distance
      message: isValidDelivery
        ? "Delivery location confirmed!"
        : "Delivery location not available. Must be within 10 miles of Johannesburg CBD.",
      address: {
        street: streetAddress,
        apartment,
        city,
        state,
        zipCode,
        country,
      },
    };

    onValidateDelivery(result);
  };

  const handleCancel = () => {
    onClose();
    onResetForm();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.deliveryModalContent}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitleMain}>Delivery Location</Text>
            <Text style={styles.modalTitleLocation}>
              Johannesburg, Gauteng, South Africa, 2000-2199
            </Text>
          </View>
          <Text style={styles.modalSubtitle}>Enter your delivery location</Text>

          <View style={styles.addressForm}>
            <TextInput
              style={styles.addressInput}
              placeholder="Street Address"
              placeholderTextColor="#999"
              value={streetAddress}
              onChangeText={setStreetAddress}
            />

            <TextInput
              style={styles.addressInput}
              placeholder="Apartment/Unit (Optional)"
              placeholderTextColor="#999"
              value={apartment}
              onChangeText={setApartment}
            />

            <View style={styles.addressRow}>
              <TextInput
                style={[styles.addressInput, styles.cityInput]}
                placeholder="City"
                placeholderTextColor="#999"
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={[styles.addressInput, styles.stateInput]}
                placeholder="State"
                placeholderTextColor="#999"
                value={state}
                onChangeText={setState}
              />
            </View>

            <View style={styles.addressRow}>
              <TextInput
                style={[styles.addressInput, styles.zipInput]}
                placeholder="ZIP Code"
                placeholderTextColor="#999"
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
              />
              <View style={[styles.addressInput, styles.countryInput]}>
                <TextInput
                  style={styles.picker}
                  placeholder="Country"
                  placeholderTextColor="#999"
                  value={country}
                  onChangeText={setCountry}
                />
              </View>
            </View>
          </View>

          <View style={styles.deliveryButtons}>
            <TouchableOpacity
              style={styles.checkDeliveryButton}
              onPress={handleValidateDelivery}
            >
              <Text style={styles.checkDeliveryButtonText}>
                Delivery Location
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelDeliveryButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelDeliveryButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {deliveryResult && !deliveryResult.valid && (
            <View style={styles.deliveryResult}>
              <Text style={styles.resultTitle}>
                ❌ Delivery Location Unavailable
              </Text>
              <Text style={styles.resultMessage}>{deliveryResult.message}</Text>
            </View>
          )}
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
  deliveryModalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "95%",
    maxWidth: 400,
    maxHeight: "90%",
  },
  modalTitleContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitleMain: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalTitleLocation: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  addressForm: {
    width: "100%",
    marginBottom: 20,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cityInput: {
    flex: 1,
    marginRight: 10,
  },
  stateInput: {
    flex: 1,
  },
  zipInput: {
    flex: 1,
    marginRight: 10,
  },
  countryInput: {
    flex: 1,
    justifyContent: "center",
  },
  picker: {
    fontSize: 16,
    color: "#333",
  },
  deliveryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  checkDeliveryButton: {
    backgroundColor: "#36E623",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  checkDeliveryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelDeliveryButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  cancelDeliveryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  deliveryResult: {
    backgroundColor: "#FFE5E5",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  resultMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
});

export default DeliveryModal;
