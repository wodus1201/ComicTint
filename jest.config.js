module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(' +
      '@react-native' +
      '|react-native' +
      '|react-native-.*' +
      '|@react-native-.*' +
      '|@react-navigation/.*' +
      ')/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '^react-native-reanimated$': '<rootDir>/__mocks__/react-native-reanimated.js',
    '^react-native/Libraries/Animated/NativeAnimatedHelper$':
      '<rootDir>/__mocks__/NativeAnimatedHelper.js',
    '^react-native-document-picker$': '<rootDir>/__mocks__/react-native-document-picker.ts',
    '^react-native-blob-util$': '<rootDir>/__mocks__/react-native-blob-util.ts',
    '^@react-native-async-storage/async-storage$':
      '<rootDir>/__mocks__/@react-native-async-storage/async-storage.js',
  },
};
