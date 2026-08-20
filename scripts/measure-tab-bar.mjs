#!/usr/bin/env node
/**
 * Geometry check for the tab bar, run against the live example app.
 *
 * Screenshots prove the bar *looks* right; this proves it *measures* right.
 * For every tab count it drives the demo's switcher with Maestro, reads the
 * device view hierarchy, and asserts the invariants that the content-sized bar
 * has to satisfy — the ones the old full-width bar silently violated.
 *
 * Prerequisites: the example app running on a booted simulator (see
 * `.maestro/README.md`).
 *
 *   node scripts/measure-tab-bar.mjs
 */
import { execFileSync } from "node:child_process";

const MAESTRO = `${process.env.HOME}/.maestro/bin/maestro`;

/**
 * Which device to drive. Required once more than one is attached (e.g. an iOS
 * simulator and an Android emulator at the same time), where Maestro cannot
 * pick for you:
 *
 *   MAESTRO_DEVICE=emulator-5554 node scripts/measure-tab-bar.mjs
 */
const DEVICE = process.env.MAESTRO_DEVICE;
const maestroArgs = (...args) => (DEVICE ? ["--udid", DEVICE, ...args] : args);

/** Tab `testID`s in the order the demo renders them. */
const TAB_IDS = [
  "tab-home",
  "tab-expenses",
  "tab-alerts",
  "tab-budgets",
  "tab-account",
];

/** Must match `theme.horizontalMargin` in the example's `_layout.tsx`. */
const HORIZONTAL_MARGIN = 14;
/** `styles.row` horizontal padding in MagicTabBar — tabs sit this far inside the bar. */
const ROW_PADDING = 6;
/** How far off-center the bar may sit before we call it a failure. */
const CENTER_TOLERANCE = 2;

const parseBounds = (s) => {
  const m = /^\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]$/.exec(s ?? "");
  if (!m) return null;
  const [x1, y1, x2, y2] = m.slice(1).map(Number);
  return { x1, y1, x2, y2, w: x2 - x1, h: y2 - y1 };
};

/** Collects every node keyed by `resource-id`, plus the root's bounds. */
function readHierarchy() {
  const raw = execFileSync(MAESTRO, maestroArgs("hierarchy"), {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "ignore"],
  });
  const tree = JSON.parse(raw);
  const byId = new Map();
  const all = [];
  (function walk(node) {
    const a = node.attributes ?? {};
    const b = parseBounds(a.bounds);
    const id = a["resource-id"];
    if (b) {
      all.push(b);
      if (id) byId.set(id, b);
    }
    (node.children ?? []).forEach(walk);
  })(tree);

  // The window, i.e. the shallowest node that actually has an area. NOT the
  // largest node: a scrollable screen's content view is taller than the window,
  // so "largest area" silently returns a box that extends past the bottom of
  // the display and makes every bottom-edge measurement meaningless.
  let screen = null;
  for (let level = [tree]; level.length && !screen; ) {
    const next = [];
    for (const node of level) {
      const b = parseBounds(node.attributes?.bounds);
      if (b && b.w > 0 && b.h > 0) {
        screen = b;
        break;
      }
      next.push(...(node.children ?? []));
    }
    level = next;
  }
  return { byId, all, screen };
}

/**
 * The bar's own node. `MagicTabBar` marks its tab row `accessibilityRole=
 * "tablist"`, which surfaces it in the hierarchy — so we can measure the real
 * element instead of only inferring it from the tabs it contains. Identified as
 * the smallest node that encloses every tab.
 */
