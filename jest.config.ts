/** @type {import('jest').Config} */
const config = {
  testEnvironment:          'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper:         { '^@/(.*)$': '<rootDir>/$1' },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: { jsx: 'react-jsx', ignoreDeprecations: '6.0', rootDir: '.' },
    }],
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
};

export default config;
