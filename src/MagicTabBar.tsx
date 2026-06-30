import { forwardRef, type ReactNode } from "react";
import {
  StyleSheet,
  View,
  type View as RNView,
  type ViewProps,
} from "react-native";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MagicTabBarTheme, MagicTabBarVariant } from "./types";

/** Lowest bar opacity we allow, so a transparent bar never becomes invisible. */
export const MIN_BAR_OPACITY = 0.1;

export interface MagicTabBarProps extends ViewProps {
  /** Resolved theme. Provided automatically by `MagicTabs`. */
  theme: MagicTabBarTheme;
  /** Position the bar floating over content (default) or docked in-flow. */
  variant?: MagicTabBarVariant;
  /**
   * Make the bar background see-through. Off by default — the bar is fully
   * opaque. Set the strength of the effect with `transparency`.
   */
  isTransparent?: boolean;
  /**
   * Opacity of the bar background while `isTransparent` is true, from 0 to 1
   * (e.g. `0.4` = 40% visible). Clamped to a minimum of {@link MIN_BAR_OPACITY}
   * so the bar never disappears. Defaults to 0.6 when omitted.
   */
  transparency?: number;
  /**
   * Render the bar as native iOS Liquid Glass (via `expo-glass-effect`).
   * Requires iOS 26+; on any other platform/version it automatically falls
   * back to the translucent `barColor` (honoring `transparency`).
   */
  glass?: boolean;
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
    {
      theme,
      variant = "floating",
      isTransparent = false,
      transparency = 0.6,
      glass = false,
      renderBackground,
      children,
      style,
      ...rest
    },
    ref,
  ) {
    const insets = useSafeAreaInsets();
    const floating = variant !== "docked";
    // Native Liquid Glass only renders on iOS 26+; everywhere else GlassView
    // would just fall back to a plain View, so we use our color fallback there.
    const useGlass = glass && isLiquidGlassAvailable();
    // Only a transparent bar fades; otherwise it stays fully opaque. The level
    // is clamped so it never drops below MIN_BAR_OPACITY or above 1.
    const barOpacity = isTransparent
      ? Math.min(Math.max(transparency, MIN_BAR_OPACITY), 1)
      : 1;
    // A see-through bar shouldn't cast a hard drop shadow — it reads as an odd
    // halo around the translucent fill. Keep the shadow only for a solid bar.
    const seeThrough = useGlass || isTransparent;

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
            !seeThrough && styles.barShadow,
            { height: theme.height, borderRadius: theme.radius },
          ]}
        >
          {renderBackground ? (
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                { borderRadius: theme.radius, overflow: "hidden" },
              ]}
            >
              {renderBackground()}
            </View>
          ) : useGlass ? (
            // Native iOS Liquid Glass. We tint it with the bar color so themes
            // still carry through, and clip it to the bar's rounded corners.
            <GlassView
              pointerEvents="none"
              glassEffectStyle="regular"
              tintColor={theme.barColor}
              style={[StyleSheet.absoluteFill, { borderRadius: theme.radius }]}
            />
          ) : (
            // Background color lives in its own layer so `transparency` fades
            // only the bar's fill, never the icons or labels on top of it.
            <View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: theme.barColor,
                  borderRadius: theme.radius,
                  opacity: barOpacity,
                },
              ]}
            />
          )}
          <View style={[styles.row, style]} {...rest}>
            {children}
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  floatingWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  dockedWrapper: {
    width: "100%",
  },
  bar: {
    flexDirection: "row",
  },
  barShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 6,
  },
});
