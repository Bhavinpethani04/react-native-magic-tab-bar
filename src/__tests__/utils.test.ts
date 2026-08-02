import {
  clampBarOpacity,
  findActiveTab,
  formatBadge,
  hasBadge,
  hrefToPath,
  mergeTheme,
  MIN_BAR_OPACITY,
  resolveItemLabelMode,
  resolveLabelMode,
  stripGroupSegments,
} from '../utils';
import { defaultTheme } from '../theme';
import type { MagicTabConfig } from '../types';

/** Minimal icon so we can build valid `MagicTabConfig` fixtures. */
const icon: MagicTabConfig['icon'] = () => null;

describe('hasBadge', () => {
  it('renders for the dot form (`true`)', () => {
    expect(hasBadge(true)).toBe(true);
  });

  it('renders for positive counts and non-empty strings', () => {
    expect(hasBadge(1)).toBe(true);
    expect(hasBadge(99)).toBe(true);
    expect(hasBadge('new')).toBe(true);
    expect(hasBadge('0')).toBe(true); // non-empty string, even if "0"
  });

  it('renders nothing for falsy / empty / non-positive values', () => {
    expect(hasBadge(false)).toBe(false);
    expect(hasBadge(undefined)).toBe(false);
    expect(hasBadge(0)).toBe(false);
    expect(hasBadge(-3)).toBe(false);
    expect(hasBadge('')).toBe(false);
  });
});

describe('formatBadge', () => {
  it('passes small numbers through as strings', () => {
    expect(formatBadge(5)).toBe('5');
    expect(formatBadge(99)).toBe('99');
    expect(formatBadge(0)).toBe('0');
  });

  it('collapses numbers above 99 to "99+"', () => {
    expect(formatBadge(100)).toBe('99+');
    expect(formatBadge(1234)).toBe('99+');
  });

  it('never collapses strings, only numbers', () => {
    expect(formatBadge('150')).toBe('150');
    expect(formatBadge('new')).toBe('new');
    expect(formatBadge('99+')).toBe('99+');
  });
});

describe('hrefToPath', () => {
  it('returns string hrefs unchanged', () => {
    expect(hrefToPath('/search')).toBe('/search');
    expect(hrefToPath('/')).toBe('/');
  });

  it('extracts `pathname` from object hrefs', () => {
    expect(hrefToPath({ pathname: '/profile' })).toBe('/profile');
    expect(hrefToPath({ pathname: '/user', params: { id: 1 } })).toBe('/user');
  });

  it('falls back to "" for undefined or pathname-less hrefs', () => {
    expect(hrefToPath(undefined)).toBe('');
    expect(hrefToPath({} as never)).toBe('');
  });
});

describe('stripGroupSegments', () => {
  it('leaves plain paths untouched', () => {
    expect(stripGroupSegments('/')).toBe('/');
    expect(stripGroupSegments('/search')).toBe('/search');
  });

  it('removes Expo Router group segments', () => {
    expect(stripGroupSegments('/(home)/expenses')).toBe('/expenses');
    expect(stripGroupSegments('/(app)/(home)/feed')).toBe('/feed');
  });

  it('collapses doubled slashes and trims a trailing slash', () => {
    expect(stripGroupSegments('//feed')).toBe('/feed');
    expect(stripGroupSegments('/feed/')).toBe('/feed');
  });

  it('falls back to "/" when a path is only a group', () => {
    expect(stripGroupSegments('/(tabs)')).toBe('/');
    expect(stripGroupSegments('/(home)/')).toBe('/');
  });
});

describe('findActiveTab', () => {
  const tabs: MagicTabConfig[] = [
    { name: 'index', href: '/', icon },
    { name: 'explore', href: '/explore', icon },
    { name: 'details', href: '/explore/details', icon },
    { name: 'profile', href: '/profile', icon },
    { name: 'grouped', href: '/(home)/dashboard', icon },
    { name: 'noHref', icon }, // href omitted (React Navigation style) — never matches
  ];

  it('matches the root tab only on an exact "/"', () => {
    expect(findActiveTab(tabs, '/')?.name).toBe('index');
  });

  it('matches an exact path', () => {
    expect(findActiveTab(tabs, '/explore')?.name).toBe('explore');
    expect(findActiveTab(tabs, '/profile')?.name).toBe('profile');
  });

  it('prefers the longest prefix for nested routes', () => {
    expect(findActiveTab(tabs, '/explore/details')?.name).toBe('details');
  });

  it('falls back to the parent tab for unknown nested routes', () => {
    expect(findActiveTab(tabs, '/explore/anything')?.name).toBe('explore');
  });

  it('compares against group-stripped hrefs', () => {
    expect(findActiveTab(tabs, '/dashboard')?.name).toBe('grouped');
  });

  it('returns undefined when nothing matches', () => {
    expect(findActiveTab(tabs, '/unknown')).toBeUndefined();
  });

  it('never returns a tab without an href', () => {
    expect(findActiveTab(tabs, '')?.name).not.toBe('noHref');
  });
});

