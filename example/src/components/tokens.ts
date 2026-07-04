/**
 * Shared design tokens for the example expense app — a clean fintech palette
 * with a single indigo accent and green/red for income vs. expense.
 */
export const tokens = {
  bg: "#F6F7F9",
  card: "#FFFFFF",
  border: "#ECEDF1",
  ink: "#15161B",
  sub: "#4B4F58",
  muted: "#8A8F99",
  accent: "#2563EB",
  accentSoft: "#E8EEFD",
  green: "#16B364",
  red: "#F04438",
} as const;

/** Format a signed number as currency, e.g. -8.5 -> "-$8.50". */
export const money = (n: number) => {
  const s = Math.abs(n)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${n < 0 ? "-" : ""}$${s}`;
};
