import { StyleSheet, Text, View } from "react-native";

export function DemoScreen({ title, color }: { title: string; color: string }) {
  return (
    <View style={[styles.screen, { backgroundColor: color }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.hint}>react-native-magic-tab-bar</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 34, fontWeight: "800", color: "#1c1c1e" },
  hint: { marginTop: 8, fontSize: 14, color: "#1c1c1e", opacity: 0.5 },
});
