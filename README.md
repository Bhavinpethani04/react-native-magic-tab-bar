<h1 align="center">react-native-magic-tab-bar</h1>

<p align="center">
  A customizable, animated <b>floating tab bar for React Native</b> — one drop-in
  component that works with <b>Expo Router</b> <i>and</i> <b>React Navigation</b>
  (bare React Native CLI). Bring your own icons.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-native-magic-tab-bar"><img alt="npm version" src="https://img.shields.io/npm/v/react-native-magic-tab-bar?color=2563EB&label=npm"></a>
  <a href="https://www.npmjs.com/package/react-native-magic-tab-bar"><img alt="npm downloads" src="https://img.shields.io/npm/dm/react-native-magic-tab-bar?color=2563EB"></a>
  <img alt="Platforms: iOS and Android" src="https://img.shields.io/badge/platforms-iOS%20%7C%20Android-lightgrey">
  <img alt="Ships TypeScript types" src="https://img.shields.io/npm/types/react-native-magic-tab-bar">
  <a href="./LICENSE"><img alt="MIT license" src="https://img.shields.io/npm/l/react-native-magic-tab-bar?color=2563EB"></a>
</p>

<p align="center">
  <b>Expo Router</b> · <b>React Navigation</b> · <b>Expo</b> · <b>React Native CLI</b> · <b>iOS &amp; Android</b> · <b>New Architecture</b> · <b>TypeScript</b>
</p>

