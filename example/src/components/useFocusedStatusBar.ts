import { useCallback } from "react";
import { StatusBar, type StatusBarStyle } from "react-native";
import { useFocusEffect } from "expo-router";

/**
 * Sets the status bar text style whenever the screen becomes focused.
 *
 * Tab screens stay mounted when you switch tabs, so the declarative
 * `<StatusBar>` stack can't tell which one is on top. Applying the style
 * imperatively on focus makes each tab own its status bar reliably — e.g.
 * "dark-content" for light screens, "light-content" for a full-screen dark one.
 */
export function useFocusedStatusBar(style: StatusBarStyle) {
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle(style, true);
    }, [style]),
  );
}
