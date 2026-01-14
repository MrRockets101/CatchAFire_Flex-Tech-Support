const fs = require("fs");
const path = require("path");

// Mapping of Android API levels to versions
const apiToVersion = {
  21: 5.0,
  22: 5.1,
  23: 6.0,
  24: 7.0,
  25: 7.1,
  26: 8.0,
  27: 8.1,
  28: 9,
  29: 10,
  30: 11,
  31: 12,
  32: 12.1,
  33: 13,
  34: 14,
  35: 15,
  36: 16,
  // Add more as needed
};

// Paths
const appJsonPath = path.join(__dirname, "frontend", "app.json");
const readmePath = path.join(__dirname, "Project-Considerations.md");

// Read app.json
const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
const minSdkVersion = appJson.expo.android.minSdkVersion;
const androidVersion = apiToVersion[minSdkVersion] || "Unknown";

// Read README
let readme = fs.readFileSync(readmePath, "utf8");

// Replace placeholders
readme = readme.replace(
  /Android API \d+\+ \[minSdkVersion from app\.json\] \/ Android [\d.]+/,
  `Android API ${minSdkVersion}+ [minSdkVersion from app.json] / Android ${androidVersion}+`
);

// Write back
fs.writeFileSync(readmePath, readme);

console.log(
  `README updated: minSdkVersion ${minSdkVersion}, Android ${androidVersion}`
);
