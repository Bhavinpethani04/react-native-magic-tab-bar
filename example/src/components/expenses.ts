import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

export type CategoryKey =
  | "food"
  | "shopping"
  | "transport"
  | "groceries"
  | "bills"
  | "fun"
  | "health"
  | "income";

/** Category metadata — icon + a distinct, vivid color for each. */
export const CATEGORY: Record<
  CategoryKey,
  { label: string; icon: IoniconName; color: string }
> = {
  food: { label: "Food & Dining", icon: "fast-food", color: "#FB923C" },
  shopping: { label: "Shopping", icon: "bag-handle", color: "#EC4899" },
  transport: { label: "Transport", icon: "car-sport", color: "#3B82F6" },
  groceries: { label: "Groceries", icon: "cart", color: "#22C55E" },
  bills: { label: "Bills & Utilities", icon: "receipt", color: "#F59E0B" },
  fun: { label: "Entertainment", icon: "game-controller", color: "#A855F7" },
  health: { label: "Health", icon: "fitness", color: "#EF4444" },
  income: { label: "Income", icon: "arrow-down-circle", color: "#16B364" },
};

export type Txn = {
  id: string;
  title: string;
  category: CategoryKey;
  amount: number; // negative = expense, positive = income
  time: string;
  account: string;
};

export type TxnGroup = { date: string; items: Txn[] };

export const GROUPS: TxnGroup[] = [
  {
    date: "Today",
    items: [
      { id: "1", title: "Blue Bottle Coffee", category: "food", amount: -8.5, time: "9:12 AM", account: "Visa •• 4291" },
      { id: "2", title: "Uber", category: "transport", amount: -16.4, time: "8:40 AM", account: "Apple Pay" },
      { id: "3", title: "Whole Foods Market", category: "groceries", amount: -62.18, time: "8:05 AM", account: "Visa •• 4291" },
    ],
  },
  {
    date: "Yesterday",
    items: [
      { id: "4", title: "Salary — Acme Inc.", category: "income", amount: 3200, time: "6:00 PM", account: "Chase Checking" },
      { id: "5", title: "Netflix", category: "fun", amount: -15.99, time: "2:15 PM", account: "Visa •• 4291" },
      { id: "6", title: "Zara", category: "shopping", amount: -89.0, time: "1:30 PM", account: "Amex •• 1008" },
      { id: "7", title: "Electricity bill", category: "bills", amount: -74.2, time: "10:02 AM", account: "Chase Checking" },
    ],
  },
  {
    date: "Mon, Jul 1",
    items: [
      { id: "8", title: "Pharmacy", category: "health", amount: -23.75, time: "5:48 PM", account: "Apple Pay" },
      { id: "9", title: "Lunch — Sweetgreen", category: "food", amount: -14.2, time: "12:30 PM", account: "Visa •• 4291" },
      { id: "10", title: "Spotify", category: "fun", amount: -10.99, time: "9:00 AM", account: "Visa •• 4291" },
    ],
  },
];

/** Flattened recent transactions (newest first) — handy for the Home preview. */
export const RECENT: Txn[] = GROUPS.flatMap((g) => g.items);
