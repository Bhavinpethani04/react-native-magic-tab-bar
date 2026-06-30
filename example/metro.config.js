// Learn more: https://docs.expo.dev/guides/monorepos/
// The repo root is detected as the monorepo root (via `workspaces` in the root
// package.json), so Expo automatically watches it — including the library `src`.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const repoRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Load the library straight from its TypeScript source (live editing, no build step in dev).
const upstreamResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-magic-tab-bar') {
    return {
      type: 'sourceFile',
      filePath: path.resolve(repoRoot, 'src/index.tsx'),
    };
  }
  const resolver = upstreamResolveRequest ?? context.resolveRequest;
  return resolver(context, moduleName, platform);
};

module.exports = config;
