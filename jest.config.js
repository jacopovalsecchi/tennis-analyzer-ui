const preset = require('@react-native/jest-preset');

module.exports = {
  ...preset,
  setupFiles: [...preset.setupFiles, '<rootDir>/jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native-image-picker|react-native-video)/)',
  ],
};
