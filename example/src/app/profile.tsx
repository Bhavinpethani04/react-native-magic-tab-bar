import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusedStatusBar } from "@/components/useFocusedStatusBar";
import { tokens as t } from "@/components/tokens";

const STATS = [
  { label: "This month", value: "$1,729" },
  { label: "Saved", value: "$500" },
  { label: "Transactions", value: "42" },
];

type Item = { icon: keyof typeof Ionicons.glyphMap; label: string; value?: string; danger?: boolean };

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Money",
    items: [
      { icon: "card-outline", label: "Cards & accounts", value: "3" },
      { icon: "pricetags-outline", label: "Categories" },
      { icon: "download-outline", label: "Export statements" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: "notifications-outline", label: "Notifications" },
      { icon: "cash-outline", label: "Currency", value: "USD $" },
      { icon: "color-palette-outline", label: "Appearance", value: "System" },
    ],
  },
  {
    title: "Security",
    items: [
      { icon: "finger-print-outline", label: "Face ID & PIN" },
      { icon: "help-circle-outline", label: "Help & support" },
      { icon: "log-out-outline", label: "Sign out", danger: true },
    ],
  },
];

export default function Account() {
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
      <View style={styles.header}>
        <Text style={styles.h1}>Account</Text>
        <Ionicons name="settings-outline" size={22} color={t.ink} />
      </View>

      {/* Identity */}
      <View style={styles.identity}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>BP</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>Bhavin Pethani</Text>
          <Text style={styles.email}>pethanibhavin004@gmail.com</Text>
          <View style={styles.proBadge}>
            <Ionicons name="shield-checkmark" size={11} color={t.accent} />
            <Text style={styles.proText}>Premium</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {STATS.map((s, i) => (
          <View key={s.label} style={[styles.stat, i < STATS.length - 1 && styles.statBorder]}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {GROUPS.map((group) => (
        <View key={group.title}>
          <Text style={styles.sectionTitle}>{group.title}</Text>
          <View style={styles.card}>
            {group.items.map((item, i) => (
              <View
                key={item.label}
                style={[styles.row, i !== group.items.length - 1 && styles.rowDivider]}
              >
                <View style={[styles.rowIcon, item.danger && styles.rowIconDanger]}>
                  <Ionicons name={item.icon} size={18} color={item.danger ? t.red : t.sub} />
                </View>
                <Text style={[styles.rowLabel, item.danger && { color: t.red }]}>{item.label}</Text>
                {item.value ? <Text style={styles.rowValue}>{item.value}</Text> : null}
                {!item.danger ? (
                  <Ionicons name="chevron-forward" size={17} color={t.muted} />
                ) : null}
              </View>
            ))}
          </View>
        </View>
      ))}

      <Text style={styles.version}>MagicTabBar demo · v2.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.bg },
  content: { paddingHorizontal: 18 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  h1: { fontSize: 26, fontWeight: "800", color: t.ink, letterSpacing: -0.5 },

  identity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: t.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 22 },
  name: { fontSize: 18, fontWeight: "800", color: t.ink, letterSpacing: -0.3 },
  email: { fontSize: 13, color: t.muted, marginTop: 2 },
  proBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    backgroundColor: t.accentSoft,
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  proText: { color: t.accent, fontSize: 12, fontWeight: "700" },

  statsRow: {
    flexDirection: "row",
    backgroundColor: t.card,
    borderWidth: 1,
    borderColor: t.border,
    borderRadius: 16,
    marginTop: 12,
    paddingVertical: 16,
  },
  stat: { flex: 1, alignItems: "center" },
  statBorder: { borderRightWidth: 1, borderRightColor: t.border },
  statValue: { fontSize: 19, fontWeight: "800", color: t.ink, letterSpacing: -0.5 },
  statLabel: { fontSize: 12, color: t.muted, marginTop: 3 },

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
    paddingHorizontal: 14,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 13, paddingVertical: 13 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: t.border },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: t.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  rowIconDanger: { backgroundColor: `${t.red}14` },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: t.ink },
  rowValue: { fontSize: 14, color: t.muted, marginRight: 2 },

  version: { textAlign: "center", color: t.muted, fontSize: 12, marginTop: 28 },
});
