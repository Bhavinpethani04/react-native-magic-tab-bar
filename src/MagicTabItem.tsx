import { forwardRef, memo, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
  type View as RNView,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type {
  MagicLabelMode,
  MagicLabelPosition,
  MagicTabBarTheme,
  MagicTabIconProps,
  MagicTabPressHandler,
} from './types';

declare const require: (moduleName: string) => unknown;

/** Minimal shape we use from the optional `expo-haptics` module. */
type HapticsModule = { selectionAsync?: () => void };

/**
 * `expo-haptics` is an optional peer dependency. We load it through a guarded
 * `require` so the library still installs and runs without it — when it's
 * absent, the `haptics` prop simply has no effect.
 */
const expoHaptics = (() => {
  try {
    return require('expo-haptics') as HapticsModule;
  } catch {
    return null;
  }
})();

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Fixed small icon size used by the compact "light" tab bar. */
const LIGHT_ICON_SIZE = 20;

/** Whether a `badge` value should render anything at all. */
function hasBadge(badge: MagicTabItemProps['badge']): boolean {
  return badge === true || (typeof badge === 'number' && badge > 0) || (typeof badge === 'string' && badge.length > 0);
}

/** Formats a numeric/string badge; numbers above 99 collapse to `99+`. */
function formatBadge(badge: number | string): string {
  return typeof badge === 'number' && badge > 99 ? '99+' : String(badge);
}

export interface MagicTabItemProps {
  /** Renders the icon. Provided automatically by `MagicTabs`. */
  icon: (props: MagicTabIconProps) => ReactNode;
  /** Optional label text. */
  label?: string;
  /** When the label is shown: `'active'` (default), `'always'` or `'never'`. */
  labelMode?: MagicLabelMode;
  /** Whether the label sits to the right of the icon (default) or below it. */
  labelPosition?: MagicLabelPosition;
  /**
   * Badge shown over the icon. `true` renders a dot; a number/string renders
   * a count bubble (numbers above 99 show as `99+`). Falsy renders nothing.
   */
  badge?: number | string | boolean;
  /** Dim the tab and block presses. */
  disabled?: boolean;
  /** Render as a raised, circular action ("FAB") button. */
  variant?: 'action';
  /**
   * Compact "light" mode: small icon-only tab, no label. Provided by
   * `MagicTabs`. Uses its own dedicated styles.
   */
  isLight?: boolean;
  /** Fire a selection haptic on press. Requires `expo-haptics`. */
  haptics?: boolean;
  /** Route name, used for the press callbacks. Provided by `MagicTabs`. */
  name?: string;
  /** Called when the tab is pressed. */
  onTabPress?: MagicTabPressHandler;
  /** Called when the tab is long-pressed. */
  onTabLongPress?: MagicTabPressHandler;
  /** Resolved theme. Provided automatically by `MagicTabs`. */
  theme: MagicTabBarTheme;

  // ---- Injected by <TabTrigger asChild> ----
  /** @internal */
  isFocused?: boolean;
  /** @internal */
  onPress?: (event: GestureResponderEvent) => void;
  /** @internal */
  onLongPress?: (event: GestureResponderEvent) => void;
  /** @internal */
  href?: string;
}

/**
 * A single tab. Designed to be used as the `asChild` target of an
 * Expo Router `<TabTrigger>`, which injects the focus state and press handlers.
 *
 * Each tab sizes to its content — just the icon when inactive, icon + label
 * when active — so the active label is never clipped, on any screen width.
 */
export const MagicTabItem = memo(forwardRef<RNView, MagicTabItemProps>(
  function MagicTabItem(
    {
      icon,
      label,
      labelMode = 'active',
      labelPosition = 'right',
      badge,
      disabled = false,
      variant,
      isLight = false,
      haptics = false,
      name,
      onTabPress,
      onTabLongPress,
      theme,
      isFocused,
      onPress,
      onLongPress,
    },
    ref,
  ) {
    const focused = Boolean(isFocused);
    const { spring } = theme;
    const progress = useSharedValue(focused ? 1 : 0);

    useEffect(() => {
      progress.value = withSpring(focused ? 1 : 0, spring);
    }, [focused, progress, spring]);

    // Rebuilt only when the theme's spring changes, so consumers can tune the
    // layout animation's feel via `theme.spring`.
    const transition = useMemo(
      () =>
        LinearTransition.springify()
          .mass(spring.mass)
          .damping(spring.damping)
          .stiffness(spring.stiffness),
      [spring.mass, spring.damping, spring.stiffness],
    );

    const pillStyle = useAnimatedStyle(() => ({
      opacity: progress.value,
      transform: [{ scale: 0.8 + progress.value * 0.2 }],
    }));

    const handlePress = useCallback(
      (event: GestureResponderEvent) => {
        if (haptics) expoHaptics?.selectionAsync?.();
        onTabPress?.(name ?? '', focused);
        onPress?.(event);
      },
      [haptics, onTabPress, name, focused, onPress],
    );

    const handleLongPress = useCallback(
      (event: GestureResponderEvent) => {
        onTabLongPress?.(name ?? '', focused);
        onLongPress?.(event);
      },
      [onTabLongPress, name, focused, onLongPress],
    );

    const badgeVisible = hasBadge(badge);
    const badgeIsDot = badge === true;

    const iconWithBadge = (iconColor: string, size: number) => (
      <View>
        {icon({ focused, color: iconColor, size })}
        {badgeVisible ? (
          <View
            pointerEvents="none"
            style={[
              styles.badge,
              badgeIsDot && styles.badgeDot,
              { backgroundColor: theme.badgeColor },
            ]}
          >
            {badgeIsDot ? null : (
              <Text
                numberOfLines={1}
                style={[styles.badgeText, { color: theme.badgeTextColor }]}
              >
                {formatBadge(badge as number | string)}
              </Text>
            )}
          </View>
        ) : null}
      </View>
    );

    // ---- Raised circular action ("FAB") tab ----
    if (variant === 'action') {
      const size = theme.height - 6;
      return (
        <AnimatedPressable
          ref={ref}
          onPress={handlePress}
          onLongPress={handleLongPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityState={{ selected: focused, disabled }}
          style={[
            styles.action,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: theme.actionColor,
            },
            disabled && styles.disabled,
          ]}
        >
          {iconWithBadge(theme.actionIconColor, theme.iconSize + 2)}
        </AnimatedPressable>
      );
    }

    // ---- Normal tab ----
    const color = focused ? theme.activeColor : theme.inactiveColor;

    // ---- Compact "light" tab: small icon only, no label ----
    if (isLight) {
      return (
        <AnimatedPressable
          ref={ref}
          onPress={handlePress}
          onLongPress={handleLongPress}
          disabled={disabled}
          accessibilityRole="tab"
          accessibilityState={{ selected: focused, disabled }}
          layout={transition}
          style={[styles.itemLight, disabled && styles.disabled]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: theme.activePillColor, borderRadius: theme.radius },
              pillStyle,
            ]}
          />
          {iconWithBadge(color, LIGHT_ICON_SIZE)}
        </AnimatedPressable>
      );
    }

    const showLabel =
      !!label && labelMode !== 'never' && (labelMode === 'always' || focused);

    // ---- Bottom labels: Material Design 3 layout ----
    // The active indicator ("pill") wraps only the icon as a capsule; the label
    // sits below it. Following M3's `LABEL_VISIBILITY_SELECTED` behaviour, each
    // item is centered as a group: unlabeled tabs are just a centered icon, and
    // the active tab grows to icon + label (nudging its icon up a touch). The
    // layout transition animates that shift smoothly. Indicator sizing follows
    // M3's 64x32-over-24dp ratio, scaled to the theme's icon size.
    if (labelPosition === 'bottom') {
      const indicatorHeight = theme.iconSize + 10;
      const indicatorWidth = theme.iconSize + 32;
      return (
        <AnimatedPressable
          ref={ref}
          onPress={handlePress}
          onLongPress={handleLongPress}
          disabled={disabled}
          accessibilityRole="tab"
          accessibilityState={{ selected: focused, disabled }}
          layout={transition}
          style={[styles.itemBottom, disabled && styles.disabled]}
        >
          <View
            style={[
              styles.indicatorWrap,
              { width: indicatorWidth, height: indicatorHeight },
            ]}
          >
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: theme.activePillColor,
                  borderRadius: indicatorHeight / 2,
                },
                pillStyle,
              ]}
            />
            {iconWithBadge(color, theme.iconSize)}
          </View>
          {showLabel ? (
            <Animated.Text
              entering={FadeIn.duration(150)}
              exiting={FadeOut.duration(120)}
              numberOfLines={1}
              style={[styles.labelBottom, { color, fontSize: theme.fontSize - 1 }]}
            >
              {label}
            </Animated.Text>
          ) : null}
        </AnimatedPressable>
      );
    }

    // ---- Right labels: floating pill wrapping icon + label ----
    return (
      <AnimatedPressable
        ref={ref}
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={disabled}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused, disabled }}
        layout={transition}
        style={[
          styles.pressable,
          focused && styles.pressableActive,
          disabled && styles.disabled,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.activePillColor, borderRadius: theme.radius },
            pillStyle,
          ]}
        />
        {iconWithBadge(color, theme.iconSize)}
        {showLabel ? (
          <Animated.Text
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(120)}
            numberOfLines={1}
            style={[styles.label, { color, fontSize: theme.fontSize }]}
          >
            {label}
          </Animated.Text>
        ) : null}
      </AnimatedPressable>
    );
  }
));

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  // The active tab gets extra padding so its pill is a touch larger than the
  // inactive icons, making the current tab easy to spot. flexShrink lets it
  // truncate its label only as a last resort on very narrow screens.
  pressableActive: {
    flexShrink: 1,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  label: {
    fontWeight: '600',
    flexShrink: 1,
  },
  // Material Design 3 bottom layout: icon (with capsule indicator) stacked
  // over an always-below label.
  itemBottom: {
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  indicatorWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Compact "light" mode: small icon-only tap target with its own tight padding.
  itemLight: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  labelBottom: {
    fontWeight: '600',
    textAlign: 'center',
  },
  action: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  disabled: {
    opacity: 0.4,
  },
  badge: {
    position: 'absolute',
    top: -5,
    left: '65%',
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    top: -2,
    minWidth: 8,
    width: 8,
    height: 8,
    paddingHorizontal: 0,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});
