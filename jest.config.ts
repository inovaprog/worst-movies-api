module.exports = {
  preset: "ts-jest", // Use ts-jest preset
  testEnvironment: "node", // Set the test environment to Node.js
  moduleFileExtensions: ["ts", "js", "json", "node"], // Include file extensions
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
};
