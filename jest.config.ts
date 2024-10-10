module.exports = {
  preset: "ts-jest", // Use ts-jest preset
  testEnvironment: "node", // Set the test environment to Node.js
  moduleFileExtensions: ["ts", "js", "json", "node"], // Include file extensions
  transform: {
    "^.+\\.ts$": "ts-jest", // Transform TypeScript files
  },
  // Optionally, if you're using ES modules
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true, // Enable ESM for ts-jest
    },
  },
};
