import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusedStatusBar } from "@/components/useFocusedStatusBar";
import { tokens as t, money } from "@/components/tokens";
import { CATEGORY, GROUPS, type Txn } from "@/components/expenses";

function ExpenseCard({ txn }: { txn: Txn }) {
  const cat = CATEGORY[txn.category];
  const income = txn.amount > 0;
  return (
    <View style={styles.card}>
      {/* Colored category icon */}
      <View style={[styles.iconWrap, { backgroundColor: `${cat.color}1A` }]}>
        <Ionicons name={cat.icon} size={22} color={cat.color} />
      </View>

      {/* Details */}
      <View style={styles.mid}>
        <Text style={styles.title} numberOfLines={1}>
          {txn.title}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.tag, { backgroundColor: `${cat.color}14` }]}>
            <Text style={[styles.tagText, { color: cat.color }]}>{cat.label}</Text>
          </View>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.account}>{txn.account}</Text>
        </View>
      </View>

      {/* Amount */}
      <View style={styles.right}>
        <Text style={[styles.amount, { color: income ? t.green : t.ink }]}>
          {income ? "+" : ""}
          {money(txn.amount)}
        </Text>
        <Text style={styles.time}>{txn.time}</Text>
      </View>
    </View>
  );
}

export default function Expenses() {
  const insets = useSafeAreaInsets();
  useFocusedStatusBar("dark-content");

  const spent = GROUPS.flatMap((g) => g.items)
    .filter((x) => x.amount < 0)
    .reduce((s, x) => s + x.amount, 0);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 130 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title0}>Expenses</Text>
          <Text style={styles.subtitle}>July 2026</Text>
        </View>
        <View style={styles.filterBtn}>
          <Ionicons name="options-outline" size={20} color={t.ink} />
        </View>
      </View>

      {/* Summary chip */}
      <View style={styles.summary}>
        <View>
          <Text style={styles.summaryLabel}>Spent this month</Text>
          <Text style={styles.summaryValue}>{money(spent)}</Text>
        </View>
        <View style={styles.summaryPill}>
          <Ionicons name="trending-down" size={15} color={t.green} />
          <Text style={styles.summaryPillText}>12% less</Text>
        </View>
      </View>

      {/* Grouped transactions */}
      {GROUPS.map((group) => {
        const dayTotal = group.items.reduce((s, x) => s + x.amount, 0);
        return (
          <View key={group.date}>
            <View style={styles.groupHead}>
              <Text style={styles.groupDate}>{group.date}</Text>
              <Text style={styles.groupTotal}>{money(dayTotal)}</Text>
            </View>
            {group.items.map((txn) => (
              <ExpenseCard key={txn.id} txn={txn} />
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.bg },
  content: { paddingHorizontal: 18 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title0: { fontSize: 26, fontWeight: "800", color: t.ink, letterSpacing: -0.5 },
  subtitle: { fontSize: 13, fontWeight: "600", color: t.muted, marginTop: 2 },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    alignItems: "center",
    justifyContent: "center",
  },

  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: t.ink,
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
  },
  summaryLabel: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600" },
  summaryValue: { color: "#fff", fontSize: 26, fontWeight: "800", marginTop: 4, letterSpacing: -0.5 },
  summaryPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(22,179,100,0.16)",
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  summaryPillText: { color: t.green, fontSize: 13, fontWeight: "700" },

  groupHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  groupDate: { fontSize: 14, fontWeight: "800", color: t.ink },
  groupTotal: { fontSize: 13, fontWeight: "700", color: t.muted },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: t.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: t.border,
    padding: 14,
    marginBottom: 10,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  mid: { flex: 1, gap: 6 },
  title: { fontSize: 15, fontWeight: "700", color: t.ink },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  tag: { borderRadius: 6, paddingVertical: 2, paddingHorizontal: 7 },
  tagText: { fontSize: 11, fontWeight: "700" },
  dot: { color: t.muted, fontSize: 12 },
  account: { fontSize: 12, color: t.muted, fontWeight: "500" },
  right: { alignItems: "flex-end", gap: 4 },
  amount: { fontSize: 15, fontWeight: "800", letterSpacing: -0.3 },
  time: { fontSize: 11, color: t.muted },
});
