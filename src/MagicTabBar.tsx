import { forwardRef, type ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type ViewProps,
  type View as RNView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MagicTabBarTheme, MagicTabBarVariant } from './types';

export interface MagicTabBarProps extends ViewProps {
  /** Resolved theme. Provided automatically by `MagicTabs`. */
  theme: MagicTabBarTheme;
  /** Position the bar floating over content (default) or docked in-flow. */
  variant?: MagicTabBarVariant;
  /** Render a custom background (e.g. a blur/glass view) behind the bar. */
  renderBackground?: () => ReactNode;
  /** The tab items. Provided automatically by `MagicTabs`. */
  children?: ReactNode;
}

/**
 * The visual container of the tab bar. Designed to be used as the `asChild`
 * target of an Expo Router `<TabList>`.
 */
export const MagicTabBar = forwardRef<RNView, MagicTabBarProps>(
  function MagicTabBar(
    { theme, variant = 'floating', renderBackground, children, style, ...rest },
    ref
  ) {
    const insets = useSafeAreaInsets();
    const floating = variant !== 'docked';

    return (
      <View
        ref={ref}
        pointerEvents="box-none"
        style={[
          floating ? styles.floatingWrapper : styles.dockedWrapper,
          {
            paddingHorizontal: theme.horizontalMargin,
            paddingBottom: (floating ? insets.bottom : 0) + theme.bottomInset,
          },
        ]}
      >
        <View
          style={[
            styles.bar,
            {
              height: theme.height,
              borderRadius: theme.radius,
              backgroundColor: renderBackground ? 'transparent' : theme.barColor,
            },
          ]}
        >
          {renderBackground ? (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { borderRadius: theme.radius, overflow: 'hidden' },
              ]}
            >
              {renderBackground()}
            </View>
          ) : null}
          <View style={[styles.row, style]} {...rest}>
            {children}
          </View>
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  dockedWrapper: {
    width: '100%',
  },
  bar: {
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
  },
});
