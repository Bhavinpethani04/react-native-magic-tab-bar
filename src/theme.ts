import type { MagicTabBarTheme } from './types';

/** Default dark, floating-pill theme. */
export const defaultTheme: MagicTabBarTheme = {
  barColor: 'rgba(38, 38, 40, 0.94)',
  activePillColor: 'rgba(120, 120, 124, 0.55)',
  activeColor: '#FFFFFF',
  inactiveColor: '#FFFFFF',
  iconSize: 22,
  fontSize: 12,
  height: 56,
  radius: 28,
  badgeColor: '#FF3B30',
  badgeTextColor: '#FFFFFF',
  actionColor: '#0A84FF',
  actionIconColor: '#FFFFFF',
  horizontalMargin: 14,
  bottomInset: 10,
  spring: { mass: 0.6, damping: 18, stiffness: 180 },
};
