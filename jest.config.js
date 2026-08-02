/**
 * Jest config for the library's unit tests.
 *
 * The tests only exercise the framework-agnostic pure logic in `src/utils.ts`
 * (and `src/theme.ts`), so there is deliberately no React Native / Reanimated
 * preset here — that keeps the suite fast and free of native-module flakiness.
 * Babel is configured inline (`configFile: false`) so it never picks up the
 * example apps' Babel configs or interferes with the `bob` build.
 */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  // `__DEV__` is a Metro-injected global in a real RN app; define it here so the
  // dev-only warnings in the source don't throw a ReferenceError under Node.
  setupFiles: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.[jt]sx?$': [
      'babel-jest',
      {
        configFile: false,
        babelrc: false,
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },
};
