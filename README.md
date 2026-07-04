# react-native-magic-tab-bar

A customizable, animated **floating tab bar for [Expo Router](https://docs.expo.dev/router/introduction/)** (SDK 56+). You bring your own icons and labels — the package handles the layout, the active-pill animation, and the navigation wiring.

> Built on Expo Router's headless tabs (`expo-router/ui`). Works in any Expo Router project on **iOS and Android**. (Bare React Native / React Navigation is not supported yet — see [Roadmap](#roadmap).)

## Features

- 🎯 **Drop-in** — replaces your Expo Router tabs layout; bring your own icons.
- ✨ **Animated active pill** with a spring you can tune.
- 🏷️ **Flexible labels** — beside or below the icon; show on the active tab, always, or never.
- 🔴 **Badges** — dots or counts on any tab.
- 🧊 **Glass / blur / transparent** backgrounds (native iOS Liquid Glass supported).
- 📳 **Haptics** and **press callbacks** (great for "scroll to top" on re-press).
- ➕ **Action (FAB) tab** for a raised center button.
- 🪶 **Light mode** — a compact, icon-only bar you can switch on **per tab** (e.g. only on an immersive full-screen feed), with a smooth transition.
- 🎨 **Fully themeable** via a single `theme` prop.

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
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
  <img src="https://raw.githubusercontent.com/Bhavinpethani04/react-native-magic-tab-bar/main/assets/gifs/ios.gif" alt="MagicTabs on iOS" width="280" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://raw.githubusercontent.com/Bhavinpethani04/react-native-magic-tab-bar/main/assets/gifs/android.gif" alt="MagicTabs on Android" width="280" />
</p>

<p align="center"><sub>iOS (left) &middot; Android (right)</sub></p>

## Installation

> **Requirements:** an [Expo Router](https://docs.expo.dev/router/introduction/) project (Expo SDK 56+) with an `app/` directory. Works on iOS & Android.

```bash
npm install react-native-magic-tab-bar
```

### Peer dependencies

These are normally already present in an Expo Router app:

```bash
npx expo install expo-router react-native-reanimated react-native-safe-area-context react-native-worklets
```

Make sure the Reanimated/Worklets Babel plugin is enabled (Expo SDK 56's `babel-preset-expo` configures this automatically).

### Optional dependencies

Install these only if you use the matching feature — the library works without them:

```bash
npx expo install expo-glass-effect   # native iOS Liquid Glass (glass prop)
npx expo install expo-haptics        # selection haptics (haptics prop)
npx expo install @expo/vector-icons  # only for the /default-tabs demo set
```

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

## Recipes

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
| `name` | `string` | Route name (matches the file in `app/`). |
| `href` | `Href` | Destination, e.g. `/` or `/search`. |
| `icon` | `(p: MagicTabIconProps) => ReactNode` | Renders the icon. Gets `{ focused, color, size }`. |
| `label` | `string?` | Text label. |
| `showLabel` | `boolean?` | Per-tab override of `showLabels`. |
| `badge` | `number \| string \| boolean?` | Dot (`true`) or count bubble. |
| `disabled` | `boolean?` | Dim the tab and block navigation. |
| `variant` | `'action'?` | Render as a raised FAB button. |
| `isLight` | `boolean?` | Switch the whole bar to light mode while this tab is active. |

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

`MagicTabConfig`, `MagicTabIconProps`, `MagicTabBarTheme`, `MagicTabBarVariant`, `MagicTabPressHandler`, `MagicLabelMode`, `MagicLabelPosition`, `MagicSpringConfig`, plus the `defaultTheme` value.

> `defaultTabs` is exported from the `react-native-magic-tab-bar/default-tabs` subpath (not the main entry), so the core adds **zero runtime dependencies**.

## Development

This repo is a monorepo: the library lives at the root (`src/`) and `example/` is a runnable Expo app that imports the library straight from source.

```bash
# from the repo root
npm install            # installs example deps + build tooling, links the library
cd example && npx expo start
```

Editing files in `src/` hot-reloads in the example app.

### Building / publishing

> Publishing is restricted to package maintainers.

```bash
npm run build     # react-native-builder-bob -> lib/ (ESM + d.ts)
npm publish
```

## Roadmap

- Sliding active-pill that animates between tabs (currently per-tab pill).
- A React Navigation (`@react-navigation/bottom-tabs`) adapter for bare RN.

## License

MIT
