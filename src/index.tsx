export { MagicTabs } from './MagicTabs';
export { MagicTabBar } from './MagicTabBar';
export { MagicTabItem } from './MagicTabItem';
export { defaultTheme } from './theme';

// `defaultTabs` is intentionally NOT re-exported here — it depends on an icon
// library, and keeping it out of the main entry means the core stays
// zero-runtime-dependency. Import it from the subpath for the demo set:
//
//   import { defaultTabs } from 'react-native-magic-tab-bar/default-tabs';

export type { MagicTabsProps } from './MagicTabs';
export type { MagicTabBarProps } from './MagicTabBar';
export type { MagicTabItemProps } from './MagicTabItem';
export type {
  MagicHref,
  MagicTabConfig,
  MagicTabIconProps,
  MagicTabBarTheme,
  MagicTabBarVariant,
  MagicTabPressHandler,
  MagicLabelMode,
  MagicLabelPosition,
  MagicSpringConfig,
} from './types';
