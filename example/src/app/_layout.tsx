import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState, type ComponentProps } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import {
  MagicTabs,
  type MagicTabConfig,
  type MagicTabIconProps,
} from "react-native-magic-tab-bar";
import { BarControlsProvider, MAX_TABS } from "@/components/barControls";

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
// `testID` makes each tab addressable from the Maestro suite in `.maestro/`
// without relying on the visible label (e.g. "Expenses" also appears in the
// Home screen's balance card).
const tabs: MagicTabConfig[] = [
  { name: "index", href: "/", label: "Home", testID: "tab-home", icon: ionicon("wallet", "wallet-outline") },
  { name: "explore", href: "/explore", label: "Expenses", testID: "tab-expenses", isLight: true, icon: ionicon("receipt", "receipt-outline") },
  { name: "notifications", href: "/notifications", label: "Alerts", testID: "tab-alerts", badge: 3, icon: ionicon("notifications", "notifications-outline") },
  { name: "inbox", href: "/inbox", label: "Budgets", testID: "tab-budgets", icon: ionicon("pie-chart", "pie-chart-outline") },
  { name: "profile", href: "/profile", label: "Account", testID: "tab-account", icon: ionicon("person-circle", "person-circle-outline") },
];

/** The tab promoted to an `action` (FAB) button by the demo toggle. */
const ACTION_TAB_NAME = "notifications";

export default function RootLayout() {
  // How many of `tabs` the bar renders. The switcher on the Home screen drives
  // this, so the content-sized bar can be seen (and e2e-tested) at every count.
  const [count, setCount] = useState(MAX_TABS);
  // `fullWidth` is the opt-out back to an edge-to-edge bar.
  const [fullWidth, setFullWidth] = useState(false);
  // `docked` and `actionTab` exercise the two layout paths the floating,
  // no-FAB default never reaches: the in-flow bar (which must still clear the
  // home indicator) and the raised circular button (which must stay tappable).
  const [docked, setDocked] = useState(false);
  const [actionTab, setActionTab] = useState(false);
  // A stand-in for a blur view: any custom background makes the bar drop its own
  // fill *and* its drop shadow.
  const [customBg, setCustomBg] = useState(false);
  const controls = useMemo(
    () => ({
      count, setCount,
      fullWidth, setFullWidth,
      docked, setDocked,
      actionTab, setActionTab,
      customBg, setCustomBg,
    }),
    [count, fullWidth, docked, actionTab, customBg],
  );
  const visibleTabs = useMemo(() => {
    const shown = tabs.slice(0, count);
    if (!actionTab) return shown;
    // Promote the middle tab to a raised action button.
    return shown.map((tab) =>
      tab.name === ACTION_TAB_NAME ? { ...tab, variant: "action" as const } : tab,
    );
  }, [count, actionTab]);

  return (
    <BarControlsProvider value={controls}>
      {/* Android translucency so content sits under the status bar. The text
          style (dark/light) is owned per-screen via `useFocusedStatusBar`. */}
      <StatusBar backgroundColor="transparent" translucent />
      <MagicTabs
        tabs={visibleTabs}
        fullWidth={fullWidth}
        variant={docked ? "docked" : "floating"}
        renderBackground={
          customBg ? () => <View style={styles.customBackground} /> : undefined
        }
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
    </BarControlsProvider>
  );
}

const styles = StyleSheet.create({
  /** Stands in for a blur view in the `renderBackground` demo. */
  customBackground: { flex: 1, backgroundColor: "rgba(37, 99, 235, 0.55)" },
});
