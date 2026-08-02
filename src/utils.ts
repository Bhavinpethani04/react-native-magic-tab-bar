import type {
  MagicHref,
  MagicLabelMode,
  MagicLabelPosition,
  MagicTabBarTheme,
  MagicTabConfig,
} from './types';
import { defaultTheme } from './theme';

declare const __DEV__: boolean;

// ---------------------------------------------------------------------------
// Badge helpers
// ---------------------------------------------------------------------------

/** Whether a `badge` value should render anything at all. */
export function hasBadge(
  badge: number | string | boolean | undefined,
): boolean {
  return (
    badge === true ||
    (typeof badge === 'number' && badge > 0) ||
    (typeof badge === 'string' && badge.length > 0)
  );
}

/** Formats a numeric/string badge; numbers above 99 collapse to `99+`. */
export function formatBadge(badge: number | string): string {
  return typeof badge === 'number' && badge > 99 ? '99+' : String(badge);
}

// ---------------------------------------------------------------------------
// Route matching (Expo Router)
// ---------------------------------------------------------------------------

/** Best-effort string path for a href (covers string and `{ pathname }` forms). */
export function hrefToPath(href: MagicHref | undefined): string {
  if (typeof href === 'string') return href;
  const pathname = (href as { pathname?: string } | undefined)?.pathname;
  return typeof pathname === 'string' ? pathname : '';
}

/**
 * Removes Expo Router group segments (`(group)`) from a path so hrefs match
 * `usePathname()`. Groups are organizational and never appear in the URL, so
 * `href: "/(home)/expenses"` must compare against a pathname of `/expenses`.
 * Collapses any doubled or trailing slashes and falls back to `/` for root.
 */
export function stripGroupSegments(path: string): string {
  return (
    path
      .replace(/\/\([^/)]+\)/g, '')
      .replace(/\/{2,}/g, '/')
      .replace(/(.)\/$/, '$1') || '/'
  );
}

/**
 * Finds the tab whose `href` best matches the current path, by longest prefix
 * so nested routes (e.g. `/explore/details`) still resolve to their tab.
 */
export function findActiveTab(
  tabs: MagicTabConfig[],
  pathname: string,
): MagicTabConfig | undefined {
  let best: MagicTabConfig | undefined;
  let bestLen = -1;
  const currentPath = stripGroupSegments(pathname);
  for (const tab of tabs) {
    const rawPath = hrefToPath(tab.href);
    if (!rawPath) continue;
    const path = stripGroupSegments(rawPath);
    const matches =
      path === '/'
        ? currentPath === '/'
        : currentPath === path || currentPath.startsWith(`${path}/`);
    if (matches && path.length > bestLen) {
      best = tab;
      bestLen = path.length;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// Label mode
// ---------------------------------------------------------------------------

/**
 * Normalizes the `showLabels` prop (boolean shorthand or explicit mode) and
 * clamps it to what the current `labelPosition` can display well.
 *
 * `'always'` only works with `labelPosition="bottom"`: side-by-side, every tab
 * would expand to its full label width and overflow the bar, so we downgrade it
 * to `'active'` (and warn in dev). `source` names the calling component in that
 * warning so both entry points read correctly.
 */
export function resolveLabelMode(
  showLabels: boolean | MagicLabelMode,
  labelPosition: MagicLabelPosition,
  source: string = 'MagicTabs',
): MagicLabelMode {
  const mode: MagicLabelMode =
    showLabels === true ? 'active' : showLabels === false ? 'never' : showLabels;

  if (mode === 'always' && labelPosition !== 'bottom') {
    if (__DEV__) {
      console.warn(
        `[${source}] showLabels="always" requires labelPosition="bottom"; ` +
          'falling back to "active". Set labelPosition="bottom" to keep every label visible.',
      );
    }
    return 'active';
  }
  return mode;
}

/**
 * Resolves a single tab's effective label mode. A tab's optional `showLabel`
 * overrides the bar-level `barLabelMode`:
 * - `undefined` — inherit the bar's mode unchanged.
 * - `false` — force icon-only (`'never'`).
 * - `true` — show the label, falling back to `'active'` when the bar itself is
 *   set to `'never'` (so an explicit opt-in is honored rather than swallowed).
 */
export function resolveItemLabelMode(
  barLabelMode: MagicLabelMode,
  showLabel: boolean | undefined,
): MagicLabelMode {
  if (showLabel === undefined) return barLabelMode;
  if (!showLabel) return 'never';
  return barLabelMode === 'never' ? 'active' : barLabelMode;
}

// ---------------------------------------------------------------------------
// Bar background opacity
// ---------------------------------------------------------------------------

/** Lowest bar opacity we allow, so a transparent bar never becomes invisible. */
export const MIN_BAR_OPACITY = 0.1;

/**
 * Resolves the bar background's opacity. A solid bar is fully opaque; a
 * transparent bar uses `transparency`, clamped to [{@link MIN_BAR_OPACITY}, 1]
 * so the bar never disappears or exceeds full opacity.
 */
export function clampBarOpacity(
  isTransparent: boolean,
  transparency: number,
): number {
  return isTransparent
    ? Math.min(Math.max(transparency, MIN_BAR_OPACITY), 1)
    : 1;
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

/** Merges a partial theme override onto the {@link defaultTheme}. */
export function mergeTheme(
  override?: Partial<MagicTabBarTheme>,
): MagicTabBarTheme {
  return { ...defaultTheme, ...override };
}
