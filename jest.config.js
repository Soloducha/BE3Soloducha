/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  transform: {},
  testMatch: ["**/test/**/*.test.js"],
  clearMocks: true,
  restoreMocks: true,
};

export default config;
