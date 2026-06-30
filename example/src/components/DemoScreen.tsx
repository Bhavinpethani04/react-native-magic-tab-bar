import { StyleSheet, Text, View } from "react-native";

/** Shared page background for every demo screen. */
const BACKGROUND = "#F5F3EF";

export function DemoScreen({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BACKGROUND,
  },
  title: { fontSize: 34, fontWeight: "800", color: "#1c1c1e" },
  subtitle: {
    marginTop: 10,
    fontSize: 16,
    color: "#1c1c1e",
    opacity: 0.7,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
