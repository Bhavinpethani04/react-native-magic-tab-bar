# react-native-magic-tab-bar

A customizable, animated floating tab bar for **Expo Router** (SDK 56+). You bring
your own icons and labels — the package handles the layout, the active-pill
animation, and the navigation wiring.

> Built on Expo Router's headless tabs (`expo-router/ui`). It works in any
> Expo Router project on iOS and Android. (Bare React Native / React Navigation
> is not supported yet — see [Roadmap](#roadmap).)

## Installation

```bash
npm install react-native-magic-tab-bar
```

### Peer dependencies

These are normally already present in an Expo Router app:

```bash
npx expo install expo-router react-native-reanimated react-native-safe-area-context react-native-worklets
```

Make sure the Reanimated/Worklets Babel plugin is enabled (Expo SDK 56's
`babel-preset-expo` configures this automatically).

## Usage

Use `MagicTabs` as your tab navigator in an `app/_layout.tsx`. Each entry in
`tabs` maps a route to an icon and label:

```tsx
// app/_layout.tsx
import { MagicTabs, type MagicTabIconProps } from "react-native-magic-tab-bar";
import { Home, Search, User } from "./icons"; // any icon components you like

export default function Layout() {
  return (
    <MagicTabs
      tabs={[
        { name: "index",   href: "/",        label: "Home",    icon: ({ color, size }) => <Home color={color} size={size} /> },
        { name: "search",  href: "/search",  label: "Search",  icon: ({ color, size }) => <Search color={color} size={size} /> },
        { name: "profile", href: "/profile", label: "Profile", icon: ({ color, size }) => <User color={color} size={size} /> },
      ]}
    />
  );
}
```

The `name` must match the route file in your `app/` directory (e.g. `index`,
`search`, `profile`), and `href` is where the tab navigates.

### The glass / blur look

Pass `renderBackground` to render any view behind the bar — e.g. a blur:

```tsx
import { GlassView } from "expo-glass-effect"; // or @react-native-community/blur on bare RN

<MagicTabs
  tabs={tabs}
  renderBackground={() => <GlassView style={{ flex: 1 }} />}
/>;
```

When `renderBackground` is omitted, a solid `barColor` is used.

## API

### `<MagicTabs />`

| Prop               | Type                              | Default      | Description                                       |
| ------------------ | --------------------------------- | ------------ | ------------------------------------------------- |
| `tabs`             | `MagicTabConfig[]`                | —            | The tabs, in order.                               |
| `theme`            | `Partial<MagicTabBarTheme>`       | `defaultTheme` | Override any visual token.                       |
| `variant`          | `'floating' \| 'docked'`          | `'floating'` | Float over content, or dock in flow.              |
| `renderBackground` | `() => ReactNode`                 | —            | Custom background (blur/glass) behind the bar.    |

### `MagicTabConfig`

| Field   | Type                                       | Description                                   |
| ------- | ------------------------------------------ | --------------------------------------------- |
| `name`  | `string`                                   | Route name (matches the file in `app/`).      |
| `href`  | `Href`                                     | Destination, e.g. `/` or `/search`.           |
| `label` | `string?`                                  | Shown next to the icon while active.          |
| `icon`  | `(p: MagicTabIconProps) => ReactNode`      | Renders the icon. Gets `{ focused, color, size }`. |

### Theming (`MagicTabBarTheme`)

`barColor`, `activePillColor`, `activeColor`, `inactiveColor`, `iconSize`,
`height`, `radius`, `horizontalMargin`, `bottomInset`. See `defaultTheme`.

## Development

This repo is a monorepo: the library lives at the root (`src/`) and `example/`
is a runnable Expo app that imports the library straight from source.

```bash
# from the repo root
npm install            # installs example deps + build tooling, links the library
cd example && npx expo start
```

Editing files in `src/` hot-reloads in the example app.

### Building / publishing

```bash
npm run build     # react-native-builder-bob -> lib/ (ESM + d.ts)
npm publish
```

## Roadmap

- Sliding active-pill that animates between tabs (currently per-tab pill).
- A React Navigation (`@react-navigation/bottom-tabs`) adapter for bare RN.

## License

MIT
