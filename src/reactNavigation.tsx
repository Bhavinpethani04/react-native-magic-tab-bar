import { useMemo, type ReactNode } from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MagicTabBar } from './MagicTabBar';
import { MagicTabItem } from './MagicTabItem';
import { defaultTheme } from './theme';
import type {
  MagicLabelMode,
  MagicLabelPosition,
  MagicTabBarTheme,
  MagicTabBarVariant,
  MagicTabConfig,
  MagicTabPressHandler,
} from './types';

declare const __DEV__: boolean;

/**
 * The subset of {@link MagicTabConfig} that carries visual/behavioral config
 * for a React Navigation tab. `href` is intentionally omitted here — React
 * Navigation navigates by route `name`, so it is never needed.
 */
export type MagicNavigationTab = Omit<MagicTabConfig, 'href'>;

/**
 * Normalizes the `showLabels` prop (boolean shorthand or explicit mode) and
 * clamps it to what the current `labelPosition` can display well.
 *
 * Mirrors the logic in `MagicTabs` so both entry points behave identically:
 * `'always'` only works with `labelPosition="bottom"`, otherwise every tab
 * would expand to its full label width and overflow the bar.
 */
function resolveLabelMode(
  showLabels: boolean | MagicLabelMode,
  labelPosition: MagicLabelPosition,
): MagicLabelMode {
  const mode: MagicLabelMode =
    showLabels === true ? 'active' : showLabels === false ? 'never' : showLabels;

  if (mode === 'always' && labelPosition !== 'bottom') {
    if (__DEV__) {
      console.warn(
        '[MagicTabBarNavigation] showLabels="always" requires labelPosition="bottom"; ' +
          'falling back to "active". Set labelPosition="bottom" to keep every label visible.',
      );
    }
    return 'active';
  }
  return mode;
}

export interface MagicTabBarNavigationProps extends BottomTabBarProps {
  /**
   * Per-tab icon, label, badge and styling config, keyed by route `name`.
   * Every route in the navigator should have a matching entry; a route without
   * one is skipped (with a dev warning), since there is no icon to render.
   */
  tabs: MagicNavigationTab[];
  /** Override any part of the default theme. */
  theme?: Partial<MagicTabBarTheme>;
  /**
   * When to show tab labels:
   * - `true` / `'active'` — only on the focused tab (default).
   * - `'always'` — on every tab, all the time (requires `labelPosition="bottom"`).
   * - `false` / `'never'` — icon-only bar.
   */
  showLabels?: boolean | MagicLabelMode;
  /** Place labels to the right of icons (default) or below them. */
  labelPosition?: MagicLabelPosition;
  /** Force the compact "light" bar layout for every route. */
  isLight?: boolean;
  /** Extra bottom margin below the bar in "light" mode. Defaults to 14. */
  lightBottomMargin?: number;
  /** Position the bar floating over content (default) or docked in-flow. */
  variant?: MagicTabBarVariant;
  /** Make the bar background see-through. Off by default. */
  isTransparent?: boolean;
  /** Opacity of the bar background while `isTransparent` is true (0–1). */
  transparency?: number;
  /**
   * Render the bar as native iOS Liquid Glass (via `expo-glass-effect`, if
   * installed). Falls back to the translucent `barColor` everywhere else.
   */
  glass?: boolean;
  /** Render a custom background (e.g. a blur view) behind the bar. */
  renderBackground?: () => ReactNode;
  /**
   * Fire a selection haptic on press. Requires the optional `expo-haptics`
   * package; without it this prop has no effect.
   */
  haptics?: boolean;
  /**
   * Called when any tab is pressed, with the tab's `name` and whether it was
   * already focused — handy for "scroll to top" / "reset stack" on re-press.
   */
  onTabPress?: MagicTabPressHandler;
  /** Called when any tab is long-pressed. */
  onTabLongPress?: MagicTabPressHandler;
}

