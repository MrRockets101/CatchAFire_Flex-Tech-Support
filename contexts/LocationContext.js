import React, { createContext, useContext } from "react";
import * as Location from "expo-location";
import { Alert } from "react-native";
import { getDistanceFromLatLonInMiles, deg2rad } from "../utils";

// Location Context
const LocationContext = createContext();

// Location Provider Component
export const LocationProvider = ({ children }) => {
  // Check delivery location validity
  const checkDeliveryLocation = async (onError) => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        const error = new Error("Location permission denied");
        error.type = "permission";
        if (onError) onError(error);
        return false;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Market coordinates for South Africa deployment
      // Using Johannesburg CBD as example market location
      // Coordinates: -26.2041° S, 28.0473° E (Johannesburg CBD)
      const marketLat = -26.2041;
      const marketLon = 28.0473;

      const distance = getDistanceFromLatLonInMiles(
        latitude,
        longitude,
        marketLat,
        marketLon
      );

      if (distance > 10) {
        // Return distance info instead of showing alert
        return {
          valid: false,
          distance: distance,
          message: `Delivery can't be processed for the requested location as it is greater than 10 miles from the market.`,
        };
      } else {
        // Return success info instead of showing alert
        return {
          valid: true,
          distance: distance,
          message: `Great! You are ${distance.toFixed(
            1
          )} miles from the market. Delivery is available.`,
        };
      }
    } catch (error) {
      console.error("Location check error:", error);
      const locationError = new Error(
        "Failed to check delivery location. Please try again."
      );
      locationError.type = "location";
      if (onError) onError(locationError);
      return false;
    }
  };

  const value = {
    checkDeliveryLocation,
    getDistanceFromLatLonInMiles,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
