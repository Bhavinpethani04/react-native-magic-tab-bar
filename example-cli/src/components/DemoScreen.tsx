import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DemoScreenProps {
  title: string;
  subtitle: string;
  accent: string;
  children?: ReactNode;
}

/**
 * A simple, good-looking placeholder screen so each tab has distinct content
 * to scroll while you try the tab bar. Content is padded at the bottom so it
 * never hides behind the floating bar.
 */
export function DemoScreen({ title, subtitle, accent, children }: DemoScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 140,
        paddingHorizontal: 20,
      }}
    >
      <View style={[styles.badge, { backgroundColor: accent }]}>
        <Text style={styles.badgeText}>{title}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {children}

      {Array.from({ length: 8 }).map((_, i) => (
        <View key={i} style={styles.card}>
          <View style={[styles.cardDot, { backgroundColor: accent }]} />
          <View style={styles.cardBody}>
            <View style={[styles.cardLine, { width: `${70 - i * 4}%` }]} />
            <View style={[styles.cardLine, styles.cardLineFaint, { width: `${50 - i * 3}%` }]} />
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0B0B0F',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 14,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    color: '#9BA0AA',
    fontSize: 15,
    marginTop: 6,
    marginBottom: 22,
    lineHeight: 21,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17171C',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardDot: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 14,
  },
  cardBody: {
    flex: 1,
  },
  cardLine: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#2A2A33',
    marginBottom: 8,
  },
  cardLineFaint: {
    backgroundColor: '#232329',
    height: 8,
  },
});
