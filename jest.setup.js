// In a real React Native app `__DEV__` is injected as a global by Metro. Under
// Node/Jest it is undefined, so referencing it in the source (for dev-only
// warnings) would throw a ReferenceError. Default it to `false` here so those
// branches are simply skipped and tests run without console noise.
global.__DEV__ = false;
