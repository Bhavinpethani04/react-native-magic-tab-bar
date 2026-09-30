# Changelog

All notable changes to this project are documented here. This project follows
[Semantic Versioning](https://semver.org/): the leading number changes when a
release alters existing behavior in a way that can require you to update code.

## 3.1.0

### Added

- **Custom fonts** — set `theme.fontFamily` to render tab labels and badge
  counts in your own font. With a custom family the bar no longer forces a bold
  weight (which made Android synthesize a faux-bold face); choose the weight
  through the family name instead. The system-font look is unchanged.
- **`labelStyle` and `badgeTextStyle` props** on `MagicTabs` and
  `MagicTabBarNavigation` — extra `TextStyle` applied last, for
  `letterSpacing`, `textTransform`, `fontWeight` and so on.

## 3.0.0

### Breaking changes

- **The bar is now sized by its tabs and centered by default**, instead of
  stretching edge-to-edge. A two-tab bar is now a compact centered pill rather
  than a full-width bar with a gap in the middle. **To keep the previous
  full-width look, pass `fullWidth`:**

  ```tsx
  <MagicTabs tabs={tabs} fullWidth />
  ```

  This applies to the compact **light** bar too, which was previously pinned to
  a fixed 65% of the screen width and is now sized by its tabs like the normal
  bar.

- **`docked` bars now include the safe-area bottom inset.** Previously only the
  `floating` variant added it, so a docked bar could sit under the home
  indicator / gesture bar. If you were compensating by wrapping a docked bar in
  a bottom-edge `SafeAreaView`, remove that wrapper to avoid double spacing —
  the bar applies its own bottom inset now.

- **`renderBackground` no longer draws a drop shadow behind the bar.** A custom
  background provides its own fill (it's almost always a blur/glass view, where
  a rectangular shadow halo is unwanted), so the bar skips both its `barColor`
  layer and its elevation/shadow when `renderBackground` is set.

### Added

- **`fullWidth` prop** — opt back into an edge-to-edge bar that spreads the tabs
  evenly. Off by default (see the breaking change above).
- **Accessibility**: every tab now exposes an `accessibilityLabel` (falling back
  to the route name), the tab row is marked `accessibilityRole="tablist"`, and a
  tab's badge is folded into its accessible name (e.g. "Alerts, 3") so screen
  readers announce it.
- **Larger touch targets**: tabs use `hitSlop` to reach the ~44pt / 48dp minimum
  recommended by the iOS HIG and Material guidelines, without changing their
  visual size.
- **`testID` per tab** — set `testID` on a tab config to target it from e2e
  suites.
- **Font-scale caps** on the badge count and labels, so large OS font sizes
  don't blow out the bar's fixed height or the badge bubble.
- A raised `action` (FAB) tab is no longer clipped or un-tappable on a `docked`
  bar on Android — the bar reserves headroom for it when an action tab is
  present.
- **Android: the `action` (FAB) tab's circular background renders again.** On
  Android `elevation` is a window-wide z-order rather than a per-parent one, so
  the button — nested inside a bar that now paints its own background — was
  composited underneath that background and only its icon survived. The action
  tab is now elevated above the bar.

### Internal

- Framework-agnostic logic (route matching, label-mode resolution, bar metrics,
  badge/accessibility helpers) is centralized in `src/utils.ts` and covered by a
  Node-only Jest suite.
