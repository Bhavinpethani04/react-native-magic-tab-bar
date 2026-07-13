# react-native-magic-tab-bar — bare React Native (CLI) example

A minimal **React Native CLI** app (no Expo) showing the tab bar wired to
[`@react-navigation/bottom-tabs`](https://reactnavigation.org/docs/bottom-tab-navigator)
via the `react-native-magic-tab-bar/react-navigation` entry point.

> Using Expo Router instead? See the [`../example`](../example) app.

## What it demonstrates

- The `MagicTabBarNavigation` binding passed to `Tab.Navigator`'s `tabBar` prop
- A **badge** and a per-route **light (compact) mode** (the Search tab)
- Theming, labels, and the spring focus animation
- Icons via [`react-native-vector-icons`](https://github.com/oblador/react-native-vector-icons)
  (Ionicons) — the exact same `<Ionicons name … color size />` JSX you'd write
  with `@expo/vector-icons` in the Expo example, so tab usage is identical
  across both

## Project layout

```
example-cli/
  App.tsx                     NavigationContainer + SafeAreaProvider
  src/
    navigation/RootTabs.tsx   Tab.Navigator + MagicTabBarNavigation (the wiring)
    screens/index.tsx         Demo screens, one per tab
    icons/TabIcon.tsx         Dependency-free icons
    components/DemoScreen.tsx  Reusable placeholder screen
```

## Run it

This example loads the library **from source** (`../src`) through Metro, so
there's no build step while you hack on it.

```sh
# 1. Install JS deps (from this folder)
npm install

# 2. iOS: install pods (first run only)
cd ios && bundle install && bundle exec pod install && cd ..

# 3a. Start on iOS
npm run ios

# 3b. …or Android (have an emulator/device running)
npm run android
```

If Metro was already running, restart it with a clean cache after changing
native deps: `npm start -- --reset-cache`.

> **Icon fonts** (`react-native-vector-icons`) are wired up the CocoaPods way,
> which needs **no `react-native-asset`**:
> - **iOS** — the `RNVectorIcons` pod bundles the font files automatically; the
>   only manual step is the `UIAppFonts` entry in
>   [`ios/MagicTabCli/Info.plist`](ios/MagicTabCli/Info.plist).
> - **Android** — [`android/app/build.gradle`](android/app/build.gradle) applies
>   the package's `fonts.gradle`, which copies the fonts at build time.
>
> ⚠️ Do **not** run `npx react-native-asset` here — on CocoaPods it adds a second
> copy of every font and Xcode fails with *"Multiple commands produce
> …Ionicons.ttf"*.

## The important part

All the wiring lives in [`src/navigation/RootTabs.tsx`](src/navigation/RootTabs.tsx):

```tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MagicTabBarNavigation } from 'react-native-magic-tab-bar/react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const tabs = [
  { name: 'Home',   label: 'Home',   icon: ({ color, size }) => <Ionicons name="home"   color={color} size={size} /> },
  { name: 'Search', label: 'Search', icon: ({ color, size }) => <Ionicons name="search" color={color} size={size} /> },
  // …no `href` — React Navigation routes by `name`.
];

<Tab.Navigator
  screenOptions={{ headerShown: false }}
  tabBar={(props) => <MagicTabBarNavigation {...props} tabs={tabs} />}
>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Search" component={SearchScreen} />
</Tab.Navigator>
```
