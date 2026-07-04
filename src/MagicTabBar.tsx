import { forwardRef, type ReactNode } from "react";
import {
  StyleSheet,
  View,
  type View as RNView,
  type ViewProps,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {
  MagicLabelPosition,
  MagicTabBarTheme,
  MagicTabBarVariant,
} from "./types";

/**
 * Layout transition used to morph the bar between its normal and compact
 * "light" shapes (width, height and bottom margin) when the active tab changes.
 */
const barTransition = LinearTransition.springify()
  .mass(0.5)
  .damping(16)
  .stiffness(160);

/** Extra bar height when labels sit below icons, so they have room to breathe. */
const BOTTOM_LABEL_EXTRA_HEIGHT = 6;

/** Fixed height of the compact "light" bar. */
const LIGHT_BAR_HEIGHT = 46;

/** Default extra bottom margin added below the bar in "light" mode. */
const LIGHT_EXTRA_BOTTOM_MARGIN = 14;

declare const require: (moduleName: string) => unknown;

/**
 * `expo-glass-effect` is an optional peer dependency. We load it through a
 * guarded `require` so the library still installs and runs for consumers who
 * don't need (or install) it — when it's absent, `glass` mode silently falls
 * back to the translucent `barColor`. The try/catch lets Metro treat it as an
 * optional dependency instead of failing the bundle.
 */
const glassEffect = (() => {
  try {
    return require("expo-glass-effect") as typeof import("expo-glass-effect");
  } catch {
    return null;
  }
})();

/** Lowest bar opacity we allow, so a transparent bar never becomes invisible. */
export const MIN_BAR_OPACITY = 0.1;

export interface MagicTabBarProps extends ViewProps {
  /** Resolved theme. Provided automatically by `MagicTabs`. */
  theme: MagicTabBarTheme;
  /** Position the bar floating over content (default) or docked in-flow. */
  variant?: MagicTabBarVariant;
  /**
   * Where the tab labels sit. `'bottom'` gives the bar extra height so the
   * stacked icon+label has room to breathe. Provided automatically by
   * `MagicTabs`.
   */
  labelPosition?: MagicLabelPosition;
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
  /**
   * Compact "light" mode: a shorter, icon-only bar with extra bottom margin.
   * Provided automatically by `MagicTabs`.
   */
  isLight?: boolean;
  /**
   * Extra bottom margin below the bar in "light" mode only. Added on top of the
   * safe-area inset and `theme.bottomInset`. Ignored when `isLight` is false.
   * Defaults to {@link LIGHT_EXTRA_BOTTOM_MARGIN}.
   */
  lightBottomMargin?: number;
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
      labelPosition = "right",
      isTransparent = false,
      transparency = 0.6,
      glass = false,
      renderBackground,
      isLight = false,
      lightBottomMargin = LIGHT_EXTRA_BOTTOM_MARGIN,
      children,
      style,
      ...rest
    },
    ref,
  ) {
    const insets = useSafeAreaInsets();
    const floating = variant !== "docked";
    // "Light" mode is a fixed, compact height. Otherwise stacked (bottom) labels
    // need more vertical room than the icon-only / side-by-side layouts, so the
    // bar grows a little in that mode.
    const barHeight = isLight
      ? LIGHT_BAR_HEIGHT
      : labelPosition === "bottom"
        ? theme.height + BOTTOM_LABEL_EXTRA_HEIGHT
        : theme.height;
    // "Light" mode floats a little higher off the bottom edge.
    const extraBottomMargin = isLight ? lightBottomMargin : 0;
    // Native Liquid Glass needs the optional `expo-glass-effect` dep and iOS
    // 26+; everywhere else we fall back to the translucent color background.
    const useGlass = glass && !!glassEffect?.isLiquidGlassAvailable();
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
          // Light mode centers a narrower bar; drop the side padding so the
          // bar's width is measured against the full screen width.
          isLight && styles.lightWrapper,
          {
            paddingHorizontal: isLight ? 0 : theme.horizontalMargin,
            paddingBottom:
              (floating ? insets.bottom : 0) + theme.bottomInset + extraBottomMargin,
          },
        ]}
      >
        <Animated.View
          layout={barTransition}
          style={[
            styles.bar,
            !seeThrough && styles.barShadow,
            isLight && styles.lightBar,
            { height: barHeight, borderRadius: theme.radius },
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
          ) : useGlass && glassEffect ? (
            // Native iOS Liquid Glass. We tint it with the bar color so themes
            // still carry through, and clip it to the bar's rounded corners.
            <glassEffect.GlassView
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
          <View style={[isLight ? styles.lightRow : styles.row, style]} {...rest}>
            {children}
          </View>
        </Animated.View>
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
  // Light mode: a narrower bar (65% of screen width) centered by its wrapper.
  lightWrapper: {
    alignItems: "center",
  },
  lightBar: {
    width: "65%",
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
  // Compact "light" row: tighter horizontal padding around the small icons.
  lightRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
});
