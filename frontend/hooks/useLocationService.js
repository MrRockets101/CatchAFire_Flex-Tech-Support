import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { getDistanceFromLatLonInMiles, isWithinDeliveryRange } from "../utils";

/**
 * Custom hook for location services
 * @returns {object} Location hook state and functions
 */
export const useLocationService = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Request location permissions and get current position
   * @returns {Promise<object|null>} Location object or null if failed
   */
  const requestLocation = async () => {
    try {
      setLoading(true);
      setError(null);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData.coords);
      return locationData.coords;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Check if current location is within delivery range
   * @param {number} marketLat - Market latitude (optional)
   * @param {number} marketLon - Market longitude (optional)
   * @param {number} maxDistance - Max delivery distance in miles (optional)
   * @returns {Promise<{isWithinRange: boolean, distance: number, error: string|null}>}
   */
  const checkDeliveryEligibility = async (
    marketLat = 47.6101,
    marketLon = -122.2015,
    maxDistance = 10
  ) => {
    const currentLocation = location || (await requestLocation());

    if (!currentLocation) {
      return {
        isWithinRange: false,
        distance: 0,
        error: "Unable to get location",
      };
    }

    const distance = getDistanceFromLatLonInMiles(
      currentLocation.latitude,
      currentLocation.longitude,
      marketLat,
      marketLon
    );

    const isWithinRange = distance <= maxDistance;

    return {
      isWithinRange,
      distance: Math.round(distance * 10) / 10, // Round to 1 decimal place
      error: null,
    };
  };

  /**
   * Calculate distance to a specific point
   * @param {number} targetLat - Target latitude
   * @param {number} targetLon - Target longitude
   * @returns {number} Distance in miles
   */
  const getDistanceTo = (targetLat, targetLon) => {
    if (!location) return 0;

    return getDistanceFromLatLonInMiles(
      location.latitude,
      location.longitude,
      targetLat,
      targetLon
    );
  };

  return {
    location,
    error,
    loading,
    requestLocation,
    checkDeliveryEligibility,
    getDistanceTo,
    hasLocation: !!location,
  };
};
