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
import {
  ACTION_TAB_OVERHANG,
  BAR_ELEVATION,
  clampBarOpacity,
  LIGHT_EXTRA_BOTTOM_MARGIN,
  resolveBarBottomPadding,
  resolveBarHeight,
} from "./utils";

/**
 * Layout transition used to morph the bar between its normal and compact
 * "light" shapes (width, height and bottom margin) when the active tab changes.
 * Because the bar is sized by its content, this also animates the width change
 * when tabs are added or removed.
 */
const barTransition = LinearTransition.springify()
  .mass(0.5)
  .damping(16)
  .stiffness(160);

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
   * Stretch the bar across the full available width, spreading the tabs evenly.
   *
   * Off by default: the bar is sized by its content, so a two-tab bar is a
   * compact centered pill rather than a full-width bar with a large gap in the
   * middle. It still grows with the number of tabs, up to the full width
   * allowed by `theme.horizontalMargin`.
   */
  fullWidth?: boolean;
  /**
   * Make the bar background see-through. Off by default — the bar is fully
   * opaque. Set the strength of the effect with `transparency`.
   */
  isTransparent?: boolean;
  /**
   * Opacity of the bar background while `isTransparent` is true, from 0 to 1
   * (e.g. `0.4` = 40% visible). Clamped to a minimum so the bar never
   * disappears. Defaults to 0.6 when omitted.
   */
  transparency?: number;
  /**
   * Render the bar as native iOS Liquid Glass (via `expo-glass-effect`).
   * Requires iOS 26+; on any other platform/version it automatically falls
   * back to the translucent `barColor` (honoring `transparency`).
   */
  glass?: boolean;
  /**
   * Render a custom background (e.g. a blur/glass view) behind the bar. A
   * custom background provides its own fill, so the bar draws no `barColor`
   * layer and no drop shadow behind it (a rectangular halo behind a blur view
   * is never wanted). Provided automatically by `MagicTabs`.
   */
  renderBackground?: () => ReactNode;
  /**
   * Whether any tab uses `variant: 'action'` (a raised FAB). A `docked` bar
   * reserves headroom above itself for the raised button so it isn't clipped or
   * un-tappable on Android. Provided automatically by `MagicTabs`; set it
   * yourself only if you render `MagicTabBar` directly with a docked action tab.
   */
  hasActionTab?: boolean;
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
 *
 * The bar is sized by its content and centered, so its width tracks the number
 * of tabs (and the active tab's label) instead of always spanning the screen.
 * Pass `fullWidth` to opt back into an edge-to-edge bar.
 */
export const MagicTabBar = forwardRef<RNView, MagicTabBarProps>(
  function MagicTabBar(
    {
      theme,
      variant = "floating",
      labelPosition = "right",
      fullWidth = false,
      isTransparent = false,
      transparency = 0.6,
      glass = false,
      renderBackground,
      hasActionTab = false,
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
    const barHeight = resolveBarHeight(theme.height, labelPosition, isLight);
    const bottomPadding = resolveBarBottomPadding(
      insets.bottom,
      theme.bottomInset,
      isLight,
      lightBottomMargin,
    );
    // Native Liquid Glass needs the optional `expo-glass-effect` dep and iOS
    // 26+; everywhere else we fall back to the translucent color background.
    const useGlass = glass && !!glassEffect?.isLiquidGlassAvailable();
    // Only a transparent bar fades; otherwise it stays fully opaque. The level
    // is clamped so it never drops below MIN_BAR_OPACITY or above 1.
    const barOpacity = clampBarOpacity(isTransparent, transparency);
    // A see-through bar shouldn't cast a hard drop shadow — it reads as an odd
    // halo around the translucent fill. A custom `renderBackground` counts as
    // see-through too: it's almost always a blur view, and a rectangular halo
    // behind it is never what you want.
    const seeThrough = useGlass || isTransparent || !!renderBackground;
    // A solid bar paints its fill on the shadow-casting view itself rather than
    // in a child layer. Both platforms derive the shadow's shape from the view's
    // own background: on iOS a background-less layer gives a wrong (or missing)
    // shadow, and on Android `elevation` needs a background to build an outline
    // from. The child-layer approach is only needed when `transparency` has to
    // fade the fill without fading the icons on top of it.
    const solidFill = !seeThrough;

    return (
      <View
        ref={ref}
        pointerEvents="box-none"
        style={[
          floating ? styles.floatingWrapper : styles.dockedWrapper,
          // A docked bar sits in-flow, so it only reserves the raised-FAB
          // headroom when an action tab actually needs it — otherwise it would
          // leave a dead gap above the bar. (Floating reserves it unconditionally
          // above, where the absolute, box-none wrapper makes the space free.)
          !floating && hasActionTab && styles.dockedActionHeadroom,
          // Content-sized bars are centered; a full-width bar stretches to fill
          // the wrapper instead.
          fullWidth ? styles.wrapperStretch : styles.wrapperCenter,
          {
            paddingHorizontal: theme.horizontalMargin,
            paddingBottom: bottomPadding,
          },
        ]}
      >
        <Animated.View
          layout={barTransition}
          style={[
            styles.bar,
            !seeThrough && styles.barShadow,
            {
              height: barHeight,
              borderRadius: theme.radius,
              ...(solidFill ? { backgroundColor: theme.barColor } : null),
            },
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
          ) : isTransparent ? (
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
          ) : null}
          <View
            accessibilityRole="tablist"
            style={[
              isLight ? styles.lightRow : styles.row,
              fullWidth && styles.rowFullWidth,
              style,
            ]}
            {...rest}
          >
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
    // Headroom for an `action` (FAB) tab, which is raised above the bar with a
    // negative margin. Android does not draw or hit-test children outside their
    // parent's bounds, so without this the raised button is clipped and its top
    // half is not tappable. The wrapper is `box-none`, so the extra space stays
    // transparent to touches.
    paddingTop: ACTION_TAB_OVERHANG,
  },
  dockedWrapper: {
    width: "100%",
  },
  // Headroom for a raised `action` (FAB) tab on a docked bar — see the floating
  // wrapper's note. Applied only when an action tab is present so a plain docked
  // bar keeps no extra gap above it.
  dockedActionHeadroom: {
    paddingTop: ACTION_TAB_OVERHANG,
  },
  wrapperCenter: {
    alignItems: "center",
  },
  wrapperStretch: {
    alignItems: "stretch",
  },
  bar: {
    flexDirection: "row",
    // Never exceed the space left by the wrapper's horizontal margin, however
    // many tabs there are.
    maxWidth: "100%",
  },
  barShadow: {
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: BAR_ELEVATION,
  },
  // Sized by its tabs: the bar hugs the row, so the row must not stretch.
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  // Compact "light" row: tighter horizontal padding around the small icons.
  lightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  // `fullWidth`: fill the bar and spread the tabs evenly across it.
  rowFullWidth: {
    flex: 1,
    justifyContent: "space-around",
  },
});
