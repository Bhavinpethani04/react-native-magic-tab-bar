import { MagicTabs } from "react-native-magic-tab-bar";

// No `tabs` prop -> MagicTabs falls back to its default set:
// Home, Explore, Notifications and Profile, with matching Ionicons.
export default function RootLayout() {
  // `glass` -> native Liquid Glass on iOS 26+; falls back to the translucent
  // `barColor` (at `transparency`) on Android and older iOS.
  return <MagicTabs glass isTransparent={false} transparency={0.1} />;
}
