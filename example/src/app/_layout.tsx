import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { StatusBar } from "react-native";
import {
  MagicTabs,
  type MagicTabConfig,
  type MagicTabIconProps,
} from "react-native-magic-tab-bar";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/** Filled glyph when active, outline when inactive. */
const ionicon =
  (active: IoniconName, inactive: IoniconName) =>
  ({ focused, color, size }: MagicTabIconProps) => (
    <Ionicons name={focused ? active : inactive} color={color} size={size} />
  );

// An expense app: Home overview, an Expenses list (marked `isLight`, so the
// bar morphs to the compact layout for a roomier list), Alerts, Budgets and
// Account.
const tabs: MagicTabConfig[] = [
  { name: "index", href: "/", label: "Home", icon: ionicon("wallet", "wallet-outline") },
  { name: "explore", href: "/explore", label: "Expenses", isLight: true, icon: ionicon("receipt", "receipt-outline") },
  { name: "notifications", href: "/notifications", label: "Alerts", badge: 3, icon: ionicon("notifications", "notifications-outline") },
  { name: "inbox", href: "/inbox", label: "Budgets", icon: ionicon("pie-chart", "pie-chart-outline") },
  { name: "profile", href: "/profile", label: "Account", icon: ionicon("person-circle", "person-circle-outline") },
];

export default function RootLayout() {
  return (
    <>
      {/* Android translucency so content sits under the status bar. The text
          style (dark/light) is owned per-screen via `useFocusedStatusBar`. */}
      <StatusBar backgroundColor="transparent" translucent />
      <MagicTabs
        tabs={tabs}
        glass
        labelPosition="right"
        lightBottomMargin={30}
        theme={{
          barColor: "#17171C",
          activePillColor: "#2563EB",
          activeColor: "#FFFFFF",
          inactiveColor: "#9BA0AA",
          badgeColor: "#F04438",
        }}
      />
    </>
  );
}
