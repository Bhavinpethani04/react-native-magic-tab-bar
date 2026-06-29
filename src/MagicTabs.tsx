import type { ReactNode } from 'react';
import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { MagicTabBar } from './MagicTabBar';
import { MagicTabItem } from './MagicTabItem';
import { defaultTabs } from './defaultTabs';
import { defaultTheme } from './theme';
import type { MagicTabBarTheme, MagicTabBarVariant, MagicTabConfig } from './types';

export interface MagicTabsProps {
  /**
   * The tabs to render, in order. Each entry maps a route to an icon + label.
   * When omitted, a default set is used — Home, Explore, Notifications and
   * Profile — with matching Ionicons (see {@link defaultTabs}).
   */
  tabs?: MagicTabConfig[];
  /** Override any part of the default theme. */
  theme?: Partial<MagicTabBarTheme>;
  /** Position the bar floating over content (default) or docked in-flow. */
  variant?: MagicTabBarVariant;
  /** Render a custom background (e.g. a blur/glass view) behind the bar. */
  renderBackground?: () => ReactNode;
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
  tabs = defaultTabs,
  theme: themeOverride,
  variant,
  renderBackground,
}: MagicTabsProps) {
  const theme: MagicTabBarTheme = { ...defaultTheme, ...themeOverride };

  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <MagicTabBar theme={theme} variant={variant} renderBackground={renderBackground}>
          {tabs.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <MagicTabItem icon={tab.icon} label={tab.label} theme={theme} />
            </TabTrigger>
          ))}
        </MagicTabBar>
      </TabList>
    </Tabs>
  );
}
