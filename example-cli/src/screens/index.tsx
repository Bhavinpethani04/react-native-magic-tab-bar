import { DemoScreen } from '../components/DemoScreen';

// Mirrors the Expo example's "expense app" so the two demos line up 1:1.

export function HomeScreen() {
  return (
    <DemoScreen
      title="Home"
      accent="#2563EB"
      subtitle="A floating, animated tab bar for bare React Native — powered by React Navigation and react-native-magic-tab-bar."
    />
  );
}

export function ExpensesScreen() {
  return (
    <DemoScreen
      title="Expenses"
      accent="#7C3AED"
      subtitle="This tab is marked `isLight`, so the whole bar morphs to the compact layout while it's active — great for a scroll-heavy list."
    />
  );
}

export function AlertsScreen() {
  return (
    <DemoScreen
      title="Alerts"
      accent="#F04438"
      subtitle="This tab shows a badge. Badges accept a dot (true), a count, or any short string."
    />
  );
}

export function BudgetsScreen() {
  return (
    <DemoScreen
      title="Budgets"
      accent="#059669"
      subtitle="The active tab expands to reveal its label with a spring animation. Try tapping around."
    />
  );
}

export function AccountScreen() {
  return (
    <DemoScreen
      title="Account"
      accent="#D97706"
      subtitle="Everything is themeable — colors, radius, height, spring feel — via the `theme` prop."
    />
  );
}
