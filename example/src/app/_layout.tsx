import { MagicTabs } from "react-native-magic-tab-bar";

// No `tabs` prop -> MagicTabs falls back to its default set:
// Home, Explore, Notifications and Profile, with matching Ionicons.
export default function RootLayout() {
  return <MagicTabs />;
}
