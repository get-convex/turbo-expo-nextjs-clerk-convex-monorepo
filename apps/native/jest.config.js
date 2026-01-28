module.exports = {
  preset: "jest-expo",
  setupFiles: ["<rootDir>/jest.env.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^react$": "<rootDir>/node_modules/react",
  },
  collectCoverageFrom: [
    "app/**/*.{ts,tsx}",
    "src/**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!src/screens/**",
    "!src/navigation-archive/**",
  ],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  testPathIgnorePatterns: ["/node_modules/"],
};
