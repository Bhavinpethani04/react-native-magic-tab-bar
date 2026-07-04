import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import type { MagicTabConfig, MagicTabIconProps } from "./types";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

/**
 * Builds an icon renderer from a pair of Ionicons glyphs. The filled variant
 * is shown for the active tab and the outline variant for inactive tabs.
 */
const ionicon =
  (active: IoniconName, inactive: IoniconName) =>
  ({ focused, color, size }: MagicTabIconProps) => (
    <Ionicons name={focused ? active : inactive} color={color} size={size} />
  );

/**
 * A ready-made demo tab set — Home, Explore, Notifications, Inbox and Profile,
 * each with a matching Ionicon. Opt in via the subpath:
 * `import { defaultTabs } from 'react-native-magic-tab-bar/default-tabs'`.
 *
 * Requires `@expo/vector-icons` and assumes the app has routes named `index`
 * (`/`), `explore`, `notifications`, `inbox` and `profile`.
 */
export const defaultTabs: MagicTabConfig[] = [
  {
    name: "index",
    href: "/",
    label: "Home",
    icon: ionicon("home", "home-outline"),
  },
  {
    name: "explore",
    href: "/explore",
    label: "Explore",
    icon: ionicon("compass", "compass-outline"),
  },
  {
    name: "notifications",
    href: "/notifications",
    label: "Notifications",
    icon: ionicon("notifications", "notifications-outline"),
  },
  {
    name: "inbox",
    href: "/inbox",
    label: "Inbox",
    icon: ionicon("chatbubble-sharp", "chatbubble-outline"),
  },
  {
    name: "profile",
    href: "/profile",
    label: "Profile",
    icon: ionicon("person", "person-outline"),
  },
];
