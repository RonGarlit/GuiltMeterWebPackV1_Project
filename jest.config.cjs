module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  resetMocks: true,
  restoreMocks: true,
  verbose: true
};