describe('resolveLabelMode', () => {
  it('normalizes the boolean shorthand', () => {
    expect(resolveLabelMode(true, 'right')).toBe('active');
    expect(resolveLabelMode(false, 'right')).toBe('never');
    expect(resolveLabelMode(true, 'bottom')).toBe('active');
  });

  it('passes explicit modes through when the position allows them', () => {
    expect(resolveLabelMode('active', 'right')).toBe('active');
    expect(resolveLabelMode('never', 'bottom')).toBe('never');
    expect(resolveLabelMode('always', 'bottom')).toBe('always');
  });

  it('downgrades "always" to "active" for non-bottom label positions', () => {
    expect(resolveLabelMode('always', 'right')).toBe('active');
    // The `source` argument only affects the dev warning, never the result.
    expect(resolveLabelMode('always', 'right', 'MagicTabBarNavigation')).toBe(
      'active',
    );
  });
});

describe('resolveItemLabelMode', () => {
  it('inherits the bar mode when `showLabel` is undefined', () => {
    expect(resolveItemLabelMode('active', undefined)).toBe('active');
    expect(resolveItemLabelMode('always', undefined)).toBe('always');
    expect(resolveItemLabelMode('never', undefined)).toBe('never');
  });

  it('forces icon-only when `showLabel` is false, whatever the bar mode', () => {
    expect(resolveItemLabelMode('active', false)).toBe('never');
    expect(resolveItemLabelMode('always', false)).toBe('never');
    expect(resolveItemLabelMode('never', false)).toBe('never');
  });

  it('passes the bar mode through when `showLabel` is true', () => {
    expect(resolveItemLabelMode('active', true)).toBe('active');
    expect(resolveItemLabelMode('always', true)).toBe('always');
  });

  it('upgrades a `never` bar to `active` when a tab opts in with true', () => {
    // The one non-obvious branch: an explicit per-tab opt-in must not be
    // swallowed by an icon-only bar.
    expect(resolveItemLabelMode('never', true)).toBe('active');
  });
});

describe('clampBarOpacity', () => {
  it('is fully opaque when the bar is not transparent', () => {
    expect(clampBarOpacity(false, 0.6)).toBe(1);
    expect(clampBarOpacity(false, 0.1)).toBe(1);
  });

  it('uses the requested transparency within range', () => {
    expect(clampBarOpacity(true, 0.6)).toBe(0.6);
    expect(clampBarOpacity(true, 1)).toBe(1);
  });

  it('clamps to [MIN_BAR_OPACITY, 1] so the bar never disappears or overflows', () => {
    expect(clampBarOpacity(true, 0)).toBe(MIN_BAR_OPACITY);
    expect(clampBarOpacity(true, 0.05)).toBe(MIN_BAR_OPACITY);
    expect(clampBarOpacity(true, 2)).toBe(1);
  });

  it('exposes a sensible minimum', () => {
    expect(MIN_BAR_OPACITY).toBe(0.1);
  });
});

describe('mergeTheme', () => {
  it('returns the full default theme when no override is given', () => {
    expect(mergeTheme()).toEqual(defaultTheme);
    expect(mergeTheme(undefined)).toEqual(defaultTheme);
  });

  it('overrides only the provided keys, keeping the rest of the default', () => {
    const merged = mergeTheme({ barColor: '#000000', iconSize: 30 });
    expect(merged.barColor).toBe('#000000');
    expect(merged.iconSize).toBe(30);
    expect(merged.activeColor).toBe(defaultTheme.activeColor);
    expect(merged.spring).toBe(defaultTheme.spring);
  });

  it('returns a new object and never mutates the default theme', () => {
    const before = defaultTheme.barColor;
    const merged = mergeTheme({ barColor: '#123456' });
    expect(merged).not.toBe(defaultTheme);
    expect(defaultTheme.barColor).toBe(before);
  });
});
