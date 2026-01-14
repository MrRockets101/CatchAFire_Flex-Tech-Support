import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  CurrencyProvider,
  LocationProvider,
  UserProvider,
  useCurrency,
  useLocation,
  useUser,
} from "./contexts";
import { useCSVOrder } from "./hooks";
import { useErrorHandler } from "./utils/errorHandler";
import {
  CurrencyModal,
  DeliveryModal,
  DeliveryConfirmationModal,
  OrderForm,
} from "./components";

// Main App Component
const AppContent = () => {
  // List of countries for the picker
  const countries = [
    "Select Country",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Comoros",
    "Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea North",
    "Korea South",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Macedonia",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];
  const getCurrencySymbol = (currency) => {
    const symbols = {
      ZAR: "R",
      USD: "$",
      EUR: "€",
    };
    return symbols[currency] || currency;
  };
  const { checkDeliveryLocation } = useLocation();
  const { customerId, userName } = useUser();
  const { createCSVOrder, loading, error } = useCSVOrder();
  const { handleError, clearError, retryLastAction, hasError, currentError } =
    useErrorHandler();
  const { selectedCurrency, setSelectedCurrency } = useCurrency();

  // Get location-based order time (currently UTC, but location-aware for future enhancement)
  const getLocationBasedOrderTime = () => {
    // TODO: In future, detect timezone from user coordinates and adjust accordingly
    // For now, use UTC time as expected by backend
    // When location-based timezones are implemented, convert to user's local timezone
    return new Date().toISOString();
  };

  // Form state for CSV order

  const [productName, setProductName] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [totalPrice, setTotalPrice] = React.useState("");
  const [currencyModalVisible, setCurrencyModalVisible] = React.useState(false);
  const [deliveryModalVisible, setDeliveryModalVisible] = React.useState(false);
  const [deliveryConfirmationVisible, setDeliveryConfirmationVisible] =
    React.useState(false);
  const [deliveryResult, setDeliveryResult] = React.useState(null);
  const [deliveryValidated, setDeliveryValidated] = React.useState(false);
  const [validatedAddress, setValidatedAddress] = React.useState(null);

  // Delivery address state
  const [streetAddress, setStreetAddress] = React.useState(
    "123 Commissioner Street"
  );
  const [apartment, setApartment] = React.useState("");
  const [city, setCity] = React.useState("Johannesburg");
  const [state, setState] = React.useState("Gauteng");
  const [zipCode, setZipCode] = React.useState("2001");
  const [country, setCountry] = React.useState("South Africa");

  const selectCurrency = () => {
    setCurrencyModalVisible(true);
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    setCurrencyModalVisible(false);
  };

  const handleCreateOrder = async () => {
    if (!quantity || !totalPrice) {
      handleError(new Error("Please fill in quantity and total price"), {
        customMessage:
          "Required fields are missing. Please enter both quantity and total price.",
      });
      return;
    }

    // Check if delivery address has been validated
    if (!deliveryValidated || !validatedAddress) {
      handleError(new Error("Delivery address not validated"), {
        customMessage:
          "Please confirm your delivery location before placing an order.",
      });
      return;
    }

    try {
      const orderData = {
        customer_id: customerId, // Always from user context (defaults to 1)
        product_name: productName.trim() || "Unknown Product", // Apply default if empty/whitespace
        quantity: parseInt(quantity),
        total_price: parseFloat(totalPrice),
        order_time: getLocationBasedOrderTime(), // UTC time (location-aware for future timezone detection)
      };

      const response = await createCSVOrder(orderData);
      const details = response.data.order_details;
      const fallbackMode = response.data.fallback_mode;
      const databaseSaved = response.data.database_saved;

      let alertTitle = "Order Placed Successfully!";
      let alertMessage = `Order ID: ${details.order_id}\n\nProduct: ${
        details.product_name
      }\nQuantity: ${details.quantity}\nTotal Price: $${
        details.total_price
      }\nOrder Time: ${new Date(details.order_time).toLocaleString()}`;

      if (fallbackMode) {
        alertTitle = "Order Placed (Offline Mode)";
        alertMessage += "\n\n⚠️ Database unavailable - order saved to CSV only";
      } else if (databaseSaved) {
        alertMessage += "\n\n✅ Order saved to database and CSV";
      }

      Alert.alert(alertTitle, alertMessage);

      // Clear form
      setProductName("");
      setQuantity("");
      setTotalPrice("");
      // Reset delivery validation for next order
      setDeliveryValidated(false);
      setValidatedAddress(null);
      setDeliveryResult(null);
    } catch (err) {
      // Use dynamic error handling
      handleError(err, {
        onRetry: handleCreateOrder, // Allow retrying the order placement
        customMessage: err.response?.data?.error || err.message,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CatchaFire Order System</Text>

      <OrderForm
        productName={productName}
        setProductName={setProductName}
        quantity={quantity}
        setQuantity={setQuantity}
        totalPrice={totalPrice}
        setTotalPrice={setTotalPrice}
        selectedCurrency={selectedCurrency}
        getCurrencySymbol={getCurrencySymbol}
        selectCurrency={selectCurrency}
        deliveryValidated={deliveryValidated}
        loading={loading}
        handleCreateOrder={handleCreateOrder}
        setDeliveryModalVisible={setDeliveryModalVisible}
        hasError={hasError}
        currentError={currentError}
        retryLastAction={retryLastAction}
        clearError={clearError}
      />

      {/* Currency Selection Modal */}
      <CurrencyModal
        visible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
        selectedCurrency={selectedCurrency}
        onCurrencySelect={handleCurrencySelect}
      />

      {/* Delivery Address Modal */}
      <DeliveryModal
        visible={deliveryModalVisible}
        onClose={() => setDeliveryModalVisible(false)}
        streetAddress={streetAddress}
        setStreetAddress={setStreetAddress}
        apartment={apartment}
        setApartment={setApartment}
        city={city}
        setCity={setCity}
        state={state}
        setState={setState}
        zipCode={zipCode}
        setZipCode={setZipCode}
        country={country}
        setCountry={setCountry}
        onValidateDelivery={(result) => {
          setDeliveryResult(result);
          if (result.valid) {
            setDeliveryValidated(true);
            setValidatedAddress(result.address);
            setDeliveryModalVisible(false);
            setDeliveryConfirmationVisible(true);
          }
        }}
        deliveryResult={deliveryResult}
        onResetForm={() => {
          setStreetAddress("123 Commissioner Street");
          setApartment("");
          setCity("Johannesburg");
          setState("Gauteng");
          setZipCode("2001");
          setCountry("South Africa");
        }}
      />

      {/* Delivery Confirmation Modal */}
      <DeliveryConfirmationModal
        visible={deliveryConfirmationVisible}
        onClose={() => setDeliveryConfirmationVisible(false)}
        deliveryResult={deliveryResult}
      />

      <StatusBar style="auto" />
    </View>
  );
};

// App Wrapper with all Providers
export default function App() {
  return (
    <UserProvider>
      <CurrencyProvider>
        <LocationProvider>
          <AppContent />
        </LocationProvider>
      </CurrencyProvider>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
