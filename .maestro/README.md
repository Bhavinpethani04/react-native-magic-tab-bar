# End-to-end tests

[Maestro](https://maestro.dev) flows that drive the Expo Router example app
(`example/`) on a real simulator. They exist because the tab bar's most
important behaviour is geometric — the bar is **sized by its tabs** — and that
cannot be checked from the unit tests, which only cover the pure logic in
`src/utils.ts`.

## Setup

```bash
curl -fsSL "https://get.maestro.mobile.dev" | bash   # installs to ~/.maestro/bin
maestro --version                                    # needs a JDK (17+) on PATH
```

Then boot a simulator and get the example app running on it:

```bash
cd example
npx expo run:ios          # first time only — builds and installs the app
npx expo start            # afterwards: Metro alone is enough
```

> The example resolves the library straight from `src/` (see
> `example/metro.config.js`), so library edits show up on reload with no
> rebuild. If a change does not appear, restart Metro with `npx expo start
> --clear` — a stale bundler cache will silently serve the old library code.

## Running

```bash
npm run e2e           # all flows: assertions + screenshots
npm run e2e:measure   # geometry assertions (see below)
```

`maestro test .maestro` runs the numbered flows and skips `helpers/`.
Screenshots land in `~/.maestro/tests/<timestamp>/<flow>/takeScreenshot/`.

### Android

The bar's Android-specific fixes (the raised FAB staying tappable, `elevation`
needing a background to cast a shadow) only reproduce on Android, so run the
suite there too:

```bash
cd example && npx expo run:android      # build + install on a booted emulator
adb reverse tcp:8081 tcp:8081           # let the emulator reach Metro
```

> Launch the app from `expo run:android`, or by its dev-client deep link. A
> plain launcher tap (`monkey`) starts it with no bundle URL and you get a black
> screen with an empty view hierarchy.

### Picking a device

With both an iOS simulator and an Android emulator attached, Maestro cannot
choose for you — pass the device explicitly. `e2e:measure` takes the same
selection through `MAESTRO_DEVICE`:

```bash
maestro --udid <ios-udid|emulator-5554> test .maestro
MAESTRO_DEVICE=emulator-5554 npm run e2e:measure
```

> Only **one** Maestro process can drive a device at a time. A stray
> `maestro hierarchy` left running will hold the iOS XCTest driver and make the
> whole suite fail instantly with `Connection refused` — a wall of sub-second
> failures means an orphaned process, not a broken bar. Check with
> `ps aux | grep maestro.cli.AppKt`.

### Driver start-up timeout

`e2e:measure` shells out to `maestro test` ~20 times and **each call cold-starts
the iOS XCTest driver**. On a busy machine the default start-up window is too
short and the run dies with `iOS driver not ready in time`. Give it room:

```bash
MAESTRO_DRIVER_STARTUP_TIMEOUT=180000 MAESTRO_DEVICE=<udid> npm run e2e:measure
```

The script has no retry, so a single driver timeout aborts the whole run — you
lose the summary table and the docked safe-area check along with it.

> **Android is slow.** A full suite run on an emulator takes far longer than on
> a simulator, and on a loaded host it can degrade badly enough that `launchApp`
> alone exceeds the flows' 120s first-render wait. If a flow fails on
> "wait for `tabcount-current`", check the elapsed time in the log before
> suspecting the bar — and re-run it on an idle machine. Screenshots captured
> during such a run can also show partly-composited frames (e.g. a FAB missing
> its circular background) that do not reproduce live.

## The flows

| Flow | Covers |
| --- | --- |
| `01-tab-counts.yaml` | Every count from 1 to 5. Asserts exactly which tabs render at each, and screenshots the bar. **This is the regression test for the full-width bug.** |
| `02-tab-navigation.yaml` | Every tab navigates, exactly one is selected at a time, and re-pressing the active tab keeps it selected. |
| `03-light-mode.yaml` | Per-tab `isLight` morphs the bar to the compact layout and back, at two different tab counts. |
| `04-full-width.yaml` | The `fullWidth` opt-out stretches the bar edge to edge, and toggles back. |
| `05-accessibility.yaml` | Tabs expose accessible names, and a badge is folded in ("Alerts, 3"). Selects **by text**, so it only passes if the label really reaches assistive tech. |
| `06-docked.yaml` | The `docked` variant renders, navigates, and is content-sized. Its safe-area inset is measured by `e2e:measure`. |
| `07-action-tab.yaml` | The raised `action` (FAB) tab is tappable — floating *and* docked. On Android this is the clipping regression test. **Covers tappability only** — that the button's circular background actually *renders* (the Android elevation/z-order fix) is evidenced by its screenshots, not asserted. |
| `08-custom-background.yaml` | A custom `renderBackground` replaces the bar's fill and drops its shadow, without swallowing the tabs. |

`helpers/` holds the parameterised sub-flows (`set-tab-count.yaml`,
`toggle-switch.yaml`, `assert-tabs-visible.yaml`) the others call via `runFlow`.

## Geometry checks

Screenshots prove the bar *looks* right; `npm run e2e:measure` proves it
*measures* right. It drives the same switcher, reads the device view hierarchy,
and asserts the invariants the old full-width bar violated:

- the bar never exceeds the width left by `theme.horizontalMargin`
- it stays horizontally centred
- with 1–3 tabs it is well under the full width (this is the actual bug)
- its width **grows** with the tab count — the old bar was constant
- the measured bar element matches the width implied by its tabs
- `fullWidth` restores an edge-to-edge bar

Current output on an iPhone 16 Pro (402pt wide, 374pt available):

```
tabs   bar width   measured   % of available   off-center
   1      109pt      109pt            29%        0.5pt
   2      155pt      155pt            41%        0.5pt
   3      201pt      201pt            54%        0.5pt
   4      247pt      247pt            66%        0.5pt
   5      293pt      293pt            78%        0.5pt

fullWidth at 2 tabs: 155pt content-sized → 374pt stretched
docked safe area:    floating clears 44pt, docked clears 44pt
```

Exactly +46pt per tab — one inactive tab's width.

## Hooks in the app

The flows drive controls that only exist in the demo:

| `testID` | What it is |
| --- | --- |
| `tabcount-1` … `tabcount-5` | Tab-count buttons (`TabCountControl`) |
| `tabcount-current` | Reads back the applied count |
| `fullwidth-toggle` | The `fullWidth` switch |
| `tab-home`, `tab-expenses`, `tab-alerts`, `tab-budgets`, `tab-account` | The tabs themselves, via `MagicTabConfig.testID` |

Tab `testID`s come from the library's own `testID` field, so they are how a
consumer would target tabs in their own suite — not a test-only hack.