/**
 * A drop-in custom tab bar for **React Navigation** (`@react-navigation/bottom-tabs`).
 *
 * Pass it to a `Tab.Navigator` via the `tabBar` render prop, along with the
 * same `tabs` config you'd give `MagicTabs`, minus the `href` (React Navigation
 * navigates by route `name`):
 *
 * ```tsx
 * import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
 * import { MagicTabBarNavigation } from 'react-native-magic-tab-bar/react-navigation';
 *
 * const Tab = createBottomTabNavigator();
 *
 * const tabs = [
 *   { name: 'Home',   label: 'Home',   icon: ({ color, size }) => <Home color={color} size={size} /> },
 *   { name: 'Search', label: 'Search', icon: ({ color, size }) => <Search color={color} size={size} /> },
 * ];
 *
 * <Tab.Navigator
 *   screenOptions={{ headerShown: false }}
 *   tabBar={(props) => <MagicTabBarNavigation {...props} tabs={tabs} />}
 * >
 *   <Tab.Screen name="Home" component={HomeScreen} />
 *   <Tab.Screen name="Search" component={SearchScreen} />
 * </Tab.Navigator>
 * ```
 */
export function MagicTabBarNavigation({
  state,
  navigation,
  tabs,
  theme: themeOverride,
  showLabels = true,
  labelPosition = 'right',
  isLight = false,
  lightBottomMargin,
  variant,
  isTransparent,
  transparency,
  glass,
  renderBackground,
  haptics,
  onTabPress,
  onTabLongPress,
}: MagicTabBarNavigationProps) {
  // Stable identity so it doesn't re-trigger memoized children every render.
  const theme = useMemo<MagicTabBarTheme>(
    () => ({ ...defaultTheme, ...themeOverride }),
    [themeOverride],
  );
  const barLabelMode = resolveLabelMode(showLabels, labelPosition);

  // Index the config by route name for O(1) lookup while mapping routes.
  const tabByName = useMemo(() => {
    const map = new Map<string, MagicNavigationTab>();
    for (const tab of tabs) map.set(tab.name, tab);
    return map;
  }, [tabs]);

  // The active route can opt the whole bar into compact "light" mode, matching
  // `MagicTabs` behavior.
  const activeRouteName = state.routes[state.index]?.name;
  const effectiveLight =
    isLight || !!(activeRouteName && tabByName.get(activeRouteName)?.isLight);

  return (
    <MagicTabBar
      theme={theme}
      variant={variant}
      labelPosition={labelPosition}
      isLight={effectiveLight}
      lightBottomMargin={lightBottomMargin}
      isTransparent={isTransparent}
      transparency={transparency}
      glass={glass}
      renderBackground={renderBackground}
    >
      {state.routes.map((route, index) => {
        const tab = tabByName.get(route.name);
        if (!tab) {
          if (__DEV__) {
            console.warn(
              `[MagicTabBarNavigation] no \`tabs\` entry for route "${route.name}". ` +
                'Add one with an `icon` (and optional `label`), or the tab is not rendered.',
            );
          }
          return null;
        }

        const focused = state.index === index;

        // A tab's `showLabel` overrides the bar-level mode: `false` forces
        // icon-only, `true` shows it (falling back to `'active'` when the bar
        // itself is set to `'never'`).
        const labelMode: MagicLabelMode =
          tab.showLabel === undefined
            ? barLabelMode
            : tab.showLabel
              ? barLabelMode === 'never'
                ? 'active'
                : barLabelMode
              : 'never';

        // Reproduce React Navigation's own tabBar press semantics: emit a
        // cancelable `tabPress` event and only navigate if it isn't prevented
        // and the tab isn't already focused.
        const handlePress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const handleLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <MagicTabItem
            key={route.key}
            name={route.name}
            icon={tab.icon}
            label={tab.label}
            labelMode={labelMode}
            labelPosition={labelPosition}
            badge={tab.badge}
            disabled={tab.disabled}
            variant={tab.variant}
            isLight={effectiveLight}
            haptics={haptics}
            theme={theme}
            isFocused={focused}
            onPress={handlePress}
            onLongPress={handleLongPress}
            onTabPress={onTabPress}
            onTabLongPress={onTabLongPress}
          />
        );
      })}
    </MagicTabBar>
  );
}

export type { MagicTabConfig, MagicTabIconProps, MagicTabBarTheme } from './types';
