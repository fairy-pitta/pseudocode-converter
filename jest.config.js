module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  testMatch: ['**/__tests__/python-igcse-parser.test.ts'],
  collectCoverageFrom: [
    'lib/**/*.ts',
    '!lib/**/*.d.ts',
  ],
  watchman: false,
  maxWorkers: 1,
  verbose: true,
  silent: false,
};