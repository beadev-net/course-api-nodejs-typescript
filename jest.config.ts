/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  setupFilesAfterEnv: ['<rootDir>/src/setup-tests.ts'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  testRegex: '(test|spec)\\.ts',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/__tests__/setup-tests.ts', 'dist', 'coverage'],
  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],
};
