import { addDays, toKey } from "./dates";

export const VISIBLE_DAYS_COUNT = 14;

export const TODAY = (() => {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
})();

/** The 14 columns shown in the grid, starting today */
export const VISIBLE_DAYS = Array.from({ length: VISIBLE_DAYS_COUNT }, (_, i) => addDays(TODAY, i));

/** "YYYY-MM-DD" key for N days from today */
export const dateKeyFromToday = (n) => toKey(addDays(TODAY, n));
