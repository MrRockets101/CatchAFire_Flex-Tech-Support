import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const DeliveryConfirmationModal = ({ visible, onClose, deliveryResult }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.deliveryModalContent}>
          <ScrollView contentContainerStyle={styles.modalScrollContent}>
            <Text style={styles.confirmationTitle}>
              Delivery Location Confirmed
            </Text>
            <Text style={styles.confirmationSubtitle}>
              Your delivery location is now
            </Text>

            {deliveryResult && deliveryResult.valid && (
              <View style={styles.confirmationDetails}>
                <Text style={styles.confirmationAddress}>
                  {`${deliveryResult.address.street}${
                    deliveryResult.address.apartment
                      ? `, ${deliveryResult.address.apartment}`
                      : ""
                  }
${deliveryResult.address.city}, ${deliveryResult.address.state} ${
                    deliveryResult.address.zipCode
                  }
${deliveryResult.address.country}`}
                </Text>
                <Text style={styles.confirmationSubtext}>
                  Estimated delivery time: 30-45 minutes
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.confirmationButton}
              onPress={onClose}
            >
              <Text style={styles.confirmationButtonText}>Continue</Text>
            </TouchableOpacity>
          </ScrollView>
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
  modalScrollContent: {
    alignItems: "center",
    paddingVertical: 20,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#34C759",
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  confirmationDetails: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  confirmationAddress: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
    lineHeight: 22,
  },
  confirmationSubtext: {
    fontSize: 12,
    textAlign: "center",
    color: "#666",
  },
  confirmationButton: {
    backgroundColor: "#36E623",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmationButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeliveryConfirmationModal;