function findBarNode(all, tabs) {
  const left = Math.min(...tabs.map((b) => b.x1));
  const right = Math.max(...tabs.map((b) => b.x2));
  const top = Math.min(...tabs.map((b) => b.y1));
  const bottom = Math.max(...tabs.map((b) => b.y2));
  return all
    .filter(
      (b) =>
        b.x1 <= left && b.x2 >= right && b.y1 <= top && b.y2 >= bottom &&
        // Strictly wider than the tabs it holds — the row pads them by
        // ROW_PADDING on each side. Without this, a single-tab bar matches the
        // tab's own pressable, which encloses the (only) tab exactly.
        b.w > right - left &&
        b.w < right - left + 60 && b.h < bottom - top + 60,
    )
    .sort((a, b) => a.w * a.h - b.w * b.h)[0];
}

function setTabCount(count) {
  execFileSync(
    MAESTRO,
    maestroArgs("test", "-e", `COUNT=${count}`, ".maestro/helpers/set-tab-count.yaml"),
    { stdio: ["ignore", "ignore", "pipe"], encoding: "utf8" },
  );
}

/**
 * Measures the bar in whatever state the app is currently in, from the tabs
 * that are actually on screen.
 */
function measureBar() {
  const { byId, all, screen } = readHierarchy();
  if (!screen) return null;
  const bounds = TAB_IDS.filter((id) => byId.has(id)).map((id) => byId.get(id));
  if (!bounds.length) return null;
  const left = Math.min(...bounds.map((b) => b.x1));
  const right = Math.max(...bounds.map((b) => b.x2));
  const bar = findBarNode(all, bounds);
  return {
    barWidth: right - left + ROW_PADDING * 2,
    available: screen.w - HORIZONTAL_MARGIN * 2,
    // Distance from the bar's bottom edge to the bottom of the screen. This is
    // what has to clear the home indicator / gesture bar.
    bottomGap: bar ? screen.y2 - bar.y2 : null,
  };
}

/** Flips one of the demo's switches (`docked-toggle`, `action-toggle`, …). */
function toggle(id) {
  execFileSync(
    MAESTRO,
    maestroArgs("test", "-e", `TOGGLE=${id}`, ".maestro/helpers/toggle-switch.yaml"),
    { stdio: ["ignore", "ignore", "pipe"], encoding: "utf8" },
  );
}

const failures = [];
const rows = [];

function check(label, ok, detail) {
  if (!ok) failures.push(`${label}: ${detail}`);
}

for (const count of [1, 2, 3, 4, 5]) {
  setTabCount(count);
  const { byId, all, screen } = readHierarchy();
  if (!screen) {
    failures.push(`${count} tabs: could not read screen bounds`);
    continue;
  }

  const expected = TAB_IDS.slice(0, count);
  const missing = expected.filter((id) => !byId.has(id));
  const extra = TAB_IDS.slice(count).filter((id) => byId.has(id));
  check(`${count} tabs`, missing.length === 0, `missing ${missing.join(", ")}`);
  check(`${count} tabs`, extra.length === 0, `unexpected ${extra.join(", ")}`);
  if (missing.length || extra.length) continue;

  const bounds = expected.map((id) => byId.get(id));
  const left = Math.min(...bounds.map((b) => b.x1));
  const right = Math.max(...bounds.map((b) => b.x2));
  // The bar wraps the tab row, which is inset by the row's horizontal padding.
  const barWidth = right - left + ROW_PADDING * 2;
  const barCenter = (left + right) / 2;
  const screenCenter = screen.x1 + screen.w / 2;
  const available = screen.w - HORIZONTAL_MARGIN * 2;
  const offset = Math.abs(barCenter - screenCenter);

  // Cross-check the inferred width against the bar element's own bounds.
  const barNode = findBarNode(all, bounds);
  check(
    `${count} tabs`,
    barNode && Math.abs(barNode.w - barWidth) <= 2,
    barNode
      ? `bar element is ${barNode.w}pt but tabs imply ${barWidth}pt`
      : "could not locate the bar element in the hierarchy",
  );

  rows.push({
    count,
    barWidth,
    measured: barNode ? barNode.w : null,
    available,
    offset,
    screenW: screen.w,
  });

  // 1. Never wider than the space `horizontalMargin` leaves.
  check(
    `${count} tabs`,
    barWidth <= available + 1,
    `bar ${barWidth}pt exceeds available ${available}pt`,
  );
  // 2. Centered on screen.
  check(
    `${count} tabs`,
    offset <= CENTER_TOLERANCE,
    `bar off-center by ${offset.toFixed(1)}pt`,
  );
  // 3. The regression itself: a sparse bar must NOT fill the width.
  if (count <= 3) {
    check(
      `${count} tabs`,
      barWidth < available * 0.9,
      `bar ${barWidth}pt is ~full width (${available}pt) — content sizing regressed`,
    );
  }
}

