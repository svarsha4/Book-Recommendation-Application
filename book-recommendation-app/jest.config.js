const nextJest = require('next/jest');
 
/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});
 
// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // Handle module aliases (this matches your jsconfig.json or tsconfig.json)
    '^/src/(.*)$': '<rootDir>/src/$1',
    '^/context/(.*)$': '<rootDir>/context/$1',
    '^/utils/(.*)$': '<rootDir>/utils/$1',
    '^/data/(.*)$': '<rootDir>/data/$1',
  },
};
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);