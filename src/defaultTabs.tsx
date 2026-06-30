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
 * The tabs used when `<MagicTabs />` is rendered without a `tabs` prop:
 * Home, Explore, Notifications, Inbox and Profile, each with a matching Ionicon.
 *
 * Assumes the app has routes named `index` (`/`), `explore`, `notifications`,
 * `inbox` and `profile`. Pass your own `tabs` to `<MagicTabs />` to override.
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
