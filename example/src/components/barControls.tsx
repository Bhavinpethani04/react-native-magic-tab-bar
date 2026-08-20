/**
 * Lets the demo (and the Maestro e2e suite) reshape the tab bar at runtime.
 *
 * The bar is sized by its content, so the tab count is the main thing that
 * changes its shape — and `fullWidth` is the documented opt-out back to an
 * edge-to-edge bar. Exposing both here is what makes them visible without
 * editing code, and testable from `.maestro/`.
 *
 * The state lives in the root layout, which owns `<MagicTabs>`; screens render
 * inside `<TabSlot>` (a descendant), so they read and update it through here.
 */
import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

/** Lowest / highest tab count the demo exposes. Bounded by the routes in `app/`. */
export const MIN_TABS = 1;
export const MAX_TABS = 5;

export interface BarControlsValue {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
  fullWidth: boolean;
  setFullWidth: Dispatch<SetStateAction<boolean>>;
  /** Dock the bar in-flow instead of floating over content. */
  docked: boolean;
  setDocked: Dispatch<SetStateAction<boolean>>;
  /** Render the middle tab as a raised `action` (FAB) button. */
  actionTab: boolean;
  setActionTab: Dispatch<SetStateAction<boolean>>;
  /** Supply a custom `renderBackground`, which also suppresses the bar's shadow. */
  customBg: boolean;
  setCustomBg: Dispatch<SetStateAction<boolean>>;
}

const BarControlsContext = createContext<BarControlsValue>({
  count: MAX_TABS,
  setCount: () => {},
  fullWidth: false,
  setFullWidth: () => {},
  docked: false,
  setDocked: () => {},
  actionTab: false,
  setActionTab: () => {},
  customBg: false,
  setCustomBg: () => {},
});

export const BarControlsProvider = BarControlsContext.Provider;

/** Read (and change) how the demo's bar is currently configured. */
export function useBarControls(): BarControlsValue {
  return useContext(BarControlsContext);
}

/** Every count the switcher offers, e.g. `[1, 2, 3, 4, 5]`. */
export const TAB_COUNTS = Array.from(
  { length: MAX_TABS - MIN_TABS + 1 },
  (_, i) => MIN_TABS + i,
);

/**
 * `testID` for the button that switches to `n` tabs. Kept here so the app and
 * the Maestro flows can never drift apart.
 */
export const tabCountTestId = (n: number) => `tabcount-${n}`;
