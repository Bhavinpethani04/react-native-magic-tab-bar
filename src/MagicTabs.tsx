import { useMemo, type ReactNode } from 'react';
import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { usePathname } from 'expo-router';
import { MagicTabBar } from './MagicTabBar';
import { MagicTabItem } from './MagicTabItem';
import { defaultTheme } from './theme';
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

/** Best-effort string path for an `Href` (covers string and `{ pathname }` forms). */
function hrefToPath(href: Href): string {
  if (typeof href === 'string') return href;
  const pathname = (href as { pathname?: string })?.pathname;
  return typeof pathname === 'string' ? pathname : '';
}

/**
 * Finds the tab whose `href` best matches the current path, by longest prefix
 * so nested routes (e.g. `/explore/details`) still resolve to their tab.
 */
function findActiveTab(
  tabs: MagicTabConfig[],
  pathname: string,
): MagicTabConfig | undefined {
  let best: MagicTabConfig | undefined;
  let bestLen = -1;
  for (const tab of tabs) {
    const path = hrefToPath(tab.href);
    if (!path) continue;
    const matches =
      path === '/'
        ? pathname === '/'
        : pathname === path || pathname.startsWith(`${path}/`);
    if (matches && path.length > bestLen) {
      best = tab;
      bestLen = path.length;
    }
  }
  return best;
}

/**
 * Normalizes the `showLabels` prop (boolean shorthand or explicit mode) and
 * clamps it to what the current `labelPosition` can display well.
 *
 * `'always'` only works with `labelPosition="bottom"`: side-by-side, every tab
 * would expand to its full label width and overflow the bar, so we downgrade
 * it to `'active'` (and warn in dev).
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
        '[MagicTabs] showLabels="always" requires labelPosition="bottom"; ' +
          'falling back to "active". Set labelPosition="bottom" to keep every label visible.',
      );
    }
    return 'active';
  }
  return mode;
}

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
}: MagicTabsProps) {
  // Stable identity so it doesn't re-trigger memoized children every render.
  const theme = useMemo<MagicTabBarTheme>(
    () => ({ ...defaultTheme, ...themeOverride }),
    [themeOverride],
  );
  const barLabelMode = resolveLabelMode(showLabels, labelPosition);

  // The bar is "light" when either the whole bar is forced light (`isLight`)
  // or the currently active tab opts in via its own `isLight` config. Changing
  // routes flips this and the bar animates between the two layouts.
  const pathname = usePathname();
  const activeTab = findActiveTab(tabs, pathname);
  const effectiveLight = isLight || !!activeTab?.isLight;

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
          isTransparent={isTransparent}
          transparency={transparency}
          glass={glass}
          renderBackground={renderBackground}
        >
          {tabs.map((tab) => {
            // A tab's `showLabel` overrides the bar-level mode: `false` forces
            // icon-only, `true` shows it (falling back to `'active'` when the
            // bar itself is set to `'never'`).
            const labelMode: MagicLabelMode =
              tab.showLabel === undefined
                ? barLabelMode
                : tab.showLabel
                  ? barLabelMode === 'never'
                    ? 'active'
                    : barLabelMode
                  : 'never';
            return (
              <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
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
                  haptics={haptics}
                  onTabPress={onTabPress}
                  onTabLongPress={onTabLongPress}
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
