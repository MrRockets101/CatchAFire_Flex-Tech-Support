/**
 * Distance calculation utilities using the Haversine formula
 */

/**
 * Calculate the distance between two geographic coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of first point in degrees
 * @param {number} lon1 - Longitude of first point in degrees
 * @param {number} lat2 - Latitude of second point in degrees
 * @param {number} lon2 - Longitude of second point in degrees
 * @returns {number} Distance in miles
 */
export const getDistanceFromLatLonInMiles = (lat1, lon1, lat2, lon2) => {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

/**
 * Convert degrees to radians
 * @param {number} deg - Angle in degrees
 * @returns {number} Angle in radians
 */
export const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Check if a location is within delivery range (10 miles) from market
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @param {number} marketLat - Market latitude (default: Seattle area)
 * @param {number} marketLon - Market longitude (default: Seattle area)
 * @param {number} maxDistance - Maximum delivery distance in miles (default: 10)
 * @returns {boolean} True if within delivery range
 */
export const isWithinDeliveryRange = (
  userLat,
  userLon,
  marketLat = 47.6101,
  marketLon = -122.2015,
  maxDistance = 10
) => {
  const distance = getDistanceFromLatLonInMiles(
    userLat,
    userLon,
    marketLat,
    marketLon
  );
  return distance <= maxDistance;
};
