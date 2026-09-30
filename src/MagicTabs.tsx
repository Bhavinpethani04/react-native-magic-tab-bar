import { useMemo, type ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { usePathname } from 'expo-router';
import { MagicTabBar } from './MagicTabBar';
import { MagicTabItem } from './MagicTabItem';
import {
  findActiveTab,
  mergeTheme,
  resolveItemLabelMode,
  resolveLabelMode,
} from './utils';
import type { Href } from 'expo-router';
import type {
  MagicLabelMode,
  MagicLabelPosition,
  MagicTabBarTheme,
  MagicTabBarVariant,
  MagicTabConfig,
  MagicTabPressHandler,
} from './types';

declare const __DEV__: boolean;

export interface MagicTabsProps {
  /**
   * The tabs to render, in order. Each entry maps a route to an icon + label.
   *
   * Bring your own icons. For a ready-made demo set, import it explicitly:
   * `import { defaultTabs } from 'react-native-magic-tab-bar/default-tabs'`.
   */
  tabs: MagicTabConfig[];
  /** Override any part of the default theme. */
  theme?: Partial<MagicTabBarTheme>;
  /**
   * When to show tab labels:
   * - `true` / `'active'` — only on the focused tab (default).
   * - `'always'` — on every tab, all the time.
   * - `false` / `'never'` — icon-only bar.
   *
   * A tab without a `label` never shows text. Individual tabs can override
   * this via their `showLabel` config field.
   */
  showLabels?: boolean | MagicLabelMode;
  /** Place labels to the right of icons (default) or below them. */
  labelPosition?: MagicLabelPosition;
  /**
   * Extra style for every tab label, applied last — e.g. `fontWeight`,
   * `letterSpacing` or `textTransform`. For a custom font, set
   * `theme.fontFamily` instead.
   */
  labelStyle?: StyleProp<TextStyle>;
  /** Extra style for the badge count text, applied last. */
  badgeTextStyle?: StyleProp<TextStyle>;
  /**
   * Compact "light" mode. Off by default. When `true`, the bar is shorter,
   * shows small icons only (labels hidden), and floats with extra bottom
   * margin. Uses its own dedicated styles.
   */
  isLight?: boolean;
  /**
   * Extra space between the bar and the bottom edge, in "light" mode only.
   * Added on top of the safe-area inset. Ignored unless `isLight` is `true`.
   * Defaults to 14.
   */
  lightBottomMargin?: number;
  /** Position the bar floating over content (default) or docked in-flow. */
  variant?: MagicTabBarVariant;
  /**
   * Stretch the bar across the full width, spreading the tabs evenly.
   *
   * Off by default: the bar is sized by its tabs and centered, so a two- or
   * three-tab bar is a compact pill instead of a full-width bar with a big gap
   * in the middle. It still grows with the number of tabs, up to the width
   * allowed by `theme.horizontalMargin`.
   */
  fullWidth?: boolean;
  /**
   * Make the bar background see-through. Off by default. When `true`, control
   * the strength with `transparency`.
   */
  isTransparent?: boolean;
  /**
   * Opacity of the bar background while `isTransparent` is true, from 0 to 1
   * (e.g. `0.4` = 40% visible). Clamped to a minimum so the bar never fully
   * disappears. Defaults to 0.6.
   */
  transparency?: number;
  /**
   * Render the bar as native iOS Liquid Glass (via `expo-glass-effect`).
   * Requires iOS 26+; on any other platform it falls back to the translucent
   * `barColor`. No drop shadow is drawn in glass/transparent mode.
   */
  glass?: boolean;
  /** Render a custom background (e.g. a blur/glass view) behind the bar. */
  renderBackground?: () => ReactNode;
  /**
   * Fire a selection haptic when a tab is pressed. Requires the optional
   * `expo-haptics` package; without it this prop has no effect. Off by default.
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
 * A drop-in custom tab bar for Expo Router.
 *
 * Use it in an `app/_layout.tsx` and pass your routes, icons and labels as props:
 *
 * ```tsx
 * <MagicTabs
 *   tabs={[
 *     { name: 'index',  href: '/',        label: 'Home',   icon: ({ color }) => <Home color={color} /> },
 *     { name: 'search', href: '/search',  label: 'Search', icon: ({ color }) => <Search color={color} /> },
 *   ]}
 * />
 * ```
 */
export function MagicTabs({
  tabs,
  theme: themeOverride,
  showLabels = true,
  labelPosition = 'right',
  labelStyle,
  badgeTextStyle,
  isLight = false,
  lightBottomMargin,
  variant,
  fullWidth,
  isTransparent,
  transparency,
  glass,
  renderBackground,
  haptics,
  onTabPress,
  onTabLongPress,
}: MagicTabsProps) {
  // Stable identity so it doesn't re-trigger memoized children every render.
  const theme = useMemo<MagicTabBarTheme>(
    () => mergeTheme(themeOverride),
    [themeOverride],
  );
  const barLabelMode = resolveLabelMode(showLabels, labelPosition);

  // The bar is "light" when either the whole bar is forced light (`isLight`)
  // or the currently active tab opts in via its own `isLight` config. Changing
  // routes flips this and the bar animates between the two layouts.
  const pathname = usePathname();
  const activeTab = findActiveTab(tabs, pathname);
  const effectiveLight = isLight || !!activeTab?.isLight;
  // Lets the bar reserve headroom for a raised FAB when docked.
  const hasActionTab = tabs.some((tab) => tab.variant === 'action');

  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <MagicTabBar
          theme={theme}
          variant={variant}
          labelPosition={labelPosition}
          isLight={effectiveLight}
          lightBottomMargin={lightBottomMargin}
          fullWidth={fullWidth}
          isTransparent={isTransparent}
          transparency={transparency}
          glass={glass}
          renderBackground={renderBackground}
          hasActionTab={hasActionTab}
        >
          {tabs.map((tab) => {
            if (__DEV__ && tab.href === undefined) {
              console.warn(
                `[MagicTabs] tab "${tab.name}" is missing a \`href\`. ` +
                  'Expo Router requires one on every tab (e.g. href: "/search"). ' +
                  '`href` is only optional when using MagicTabBarNavigation with React Navigation.',
              );
            }
            const labelMode = resolveItemLabelMode(barLabelMode, tab.showLabel);
            return (
              <TabTrigger
                key={tab.name}
                name={tab.name}
                href={tab.href as Href}
                asChild
              >
                <MagicTabItem
                  name={tab.name}
                  icon={tab.icon}
                  label={tab.label}
                  labelMode={labelMode}
                  labelPosition={labelPosition}
                  badge={tab.badge}
                  disabled={tab.disabled}
                  variant={tab.variant}
                  isLight={effectiveLight}
                  testID={tab.testID}
                  haptics={haptics}
                  onTabPress={onTabPress}
                  onTabLongPress={onTabLongPress}
                  labelStyle={labelStyle}
                  badgeTextStyle={badgeTextStyle}
                  theme={theme}
                />
              </TabTrigger>
            );
          })}
        </MagicTabBar>
      </TabList>
    </Tabs>
  );
}
