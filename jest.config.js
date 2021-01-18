module.exports = {
  transform: {
    '.tsx?$': 'ts-jest'
  },
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testPathIgnorePatterns: ['/dist/', '/node_modules/', '/tests/helpers/legacy-helpers.js', '/tests/test-helpers.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'jsx', 'js', 'json'],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/*.ts',
    'src/helpers/**/*.ts',
    'src/models/**/*.ts',
    'src/services/**/*.ts'
  ]
}