// 5. `fullWidth` must restore the edge-to-edge bar. Checked at 2 tabs, where
//    content sizing and stretching differ most.
setTabCount(2);
const contentSized = measureBar();
toggle("fullwidth-toggle");
const stretched = measureBar();
toggle("fullwidth-toggle"); // leave the demo back on its default

if (contentSized && stretched) {
  check(
    "fullWidth",
    stretched.barWidth >= stretched.available - 2,
    `bar is ${stretched.barWidth}pt, expected ~${stretched.available}pt`,
  );
  check(
    "fullWidth",
    stretched.barWidth > contentSized.barWidth,
    `fullWidth (${stretched.barWidth}pt) is not wider than content-sized (${contentSized.barWidth}pt)`,
  );
  console.log(
    `\nfullWidth at 2 tabs: ${contentSized.barWidth}pt content-sized → ${stretched.barWidth}pt stretched (available ${stretched.available}pt)`,
  );
} else {
  failures.push("fullWidth: could not measure the bar");
}

// 6. A `docked` bar must clear the bottom safe area just like a floating one.
//    Before 3.0.0 the inset was only applied when floating, so a docked bar sat
//    on the home indicator. Comparing the two variants keeps this device-
//    independent — we assert docked matches floating rather than hardcoding 34pt.
setTabCount(5);
const floatingBar = measureBar();
toggle("docked-toggle");
const dockedBar = measureBar();
toggle("docked-toggle"); // back to floating

if (floatingBar?.bottomGap != null && dockedBar?.bottomGap != null) {
  check(
    "docked safe area",
    dockedBar.bottomGap >= floatingBar.bottomGap - 2,
    `docked bar sits ${dockedBar.bottomGap}pt from the bottom vs ${floatingBar.bottomGap}pt floating — the safe-area inset is missing`,
  );
  console.log(
    `\ndocked safe area: floating clears ${floatingBar.bottomGap}pt, docked clears ${dockedBar.bottomGap}pt`,
  );
} else {
  failures.push("docked safe area: could not measure the bar's bottom edge");
}

// 4. Width has to grow with the tab count. The old bar was constant here.
for (let i = 1; i < rows.length; i++) {
  const prev = rows[i - 1];
  const cur = rows[i];
  check(
    `${prev.count}→${cur.count} tabs`,
    cur.barWidth > prev.barWidth,
    `width did not grow (${prev.barWidth}pt → ${cur.barWidth}pt)`,
  );
}

const pad = (v, n) => String(v).padStart(n);
console.log(`\nscreen ${rows[0]?.screenW ?? "?"}pt · available ${rows[0]?.available ?? "?"}pt\n`);
console.log("tabs   bar width   measured   % of available   off-center");
console.log("-".repeat(62));
for (const r of rows) {
  const pct = ((r.barWidth / r.available) * 100).toFixed(0);
  console.log(
    `${pad(r.count, 4)}   ${pad(r.barWidth, 6)}pt   ${pad(r.measured ?? "?", 6)}pt   ${pad(pct, 11)}%   ${pad(r.offset.toFixed(1), 8)}pt`,
  );
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} geometry check(s) failed:`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("\n✓ all tab-bar geometry checks passed");
