/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/frontend/app/components/$1',
    '^@/lib/(.*)$': '<rootDir>/frontend/lib/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/frontend/tests/jest.setup.ts'],
  testMatch: [
    '<rootDir>/frontend/tests/**/*.test.ts?(x)'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest'
  }
};

module.exports = config; 