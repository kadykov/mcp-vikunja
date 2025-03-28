/** @type {import('jest').Config} */
export default {
  testPathIgnorePatterns: ['/node_modules/', '/local-docs/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
  setupFilesAfterEnv: ['./test/setup.ts'],
  reporters: [
    [
      'jest-silent-reporter',
      {
        useDots: true,
        showPaths: true,
        showInlineStatus: true,
        showWarnings: true,
      },
    ],
  ],
  verbose: true,
};