**react-native-magic-tab-bar** is a drop-in **custom bottom tab bar for React Native**. Instead of the default tab bar, you get a floating, animated bar with an active-tab pill, badges, labels, haptics, glass/blur backgrounds and full theming — on both **iOS and Android**. The same component works whether your app uses **[Expo Router](https://docs.expo.dev/router/introduction/)** or **[React Navigation](https://reactnavigation.org/)** (`@react-navigation/bottom-tabs`), so you can search less and ship faster.

> **Two entry points, one look:**
> - **Expo Router** → `MagicTabs` from `react-native-magic-tab-bar` (see [Quick start](#quick-start)).
> - **Bare React Native / React Navigation** → `MagicTabBarNavigation` from `react-native-magic-tab-bar/react-navigation` (see [React Navigation](#react-navigation-bare-react-native)).
>
> Pick whichever entry point matches your app — you never pull in the other framework's dependencies.

## Features

- 🎯 **Drop-in for both** — one component for Expo Router *and* React Navigation; bring your own icons.
- ✨ **Animated active pill** with a spring you can tune.
- 🏷️ **Flexible labels** — beside or below the icon; show on the active tab, always, or never.
- 🔴 **Badges** — dots or counts on any tab.
- 🧊 **Glass / blur / transparent** backgrounds (native iOS Liquid Glass supported).
- 📳 **Haptics** and **press callbacks** (great for "scroll to top" on re-press).
- ➕ **Action (FAB) tab** for a raised center button.
- 🪶 **Light mode** — a compact, icon-only bar you can switch on **per tab** (e.g. only on an immersive full-screen feed), with a smooth transition.
- 🎨 **Fully themeable** via a single `theme` prop.

## Table of contents

- [Compatibility](#compatibility)
- [Installation](#installation)
- [Quick start](#quick-start) *(Expo Router)*
- [React Navigation (bare React Native)](#react-navigation-bare-react-native)
- [Recipes](#recipes)
  - [Labels](#labels)
  - [Badges](#badges)
  - [Haptics and press callbacks](#haptics-and-press-callbacks)
  - [Disabled tabs](#disabled-tabs)
  - [Action (FAB) tab](#action-fab-tab)
  - [Glass, blur and transparency](#glass-blur-and-transparency)
  - [Light mode](#light-mode-compact-bar)
  - [Theming](#theming)
- [API](#api)
- [Development](#development)
- [Roadmap](#roadmap)
- [License](#license)

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/Bhavinpethani04/react-native-magic-tab-bar/main/assets/gifs/ios.gif" alt="react-native-magic-tab-bar animated floating tab bar demo on iOS" width="280" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/Bhavinpethani04/react-native-magic-tab-bar/main/assets/gifs/android.gif" alt="react-native-magic-tab-bar animated floating tab bar demo on Android" width="280" />
</p>

<p align="center"><sub>iOS (left) &middot; Android (right)</sub></p>

## Compatibility

| Environment | How you use it | Supported |
| --- | --- | :---: |
| **Expo Router** (SDK 56+) | `MagicTabs` from `react-native-magic-tab-bar` | ✅ |
| **React Navigation** (`@react-navigation/bottom-tabs` v6 & v7) | `MagicTabBarNavigation` from `react-native-magic-tab-bar/react-navigation` | ✅ |
| **Bare React Native CLI** | via React Navigation | ✅ |
| **Expo** (managed & prebuild) | via Expo Router | ✅ |
| **iOS** &middot; **Android** | — | ✅ |
| **New Architecture** (Fabric) | — | ✅ |
| **TypeScript** | types bundled, no `@types` needed | ✅ |

## Installation

```bash
npm install react-native-magic-tab-bar
# yarn add react-native-magic-tab-bar
# pnpm add react-native-magic-tab-bar
# bun add react-native-magic-tab-bar
```

Then install the peer dependencies for your framework 👇

### Expo Router

> **Requirements:** an [Expo Router](https://docs.expo.dev/router/introduction/) project (Expo SDK 56+) with an `app/` directory.

Peer dependencies (normally already present in an Expo Router app):

```bash
npx expo install expo-router react-native-reanimated react-native-safe-area-context react-native-worklets
```

Make sure the Reanimated/Worklets Babel plugin is enabled (Expo SDK 56's `babel-preset-expo` configures this automatically).

Optional — install only if you use the matching feature:

```bash
npx expo install expo-glass-effect   # native iOS Liquid Glass (glass prop)
npx expo install expo-haptics        # selection haptics (haptics prop)
npx expo install @expo/vector-icons  # only for the /default-tabs demo set
```

### React Native CLI (React Navigation)

> **Requirements:** a bare React Native CLI app using [`@react-navigation/bottom-tabs`](https://reactnavigation.org/docs/bottom-tab-navigator).

```bash
npm install @react-navigation/native @react-navigation/bottom-tabs \
  react-native-screens react-native-safe-area-context \
  react-native-reanimated react-native-worklets
```

Add the Worklets/Reanimated plugin **last** in your `babel.config.js`:

```js
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-worklets/plugin'],
};
```

iOS: `cd ios && pod install`. No Expo packages are required — the `glass` and `haptics` props are Expo-only and simply no-op here unless you install `expo-glass-effect` / `expo-haptics`.

See the runnable [`example-cli`](example-cli) app for a complete setup.

## Quick start

Use `MagicTabs` as your tab navigator in `app/_layout.tsx`. Each entry in `tabs` maps a route to an icon and label:

```tsx
// app/_layout.tsx
import { MagicTabs } from "react-native-magic-tab-bar";
import { Ionicons } from "@expo/vector-icons";

export default function Layout() {
  return (
    <MagicTabs
      tabs={[
        { name: "index",   href: "/",        label: "Home",    icon: ({ color, size }) => <Ionicons name="home"    color={color} size={size} /> },
        { name: "search",  href: "/search",  label: "Search",  icon: ({ color, size }) => <Ionicons name="search"  color={color} size={size} /> },
        { name: "profile", href: "/profile", label: "Profile", icon: ({ color, size }) => <Ionicons name="person"  color={color} size={size} /> },
      ]}
    />
  );
}
```

- `name` must match the route file in your `app/` directory (e.g. `index`, `search`, `profile`).
- `href` is where the tab navigates.
- `icon` receives `{ focused, color, size }` so you can swap glyphs/colors for the active state.

> `MagicTabs` renders Expo Router's `<Tabs>` for you — put it straight in `app/_layout.tsx`. There's no separate `<Tabs>` wrapper to set up.

**Tip — filled vs. outline icons:** use `focused` to swap the glyph on the active tab:

```tsx
icon: ({ focused, color, size }) => (
  <Ionicons name={focused ? "home" : "home-outline"} color={color} size={size} />
);
```

> **Want a ready-made set for a quick look?** Import the demo tabs from the subpath (this is the only thing that pulls in `@expo/vector-icons`, so the core stays dependency-free):
>
> ```tsx
> import { defaultTabs } from "react-native-magic-tab-bar/default-tabs";
>
> <MagicTabs tabs={defaultTabs} />;
> ```

## React Navigation (bare React Native)

In a bare React Native app you use `MagicTabBarNavigation` as the `tabBar` of a
[bottom tab navigator](https://reactnavigation.org/docs/bottom-tab-navigator).
It takes the **same tab config** as `MagicTabs` — just without `href` (React
Navigation routes by `name`) — so the bar looks and behaves identically.

```tsx
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MagicTabBarNavigation } from "react-native-magic-tab-bar/react-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const tabs = [
  { name: "Home",    label: "Home",    icon: ({ color, size }) => <Ionicons name="home"   color={color} size={size} /> },
  { name: "Search",  label: "Search",  icon: ({ color, size }) => <Ionicons name="search" color={color} size={size} /> },
  { name: "Profile", label: "Profile", icon: ({ color, size }) => <Ionicons name="person" color={color} size={size} /> },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <MagicTabBarNavigation {...props} tabs={tabs} />}
        >
          <Tab.Screen name="Home"    component={HomeScreen} />
          <Tab.Screen name="Search"  component={SearchScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
```

- Each `tabs[].name` must match a `<Tab.Screen name>`.
- **No `href`** — that's an Expo Router concept; React Navigation navigates by `name`.
- Every visual prop from `MagicTabs` (`theme`, `showLabels`, `labelPosition`, `variant`, `isTransparent`, `renderBackground`, `haptics`, `onTabPress`, …) works here too, plus all the [Recipes](#recipes) below.

> **Icons** are bring-your-own, exactly like the Expo entry — the `icon` render function is identical. This example uses [`react-native-vector-icons`](https://github.com/oblador/react-native-vector-icons) (the bare-RN counterpart of `@expo/vector-icons`). Bundle its fonts the CocoaPods way — **not** `react-native-asset`: on **iOS** the pod bundles the font files (just add a `UIAppFonts` entry to `Info.plist`), and on **Android** apply the package's `fonts.gradle` in `app/build.gradle`. The only Expo-specific props are `glass` (`expo-glass-effect`) and `haptics` (`expo-haptics`), which no-op in bare RN unless you add those modules.

> Prefer to keep the config next to your screens instead of a `tabs` array? The
> config is just data — build it however you like; only `name` and `icon` are
> required per tab.

## Recipes

> The recipes below are written with `MagicTabs` (Expo Router), but every prop
> shown also works on `MagicTabBarNavigation` — pass it the same way.

### Labels

Labels are **beside** the icon by default (`labelPosition="right"`), shown only on the **active** tab.

```tsx
<MagicTabs tabs={tabs} labelPosition="bottom" showLabels="always" /> // Material-style bar
<MagicTabs tabs={tabs} showLabels={false} />                         // icon-only bar
```

| `showLabels` | Effect |
| --- | --- |
| `true` / `"active"` | Label on the focused tab only *(default)* |
| `"always"` | Label on every tab *(requires `labelPosition="bottom"`)* |
| `false` / `"never"` | Icon-only |

`labelPosition` is `"right"` (default) or `"bottom"`. You can also override visibility per tab with `showLabel` on the tab config.

### Badges

```tsx
{ name: "inbox", href: "/inbox", label: "Inbox", badge: 5,   icon },  // count bubble
{ name: "alerts", href: "/alerts", label: "Alerts", badge: true, icon }, // dot
```

`badge` accepts a `number`, `string`, or `boolean` (`true` = dot). Numbers above 99 show as `99+`. Colors come from `theme.badgeColor` / `theme.badgeTextColor`.

### Haptics and press callbacks

```tsx
<MagicTabs
  tabs={tabs}
  haptics // selection haptic on tap (needs expo-haptics)
  onTabPress={(name, focused) => {
    if (focused) scrollToTop(name); // re-pressing the active tab
  }}
/>
```

`onTabPress` / `onTabLongPress` receive `(name, focused)`, where `focused` tells you the tab was **already** active — perfect for scroll-to-top or reset-stack behavior.

### Disabled tabs

```tsx
{ name: "soon", href: "/soon", label: "Soon", disabled: true, icon }
```

Dims the tab and blocks navigation to it.

### Action (FAB) tab

Render a raised, circular center button:

```tsx
{ name: "create", href: "/create", variant: "action", icon }
```

Uses `theme.actionColor` / `theme.actionIconColor`.

### Glass, blur and transparency

```tsx
<MagicTabs tabs={tabs} glass />                          // native iOS Liquid Glass (iOS 26+)
<MagicTabs tabs={tabs} isTransparent transparency={0.4} />// translucent bar
<MagicTabs tabs={tabs} renderBackground={() => <MyBlurView />} /> // any custom background
```

- `glass` uses `expo-glass-effect` on iOS 26+ and falls back to the translucent `barColor` elsewhere.
- `renderBackground` renders any view behind the bar; when omitted, a solid `barColor` is used.

### Light mode (compact bar)

A shorter, **icon-only** bar (65% width, floating higher). Turn it on for the whole bar, or **per tab** so it only appears on an immersive screen:

```tsx
// Whole bar
<MagicTabs tabs={tabs} isLight lightBottomMargin={40} />

// Per tab — the bar morphs to light only while "explore" is the active route
<MagicTabs
  tabs={[
    { name: "index",   href: "/",        label: "Home",    icon },
    { name: "explore", href: "/explore", label: "Explore", icon, isLight: true },
    { name: "profile", href: "/profile", label: "Profile", icon },
  ]}
/>
```

The transition between the normal and light bar is animated. `lightBottomMargin` (default `14`) controls the extra gap above the screen edge in light mode.

### Theming

Everything visual — colors, sizes, corner radius, the animation spring — lives in one `theme` prop. Override any subset; the rest falls back to `defaultTheme`.

**The colors that matter most:**

| Token | Controls |
| --- | --- |
| `barColor` | the bar's background |
| `activePillColor` | the pill highlight behind the **active** tab |
| `activeColor` | the active tab's icon + label |
| `inactiveColor` | the icons of **inactive** tabs |
| `badgeColor` / `badgeTextColor` | the badge bubble + its text |
| `actionColor` / `actionIconColor` | the [action (FAB) tab](#action-fab-tab) |

```tsx
<MagicTabs
  tabs={tabs}
  theme={{
    barColor: "#17171C",        // dark bar
    activePillColor: "#2563EB", // blue highlight behind the active tab
    activeColor: "#FFFFFF",     // active icon/label
    inactiveColor: "#9BA0AA",   // inactive icons
    radius: 24,                 // rounder bar & pill
    spring: { mass: 0.6, damping: 16, stiffness: 200 }, // snappier animation
  }}
/>
```

See the [full token list with defaults](#magictabbartheme) for sizes (`iconSize`, `height`, `fontSize`), spacing (`horizontalMargin`, `bottomInset`) and more.

## API

### `<MagicTabs />`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` | `MagicTabConfig[]` | **required** | The tabs, in order. |
| `theme` | `Partial<MagicTabBarTheme>` | `defaultTheme` | Override any visual token. |
| `showLabels` | `boolean \| 'active' \| 'always' \| 'never'` | `'active'` | When labels are shown. `'always'` needs `labelPosition="bottom"`. |
| `labelPosition` | `'right' \| 'bottom'` | `'right'` | Label beside or below the icon. |
| `variant` | `'floating' \| 'docked'` | `'floating'` | Float over content, or dock in flow. |
| `isLight` | `boolean` | `false` | Force the compact light bar for all tabs. |
| `lightBottomMargin` | `number` | `14` | Extra bottom gap in light mode only. |
| `isTransparent` | `boolean` | `false` | Make the bar background see-through. |
| `transparency` | `number` | `0.6` | Bar opacity `0–1` while `isTransparent`. |
| `glass` | `boolean` | `false` | Native iOS Liquid Glass (needs `expo-glass-effect`). |
| `renderBackground` | `() => ReactNode` | — | Custom background (blur/glass) behind the bar. |
| `haptics` | `boolean` | `false` | Selection haptic on press (needs `expo-haptics`). |
| `onTabPress` | `(name, focused) => void` | — | Fired on tab press. |
| `onTabLongPress` | `(name, focused) => void` | — | Fired on tab long-press. |

### `MagicTabConfig`

| Field | Type | Description |
| --- | --- | --- |
| `name` | `string` | Route name. Expo Router: matches the file in `app/`. React Navigation: matches `<Tab.Screen name>`. |
| `href` | `MagicHref?` | Destination, e.g. `/` or `/search`. **Required for Expo Router**, ignored by React Navigation. |
| `icon` | `(p: MagicTabIconProps) => ReactNode` | Renders the icon. Gets `{ focused, color, size }`. |
| `label` | `string?` | Text label. |
| `showLabel` | `boolean?` | Per-tab override of `showLabels`. |
| `badge` | `number \| string \| boolean?` | Dot (`true`) or count bubble. |
| `disabled` | `boolean?` | Dim the tab and block navigation. |
| `variant` | `'action'?` | Render as a raised FAB button. |
| `isLight` | `boolean?` | Switch the whole bar to light mode while this tab is active. |

### `<MagicTabBarNavigation />`

The React Navigation binding, imported from `react-native-magic-tab-bar/react-navigation`. Pass it to `Tab.Navigator`'s `tabBar` prop.

It receives React Navigation's `BottomTabBarProps` (spread from `{...props}`) plus:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tabs` | `MagicNavigationTab[]` | **required** | Per-tab config keyed by route `name` (same as `MagicTabConfig` but without `href`). |

All other visual props are identical to [`<MagicTabs />`](#magictabs-): `theme`, `showLabels`, `labelPosition`, `variant`, `isLight`, `lightBottomMargin`, `isTransparent`, `transparency`, `glass`, `renderBackground`, `haptics`, `onTabPress`, `onTabLongPress`.

> `MagicNavigationTab` is `Omit<MagicTabConfig, 'href'>`.

### `MagicTabBarTheme`

| Token | Default | |
| --- | --- | --- |
| `barColor` | `rgba(38,38,40,0.94)` | Bar background |
| `activePillColor` | `rgba(120,120,124,0.55)` | Active-tab pill |
| `activeColor` | `#FFFFFF` | Active icon/label color |
| `inactiveColor` | `#FFFFFF` | Inactive icon color |
| `iconSize` | `22` | Icon size |
| `fontSize` | `12` | Active label size |
| `height` | `56` | Bar height |
| `radius` | `28` | Bar & pill corner radius |
| `badgeColor` | `#FF3B30` | Badge background |
| `badgeTextColor` | `#FFFFFF` | Badge text |
| `actionColor` | `#0A84FF` | Action (FAB) background |
| `actionIconColor` | `#FFFFFF` | Action (FAB) icon |
| `horizontalMargin` | `14` | Side margin from screen edges |
| `bottomInset` | `10` | Extra space below the bar |
| `spring` | `{ mass: 0.6, damping: 18, stiffness: 180 }` | Pill/label animation |

### Exported types

`MagicTabConfig`, `MagicHref`, `MagicTabIconProps`, `MagicTabBarTheme`, `MagicTabBarVariant`, `MagicTabPressHandler`, `MagicLabelMode`, `MagicLabelPosition`, `MagicSpringConfig`, plus the `defaultTheme` value.

From `react-native-magic-tab-bar/react-navigation`: `MagicTabBarNavigation`, `MagicTabBarNavigationProps`, `MagicNavigationTab`.

> `defaultTabs` is exported from the `react-native-magic-tab-bar/default-tabs` subpath (not the main entry), so the core adds **zero runtime dependencies**.

## Development

This repo is a monorepo: the library lives at the root (`src/`), with two runnable example apps that import the library straight from source:

- [`example`](example) — Expo Router app (`MagicTabs`).
- [`example-cli`](example-cli) — bare React Native CLI app (`MagicTabBarNavigation`).

```bash
# Expo Router example
npm install            # from the repo root: installs example deps + build tooling
cd example && npx expo start

# React Native CLI example
cd example-cli && npm install
npm run ios            # or: npm run android
```

Editing files in `src/` hot-reloads in whichever example is running.

### Building / publishing

> Publishing is restricted to package maintainers.

```bash
npm run build     # react-native-builder-bob -> lib/ (ESM + d.ts)
npm publish
```

## Roadmap

- Sliding active-pill that animates between tabs (currently per-tab pill).
- ✅ ~~A React Navigation (`@react-navigation/bottom-tabs`) adapter for bare RN.~~ Shipped — see [React Navigation](#react-navigation-bare-react-native).

## License

MIT
