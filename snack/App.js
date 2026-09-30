/**
 * react-native-magic-tab-bar — live demo
 * https://github.com/Bhavinpethani04/react-native-magic-tab-bar
 *
 * Paste this into https://snack.expo.dev and press Run. Everything below is the
 * whole integration: a normal `Tab.Navigator` whose `tabBar` renders
 * `MagicTabBarNavigation`, plus one `tabs` array describing each tab.
 *
 * The same `tabs` array drives Expo Router through `MagicTabs` — only the
 * navigator around it changes.
 */
import * as React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MagicTabBarNavigation } from 'react-native-magic-tab-bar/react-navigation';

const Tab = createBottomTabNavigator();

/** Filled glyph when the tab is active, outline when it isn't. */
const ionicon = (active, inactive) => ({ focused, color, size }) =>
  <Ionicons name={focused ? active : inactive} color={color} size={size} />;

/**
 * Per-tab config, keyed by route `name`. Note there is no `href` — that's an
 * Expo Router concept; React Navigation routes by `name`.
 */
const tabs = [
  { name: 'Home', label: 'Home', icon: ionicon('wallet', 'wallet-outline') },
  // `isLight` switches the WHOLE bar to the compact icon-only layout while this
  // tab is active — good for a scroll-heavy screen. The change is animated.
  { name: 'Expenses', label: 'Expenses', isLight: true, icon: ionicon('receipt', 'receipt-outline') },
  { name: 'Alerts', label: 'Alerts', badge: 3, icon: ionicon('notifications', 'notifications-outline') },
  { name: 'Budgets', label: 'Budgets', icon: ionicon('pie-chart', 'pie-chart-outline') },
  { name: 'Account', label: 'Account', icon: ionicon('person-circle', 'person-circle-outline') },
];

const theme = {
  barColor: '#17171C',
  activePillColor: '#2563EB',
  activeColor: '#FFFFFF',
  inactiveColor: '#9BA0AA',
  badgeColor: '#F04438',
};

export default function App() {
  // Demo toggles. None of these are required — the bar works with just `tabs`.
  const [fullWidth, setFullWidth] = React.useState(false);
  const [docked, setDocked] = React.useState(false);
  const [bottomLabels, setBottomLabels] = React.useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          // The magic bar draws its own labels, so hide the header and let it
          // float over full-bleed screen content.
          screenOptions={{ headerShown: false }}
          tabBar={(props) => (
            <MagicTabBarNavigation
              {...props}
              tabs={tabs}
              theme={theme}
              fullWidth={fullWidth}
              variant={docked ? 'docked' : 'floating'}
              labelPosition={bottomLabels ? 'bottom' : 'right'}
            />
          )}
        >
          <Tab.Screen name="Home">
            {() => (
              <Playground
                fullWidth={fullWidth}
                setFullWidth={setFullWidth}
                docked={docked}
                setDocked={setDocked}
                bottomLabels={bottomLabels}
                setBottomLabels={setBottomLabels}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Expenses">
            {() => <Screen title="Expenses" note="This tab sets isLight — the bar is now compact." />}
          </Tab.Screen>
          <Tab.Screen name="Alerts">
            {() => <Screen title="Alerts" note="This tab carries badge: 3." />}
          </Tab.Screen>
          <Tab.Screen name="Budgets">{() => <Screen title="Budgets" />}</Tab.Screen>
          <Tab.Screen name="Account">{() => <Screen title="Account" />}</Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

/** Home screen: the switches that drive the bar's layout props. */
function Playground(props) {
  return (
    <View style={styles.screen}>
      <Text style={styles.kicker}>react-native-magic-tab-bar</Text>
      <Text style={styles.title}>Try the props</Text>
      <Text style={styles.body}>
        One component, two navigators. This demo runs on React Navigation; the
        same tabs array drives Expo Router through MagicTabs.
      </Text>

      <View style={styles.card}>
        <Row
          label="Full width"
          hint="Off by default — the bar is sized by its tabs and centered."
          value={props.fullWidth}
          onValueChange={props.setFullWidth}
        />
        <View style={styles.divider} />
        <Row
          label="Docked"
          hint="Sit in-flow at the bottom instead of floating over content."
          value={props.docked}
          onValueChange={props.setDocked}
        />
        <View style={styles.divider} />
        <Row
          label="Labels below icons"
          hint="Material 3 layout instead of a pill beside the icon."
          value={props.bottomLabels}
          onValueChange={props.setBottomLabels}
        />
      </View>

      <Text style={styles.footnote}>
        Tap through the tabs — Expenses switches the bar to its compact layout,
        and Alerts carries a badge.
      </Text>
    </View>
  );
}

function Row({ label, hint, value, onValueChange }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowHint}>{hint}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function Screen({ title, note }) {
  return (
    <View style={[styles.screen, styles.center]}>
      <Text style={styles.title}>{title}</Text>
      {note ? <Text style={[styles.body, styles.centerText]}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4F5F7', paddingHorizontal: 20, paddingTop: 72 },
  center: { alignItems: 'center', justifyContent: 'center', paddingTop: 0 },
  centerText: { textAlign: 'center' },
  kicker: { color: '#2563EB', fontWeight: '700', fontSize: 13, letterSpacing: 0.4 },
  title: { fontSize: 30, fontWeight: '800', color: '#0B0B0F', marginTop: 4 },
  body: { fontSize: 15, color: '#5A6372', marginTop: 8, lineHeight: 21 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    marginTop: 22,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 12 },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: '700', color: '#0B0B0F' },
  rowHint: { fontSize: 13, color: '#8A93A3', marginTop: 2, lineHeight: 18 },
  divider: { height: 1, backgroundColor: '#ECEEF2' },
  footnote: { fontSize: 13, color: '#8A93A3', marginTop: 20, lineHeight: 19 },
});
