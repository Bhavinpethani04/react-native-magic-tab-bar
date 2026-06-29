import { forwardRef, useEffect, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type View as RNView,
} from 'react-native';
import Animated, {
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { MagicTabBarTheme, MagicTabIconProps } from './types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const SPRING = { mass: 0.6, damping: 18, stiffness: 180 } as const;
const transition = LinearTransition.springify()
  .mass(SPRING.mass)
  .damping(SPRING.damping)
  .stiffness(SPRING.stiffness);

export interface MagicTabItemProps {
  /** Renders the icon. Provided automatically by `MagicTabs`. */
  icon: (props: MagicTabIconProps) => ReactNode;
  /** Optional label shown while the tab is active. */
  label?: string;
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
export const MagicTabItem = forwardRef<RNView, MagicTabItemProps>(
  function MagicTabItem({ icon, label, theme, isFocused, onPress, onLongPress }, ref) {
    const focused = Boolean(isFocused);
    const progress = useSharedValue(focused ? 1 : 0);

    useEffect(() => {
      progress.value = withSpring(focused ? 1 : 0, SPRING);
    }, [focused, progress]);

    const pillStyle = useAnimatedStyle(() => ({
      opacity: progress.value,
      transform: [{ scale: 0.8 + progress.value * 0.2 }],
    }));

    const color = focused ? theme.activeColor : theme.inactiveColor;
    const showLabel = focused && !!label;

    return (
      <AnimatedPressable
        ref={ref}
        onPress={onPress}
        onLongPress={onLongPress}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        layout={transition}
        style={[styles.pressable, focused && styles.pressableActive]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: theme.activePillColor, borderRadius: theme.radius },
            pillStyle,
          ]}
        />
        {icon({ focused, color, size: theme.iconSize })}
        {showLabel ? (
          <Animated.Text
            entering={FadeIn.duration(150)}
            numberOfLines={1}
            style={[styles.label, { color, fontSize: theme.fontSize }]}
          >
            {label}
          </Animated.Text>
        ) : null}
      </AnimatedPressable>
    );
  }
);

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
  // Active tab may shrink (truncating its label) only as a last resort on very
  // narrow screens; inactive tabs keep their natural icon size.
  pressableActive: {
    flexShrink: 1,
  },
  label: {
    fontWeight: '600',
    flexShrink: 1,
  },
});
