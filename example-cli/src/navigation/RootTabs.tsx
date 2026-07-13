import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  MagicTabBarNavigation,
  type MagicNavigationTab,
  type MagicTabIconProps,
} from 'react-native-magic-tab-bar/react-navigation';
import {
  AccountScreen,
  AlertsScreen,
  BudgetsScreen,
  ExpensesScreen,
  HomeScreen,
} from '../screens';

const Tab = createBottomTabNavigator();

/**
 * Filled glyph when active, outline when inactive — the exact same icon pattern
 * the Expo example uses, just with `react-native-vector-icons` instead of
 * `@expo/vector-icons`. The tab config (and everything below) is otherwise
 * identical to Expo Router's `MagicTabs`.
 */
const ionicon =
  (active: string, inactive: string) =>
  ({ focused, color, size }: MagicTabIconProps) =>
    <Ionicons name={focused ? active : inactive} color={color} size={size} />;

/**
 * The same "expense app" tab set as the Expo example (see `example/src/app/
 * _layout.tsx`), so both demos look identical. `name` must match each
 * `<Tab.Screen name>`. Note there is no `href` — that's an Expo Router concept;
 * React Navigation routes by `name`.
 */
const tabs: MagicNavigationTab[] = [
  { name: 'Home', label: 'Home', icon: ionicon('wallet', 'wallet-outline') },
  { name: 'Expenses', label: 'Expenses', isLight: true, icon: ionicon('receipt', 'receipt-outline') },
  { name: 'Alerts', label: 'Alerts', badge: 3, icon: ionicon('notifications', 'notifications-outline') },
  { name: 'Budgets', label: 'Budgets', icon: ionicon('pie-chart', 'pie-chart-outline') },
  { name: 'Account', label: 'Account', icon: ionicon('person-circle', 'person-circle-outline') },
];

export function RootTabs() {
  return (
    <Tab.Navigator
      // The magic bar draws its own labels; hide the header and let it float
      // over full-bleed screen content.
      screenOptions={{ headerShown: false }}
      tabBar={props => (
        <MagicTabBarNavigation
          {...props}
          tabs={tabs}
          labelPosition="right"
          lightBottomMargin={30}
          theme={{
            barColor: '#17171C',
            activePillColor: '#2563EB',
            activeColor: '#FFFFFF',
            inactiveColor: '#9BA0AA',
            badgeColor: '#F04438',
          }}
        />
      )}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} />
      <Tab.Screen name="Alerts" component={AlertsScreen} />
      <Tab.Screen name="Budgets" component={BudgetsScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
