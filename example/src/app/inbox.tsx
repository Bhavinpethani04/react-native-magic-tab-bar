import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusedStatusBar } from "@/components/useFocusedStatusBar";
import { tokens as t, money } from "@/components/tokens";
import { CATEGORY, type CategoryKey } from "@/components/expenses";

type Budget = { key: CategoryKey; spent: number; limit: number };

const BUDGETS: Budget[] = [
  { key: "food", spent: 420, limit: 450 },
  { key: "groceries", spent: 260, limit: 400 },
  { key: "transport", spent: 120, limit: 200 },
  { key: "shopping", spent: 340, limit: 300 },
  { key: "fun", spent: 90, limit: 150 },
  { key: "bills", spent: 210, limit: 250 },
];

export default function Budgets() {
  const insets = useSafeAreaInsets();
  useFocusedStatusBar("dark-content");

  const totalSpent = BUDGETS.reduce((s, b) => s + b.spent, 0);
  const totalLimit = BUDGETS.reduce((s, b) => s + b.limit, 0);
  const pct = Math.round((totalSpent / totalLimit) * 100);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 130 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.h1}>Budgets</Text>
        <View style={styles.addBtn}>
          <Ionicons name="add" size={22} color="#fff" />
        </View>
      </View>

      {/* Summary — clean white card */}
      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Spent this month</Text>
          <Text style={styles.summaryPct}>{pct}%</Text>
        </View>
        <Text style={styles.summaryValue}>
          {money(totalSpent)}
          <Text style={styles.summaryOf}>  of {money(totalLimit)}</Text>
        </Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct}%`, backgroundColor: t.accent }]} />
        </View>
        <Text style={styles.left}>{money(totalLimit - totalSpent)} left to spend</Text>
      </View>

      <Text style={styles.sectionTitle}>By category</Text>
      <View style={styles.card}>
        {BUDGETS.map((b, i) => {
          const cat = CATEGORY[b.key];
          const ratio = Math.min(b.spent / b.limit, 1);
          const over = b.spent > b.limit;
          return (
            <View key={b.key} style={[styles.item, i !== BUDGETS.length - 1 && styles.itemDivider]}>
              <View style={[styles.icon, { backgroundColor: `${cat.color}1A` }]}>
                <Ionicons name={cat.icon} size={18} color={cat.color} />
              </View>
              <View style={styles.body}>
                <View style={styles.bodyTop}>
                  <Text style={styles.label}>{cat.label}</Text>
                  <Text style={styles.amount}>
                    {money(b.spent)} <Text style={styles.limit}>/ {money(b.limit)}</Text>
                  </Text>
                </View>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      { width: `${ratio * 100}%`, backgroundColor: over ? t.red : cat.color },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.bg },
  content: { paddingHorizontal: 18 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  h1: { fontSize: 26, fontWeight: "800", color: t.ink, letterSpacing: -0.5 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: t.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  summary: {
    backgroundColor: t.card,
    borderRadius: 20,
    padding: 20,
    marginTop: 18,
    shadowColor: "#0B1220",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  summaryLabel: { color: t.muted, fontSize: 14, fontWeight: "600" },
  summaryPct: { color: t.accent, fontSize: 14, fontWeight: "800" },
  summaryValue: { color: t.ink, fontSize: 28, fontWeight: "800", marginTop: 6, letterSpacing: -0.6 },
  summaryOf: { color: t.muted, fontSize: 15, fontWeight: "600" },
  left: { color: t.muted, fontSize: 13, fontWeight: "600", marginTop: 12 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: t.muted,
    marginTop: 24,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: t.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: t.border,
    paddingHorizontal: 16,
  },
  item: { flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 15 },
  itemDivider: { borderBottomWidth: 1, borderBottomColor: t.border },
  icon: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  body: { flex: 1 },
  bodyTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 15, fontWeight: "700", color: t.ink },
  amount: { fontSize: 13, fontWeight: "700", color: t.ink },
  limit: { color: t.muted, fontWeight: "600" },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EFF0F3",
    marginTop: 12,
    overflow: "hidden",
  },
  fill: { height: 6, borderRadius: 3 },
});
