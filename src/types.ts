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
  /** Renders the tab's icon. */
  icon: (props: MagicTabIconProps) => ReactNode;
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
  /** Horizontal margin between the bar and the screen edges. */
  horizontalMargin: number;
  /** Extra space below the bar, added on top of the safe-area inset. */
  bottomInset: number;
}

/** How the bar is positioned relative to screen content. */
export type MagicTabBarVariant = 'floating' | 'docked';
