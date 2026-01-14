# Code Citations & Source Attributions

This document provides source attributions for code snippets, algorithms, and implementations used throughout the CatchaFire Order Management Platform. All external code sources are properly attributed with their original licenses and repository links.

- [Distance Calculation Algorithm](#distance-calculation-algorithm)
- [React Context Pattern Implementation](#react-context-pattern-implementation)
- [Axios HTTP Client Configuration](#axios-http-client-configuration)
- [FastAPI Application Structure](#fastapi-application-structure)
- [Database Context Manager Pattern](#database-context-manager-pattern)
- [CSV Generation for Bulk Orders](#csv-generation-for-bulk-orders)
- [Currency Exchange Integration](#currency-exchange-integration)
- [Expo Location Services](#expo-location-services)

## Distance Calculation Algorithm

### Haversine Formula Implementation

**Location**: [frontend/contexts/LocationContext.js#L11-L27](frontend/contexts/LocationContext.js#L11-L27)

**Code Attribution:**

```javascript
// Haversine formula to calculate distance between two lat/lon points
const getDistanceFromLatLonInMiles = (lat1, lon1, lat2, lon2) => {
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

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};
```

**Source Attributions:**

## License: unknown

https://github.com/braican/neighbrewhood/blob/a651df9f662bafc167492686473414d443eb720e/src/utils/getDistanceBetween.js

## License: MIT

https://github.com/jdillard/personal-site/blob/c4e9037047aab1ff7a9ff8520ea7476bb1841c43/source/assets/js/weather.js

## License: GPL-3.0

https://github.com/andes/api/blob/7535f967e4c588bb1fd4378283701dd8d3c4652d/utils/utilCoordenadas.ts

## License: unknown

https://github.com/EdmilDM/serverless-api/blob/1a1afae21bccf322948d34edae2f53e3a39845bc/api/utils/distanceCalculator.js

## License: unknown

https://github.com/mbron770/Tesla-Super-Charger-Finder/blob/c4f75781814c2fd3e557947e2f99d67b05ed5b9c/src/components/carddisplay.jsx
