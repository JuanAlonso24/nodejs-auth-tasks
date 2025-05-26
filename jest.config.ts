module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxWorkers: 2,
  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/__test__/**/*.test.ts"],
};
