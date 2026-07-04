import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusedStatusBar } from "@/components/useFocusedStatusBar";
import { tokens as t, money } from "@/components/tokens";
import { CATEGORY, RECENT } from "@/components/expenses";

export default function Home() {
  const insets = useSafeAreaInsets();
  useFocusedStatusBar("dark-content");

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
          <Text style={styles.hello}>Welcome back</Text>
          <Text style={styles.name}>Bhavin Pethani</Text>
        </View>
        <View style={styles.bell}>
          <Ionicons name="notifications-outline" size={20} color={t.ink} />
          <View style={styles.bellDot} />
        </View>
      </View>

      {/* Balance hero card */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>Total balance</Text>
          <View style={styles.trend}>
            <Ionicons name="trending-up" size={13} color={t.accent} />
            <Text style={styles.trendText}>2.4%</Text>
          </View>
        </View>
        <Text style={styles.heroValue}>{money(12480.55)}</Text>

        <View style={styles.heroRow}>
          <View style={styles.heroStat}>
            <View style={[styles.heroIcon, { backgroundColor: `${t.green}1A` }]}>
              <Ionicons name="arrow-down" size={15} color={t.green} />
            </View>
            <View>
              <Text style={styles.heroStatLabel}>Income</Text>
              <Text style={styles.heroStatValue}>{money(3200)}</Text>
            </View>
          </View>
          <View style={styles.heroDivider} />
          <View style={styles.heroStat}>
            <View style={[styles.heroIcon, { backgroundColor: `${t.red}1A` }]}>
              <Ionicons name="arrow-up" size={15} color={t.red} />
            </View>
            <View>
              <Text style={styles.heroStatLabel}>Expenses</Text>
              <Text style={styles.heroStatValue}>{money(1729)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Budget */}
      <View style={styles.budgetCard}>
        <View style={styles.budgetTop}>
          <Text style={styles.budgetTitle}>Monthly budget</Text>
          <Text style={styles.budgetSub}>
            {money(1729)} <Text style={styles.budgetMuted}>of {money(3000)}</Text>
          </Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: "58%" }]} />
        </View>
        <Text style={styles.budgetLeft}>{money(1271)} left to spend</Text>
      </View>

      {/* Recent transactions */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Recent transactions</Text>
        <Text style={styles.sectionAction}>See all</Text>
      </View>
      <View style={styles.list}>
        {RECENT.slice(0, 4).map((txn, i) => {
          const cat = CATEGORY[txn.category];
          const income = txn.amount > 0;
          return (
            <View key={txn.id} style={[styles.row, i !== 3 && styles.rowDivider]}>
              <View style={[styles.rowIcon, { backgroundColor: `${cat.color}1A` }]}>
                <Ionicons name={cat.icon} size={19} color={cat.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{txn.title}</Text>
                <Text style={styles.rowSub}>{cat.label}</Text>
              </View>
              <Text style={[styles.rowAmount, { color: income ? t.green : t.ink }]}>
                {income ? "+" : ""}
                {money(txn.amount)}
              </Text>
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
  hello: { fontSize: 13, fontWeight: "600", color: t.muted },
  name: { fontSize: 22, fontWeight: "800", color: t.ink, marginTop: 2, letterSpacing: -0.4 },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    alignItems: "center",
    justifyContent: "center",
  },
  bellDot: {
    position: "absolute",
    top: 11,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: t.red,
    borderWidth: 1.5,
    borderColor: t.card,
  },

  hero: {
    backgroundColor: t.card,
    borderRadius: 22,
    padding: 22,
    marginTop: 20,
    shadowColor: "#0B1220",
    shadowOpacity: 0.07,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroLabel: { color: t.muted, fontSize: 14, fontWeight: "600" },
  trend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: t.accentSoft,
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  trendText: { color: t.accent, fontSize: 12, fontWeight: "700" },
  heroValue: { color: t.ink, fontSize: 36, fontWeight: "800", marginTop: 8, letterSpacing: -1 },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: t.border,
  },
  heroStat: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  heroIcon: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
  heroStatLabel: { color: t.muted, fontSize: 12, fontWeight: "600" },
  heroStatValue: { color: t.ink, fontSize: 16, fontWeight: "800", marginTop: 1 },
  heroDivider: { width: 1, height: 34, backgroundColor: t.border, marginHorizontal: 8 },

  budgetCard: {
    backgroundColor: t.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: t.border,
    padding: 18,
    marginTop: 14,
  },
  budgetTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  budgetTitle: { fontSize: 15, fontWeight: "700", color: t.ink },
  budgetSub: { fontSize: 14, fontWeight: "800", color: t.ink },
  budgetMuted: { color: t.muted, fontWeight: "600" },
  track: { height: 9, borderRadius: 5, backgroundColor: t.accentSoft, marginTop: 14, overflow: "hidden" },
  fill: { height: 9, borderRadius: 5, backgroundColor: t.accent },
  budgetLeft: { fontSize: 13, color: t.muted, marginTop: 10, fontWeight: "600" },

  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: t.ink, letterSpacing: -0.3 },
  sectionAction: { fontSize: 13, fontWeight: "600", color: t.accent },

  list: {
    backgroundColor: t.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: t.border,
    paddingHorizontal: 16,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 13 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: t.border },
  rowIcon: { width: 42, height: 42, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  rowTitle: { fontSize: 15, fontWeight: "700", color: t.ink },
  rowSub: { fontSize: 13, color: t.muted, marginTop: 2 },
  rowAmount: { fontSize: 15, fontWeight: "800", letterSpacing: -0.3 },
});
