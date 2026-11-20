import { addDays, parseKey, toKey } from "./dates";

export const VIEWS = [
  { value: "week", label: "Week" },
  { value: "twoWeek", label: "2 weeks" },
  { value: "month", label: "Month" },
];

/** Today at 00:00 (fresh each call, so a tab left open overnight still gets the right day) */
export const today = () => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
};

/** "YYYY-MM-DD" key for N days from today */
export const dateKeyFromToday = (n) => toKey(addDays(today(), n));

/** Monday of the week containing d */
export const startOfWeek = (d) => addDays(d, -((d.getDay() + 6) % 7));

/** The day columns for a view. Week views start on Monday; month view is the 1st to the last day. */
export function getVisibleDays(anchor, view) {
  if (view === "month") {
    const y = anchor.getFullYear();
    const m = anchor.getMonth();
    const count = new Date(y, m + 1, 0).getDate();
    return Array.from({ length: count }, (_, i) => new Date(y, m, i + 1));
  }
  const length = view === "week" ? 7 : 14;
  const start = startOfWeek(anchor);
  return Array.from({ length }, (_, i) => addDays(start, i));
}

/** Move the anchor one step (dir = -1 or +1). Months jump from the 1st, so Jan 31 + 1 month can't overflow. */
export function shiftAnchor(anchor, view, dir) {
  if (view === "month") return new Date(anchor.getFullYear(), anchor.getMonth() + dir, 1);
  return addDays(anchor, dir * (view === "week" ? 7 : 14));
}

/** "10 Nov – 23 Nov 2026" */
export function rangeLabel(days) {
  const fmt = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  const first = days[0];
  const last = days[days.length - 1];
  return `${fmt(first)} – ${fmt(last)} ${last.getFullYear()}`;
}

export { parseKey };
