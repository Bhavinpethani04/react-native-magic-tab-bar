import type { ReactNode } from 'react';
import type { Href } from 'expo-router';

/** Props passed to each tab's `icon` render function. */
export interface MagicTabIconProps {
  /** Whether this tab is the active one. */
  focused: boolean;
  /** Resolved color for the icon (active or inactive color from the theme). */
  color: string;
  /** Icon size in points (from the theme). */
  size: number;
}

/** Configuration for a single tab. */
export interface MagicTabConfig {
  /** Route name — must match the file in the `app/` directory (e.g. `"index"`, `"search"`). */
  name: string;
  /** Destination href, e.g. `"/"` or `"/search"`. */
  href: Href;
  /** Optional text label rendered next to the icon while the tab is active. */
  label?: string;
  /**
   * Show this tab's label while active. Overrides the bar-level `showLabels`
   * prop for this tab only. A tab without a `label` never shows text.
   */
  showLabel?: boolean;
  /**
   * Badge shown over the icon. `true` renders a small dot; a number or string
   * renders a count bubble (numbers above 99 display as `99+`). Falsy values
   * (`false`, `0`, `undefined`, `''`) render nothing.
   */
  badge?: number | string | boolean;
  /**
   * Dim the tab and block navigation to it. The tab still renders but cannot
   * be pressed. Off by default.
   */
  disabled?: boolean;
  /**
   * Render this tab as a raised, circular action ("FAB") button — common for a
   * center "create"/"compose" tab. Ignores label/pill styling and uses the
   * theme's `actionColor`/`actionIconColor`. Defaults to a normal tab.
   */
  variant?: 'action';
  /**
   * When this tab is the active route, switch the whole bar into compact
   * "light" mode (short, narrow, icon-only). Lets a single scroll-heavy screen
   * (e.g. a feed) use a minimal bar while the other tabs keep the full one. The
   * transition between modes is animated.
   */
  isLight?: boolean;
  /** Renders the tab's icon. */
  icon: (props: MagicTabIconProps) => ReactNode;
}

/**
 * Fired when a tab is pressed. `name` is the tab's route name and `focused`
 * is whether that tab was already the active one (useful for "scroll to top"
 * or "reset stack" on re-press).
 */
export type MagicTabPressHandler = (name: string, focused: boolean) => void;

/**
 * When labels are shown:
 * - `'active'` — only on the focused tab (default).
 * - `'always'` — on every tab, all the time.
 * - `'never'`  — icon-only bar.
 */
export type MagicLabelMode = 'active' | 'always' | 'never';

/** Where a tab's label sits relative to its icon. */
export type MagicLabelPosition = 'right' | 'bottom';

/** Spring parameters for the tab's focus/label animations. */
export interface MagicSpringConfig {
  mass: number;
  damping: number;
  stiffness: number;
}

/** Visual configuration for the tab bar. */
export interface MagicTabBarTheme {
  /** Background color of the bar (ignored when `renderBackground` is provided). */
  barColor: string;
  /** Background color of the pill behind the active tab. */
  activePillColor: string;
  /** Icon/label color for the active tab. */
  activeColor: string;
  /** Icon color for inactive tabs. */
  inactiveColor: string;
  /** Icon size in points. */
  iconSize: number;
  /** Font size of the active tab's label, in points. */
  fontSize: number;
  /** Height of the bar. */
  height: number;
  /** Corner radius of the bar and the active pill. */
  radius: number;
  /** Background color of a tab's badge. */
  badgeColor: string;
  /** Text color of a tab's badge count. */
  badgeTextColor: string;
  /** Background color of an `action`-variant tab. */
  actionColor: string;
  /** Icon color of an `action`-variant tab. */
  actionIconColor: string;
  /** Horizontal margin between the bar and the screen edges. */
  horizontalMargin: number;
  /** Extra space below the bar, added on top of the safe-area inset. */
  bottomInset: number;
  /** Spring used for the focus pill and label transitions. */
  spring: MagicSpringConfig;
}

/** How the bar is positioned relative to screen content. */
export type MagicTabBarVariant = 'floating' | 'docked';
