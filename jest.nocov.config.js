module.exports = {
  collectCoverageFrom: ['src/**/*.js'],
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/']
};
