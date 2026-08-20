/**
 * The visible controls for the tab bar's shape. Rendered on the Home screen so
 * they are always reachable: Home is the first tab, so it survives every count.
 */
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { tokens as t } from "./tokens";
import { TAB_COUNTS, tabCountTestId, useBarControls } from "./barControls";

/** One labelled switch row in the control card. */
function ToggleRow({
  testID,
  title,
  hint,
  value,
  onValueChange,
}: {
  testID: string;
  title: string;
  hint: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.hint}>{hint}</Text>
      </View>
      <Switch
        testID={testID}
        accessibilityLabel={title}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: t.accent }}
      />
    </View>
  );
}

export function TabCountControl() {
  const {
    count,
    setCount,
    fullWidth,
    setFullWidth,
    docked,
    setDocked,
    actionTab,
    setActionTab,
    customBg,
    setCustomBg,
  } = useBarControls();

  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.title}>Tabs in the bar</Text>
        {/* The Maestro suite reads this to confirm the count actually applied. */}
        <Text testID="tabcount-current" style={styles.value}>
          {count}
        </Text>
      </View>
      <Text style={styles.hint}>
        The bar is sized by its tabs — change the count and watch it resize.
      </Text>
      <View style={styles.row}>
        {TAB_COUNTS.map((n) => {
          const active = n === count;
          return (
            <Pressable
              key={n}
              testID={tabCountTestId(n)}
              accessibilityRole="button"
              accessibilityLabel={`Show ${n} tabs`}
              accessibilityState={{ selected: active }}
              onPress={() => setCount(n)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {n}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ToggleRow
        testID="fullwidth-toggle"
        title="Full width"
        hint="Opt out of content sizing — stretch the bar edge to edge."
        value={fullWidth}
        onValueChange={setFullWidth}
      />
      <ToggleRow
        testID="docked-toggle"
        title="Docked"
        hint="Sit in-flow at the bottom instead of floating over content."
        value={docked}
        onValueChange={setDocked}
      />
      <ToggleRow
        testID="custombg-toggle"
        title="Custom background"
        hint="Supply renderBackground — the bar drops its own fill and shadow."
        value={customBg}
        onValueChange={setCustomBg}
      />
      <ToggleRow
        testID="action-toggle"
        title="Action (FAB) tab"
        hint="Render the middle tab as a raised circular button."
        value={actionTab}
        onValueChange={setActionTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: t.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: t.border,
    padding: 18,
    marginTop: 20,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: 15, fontWeight: "700", color: t.ink },
  value: { fontSize: 15, fontWeight: "800", color: t.accent },
  hint: { fontSize: 13, color: t.muted, marginTop: 4, fontWeight: "600" },
  row: { flexDirection: "row", gap: 8, marginTop: 14 },
  chip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: t.accentSoft,
  },
  chipActive: { backgroundColor: t.accent },
  chipText: { fontSize: 15, fontWeight: "800", color: t.accent },
  chipTextActive: { color: "#FFFFFF" },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: t.border,
  },
  toggleText: { flex: 1 },
});
