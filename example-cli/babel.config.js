module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Reanimated 4 is driven by react-native-worklets. Its Babel plugin rewrites
  // worklet functions and MUST be listed last.
  plugins: ['react-native-worklets/plugin'],
};
