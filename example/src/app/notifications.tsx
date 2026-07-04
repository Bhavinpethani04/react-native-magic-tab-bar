import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusedStatusBar } from "@/components/useFocusedStatusBar";
import { tokens as t } from "@/components/tokens";

type Alert = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  title: string;
  body: string;
  time: string;
  unread?: boolean;
};

const NEW: Alert[] = [
  { id: "1", icon: "warning", color: t.red, title: "Budget almost reached", body: "You've used 92% of your Food & Dining budget.", time: "10m", unread: true },
  { id: "2", icon: "arrow-down-circle", color: t.green, title: "Salary received", body: "$3,200.00 from Acme Inc. was added to Chase Checking.", time: "1h", unread: true },
  { id: "3", icon: "card", color: t.accent, title: "Bill due soon", body: "Electricity bill of $74.20 is due in 2 days.", time: "3h", unread: true },
];

const EARLIER: Alert[] = [
  { id: "4", icon: "repeat", color: "#A855F7", title: "Subscription renewed", body: "Netflix charged $15.99 to Visa •• 4291.", time: "1d" },
  { id: "5", icon: "trending-up", color: "#F59E0B", title: "Unusual spending", body: "Shopping is 40% higher than your monthly average.", time: "2d" },
  { id: "6", icon: "trophy", color: t.green, title: "Goal reached 🎉", body: "You saved $500 toward your Travel goal.", time: "3d" },
];

function Row({ item, last }: { item: Alert; last: boolean }) {
  return (
    <View style={[styles.row, !last && styles.rowDivider]}>
      <View style={[styles.icon, { backgroundColor: `${item.color}18` }]}>
        <Ionicons name={item.icon} size={20} color={item.color} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.title}</Text>
          {item.unread ? <View style={styles.unread} /> : null}
        </View>
        <Text style={styles.body}>{item.body}</Text>
        <Text style={styles.time}>{item.time} ago</Text>
      </View>
    </View>
  );
}

export default function Alerts() {
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
        <Text style={styles.h1}>Alerts</Text>
        <View style={styles.markRead}>
          <Ionicons name="checkmark-done" size={16} color={t.accent} />
          <Text style={styles.markReadText}>Mark all read</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>New</Text>
      <View style={styles.card}>
        {NEW.map((a, i) => (
          <Row key={a.id} item={a} last={i === NEW.length - 1} />
        ))}
      </View>

      <Text style={styles.sectionTitle}>Earlier</Text>
      <View style={styles.card}>
        {EARLIER.map((a, i) => (
          <Row key={a.id} item={a} last={i === EARLIER.length - 1} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: t.bg },
  content: { paddingHorizontal: 18 },

  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  h1: { fontSize: 26, fontWeight: "800", color: t.ink, letterSpacing: -0.5 },
  markRead: { flexDirection: "row", alignItems: "center", gap: 5 },
  markReadText: { fontSize: 13, fontWeight: "600", color: t.accent },

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
  row: { flexDirection: "row", gap: 13, paddingVertical: 15 },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: t.border },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 15, fontWeight: "700", color: t.ink, flex: 1 },
  unread: { width: 8, height: 8, borderRadius: 4, backgroundColor: t.accent },
  body: { fontSize: 13.5, color: t.sub, lineHeight: 19, marginTop: 3 },
  time: { fontSize: 12, color: t.muted, marginTop: 6 },
});
