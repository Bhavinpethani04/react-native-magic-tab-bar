const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const repoRoot = path.resolve(projectRoot, '..');

// Load the library straight from its TypeScript source, so you can edit `src/`
// and see changes here with no build step. We only expose the entry points a
// bare React Native app should use — the `/react-navigation` binding and the
// icon helper subpath — never the Expo Router main entry (which imports
// `expo-router`, a dependency this app intentionally does not install).
const librarySources = {
  'react-native-magic-tab-bar/react-navigation': path.resolve(
    repoRoot,
    'src/reactNavigation.tsx',
  ),
  'react-native-magic-tab-bar/default-tabs': path.resolve(
    repoRoot,
    'src/defaultTabs.tsx',
  ),
};

// Packages that MUST resolve to a single copy. The library source lives at
// `../src`, outside this app's `node_modules`, so a bare `import 'react'` there
// would otherwise walk up and find the repo root's copy — a *second* React,
// which breaks hooks ("Invalid hook call" / "Cannot read property 'useMemo' of
// null"). We block the repo root's copies and redirect these to this app's.
const singletons = [
  'react',
  'react-native',
  'react-native-reanimated',
  'react-native-worklets',
  'react-native-safe-area-context',
  'react-native-screens',
  '@react-navigation/native',
  '@react-navigation/bottom-tabs',
];

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const blockList = new RegExp(
  '^(' +
    singletons
      .map(
        (name) =>
          escapeRegExp(path.join(repoRoot, 'node_modules', name)) + '(/.*)?',
      )
      .join('|') +
    ')$',
);
const extraNodeModules = Object.fromEntries(
  singletons.map((name) => [name, path.join(projectRoot, 'node_modules', name)]),
);

/** @type {import('@react-native/metro-config').MetroConfig} */
const config = {
  // Watch the repo root so Metro picks up edits to the library's `src/`.
  watchFolders: [repoRoot],
  resolver: {
    // Never resolve the shared singletons from the repo root's node_modules …
    blockList,
    // … always resolve them from THIS app's node_modules instead.
    extraNodeModules,
    resolveRequest: (context, moduleName, platform) => {
      const source = librarySources[moduleName];
      if (source) {
        return { type: 'sourceFile', filePath: source };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(projectRoot), config);
