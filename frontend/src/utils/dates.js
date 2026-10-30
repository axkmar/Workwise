// Pure date/number helpers. Dates are passed around as "YYYY-MM-DD" keys.

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const pad = (n) => String(n).padStart(2, "0");

/** Date -> "YYYY-MM-DD" (local time) */
export const toKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** "YYYY-MM-DD" -> local Date (no timezone drift) */
export const parseKey = (s) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

/** Sunday (0) and Saturday (6) are off */
export const isWorkday = (d) => d.getDay() % 6 !== 0;

export const formatShortDate = (d) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

/** 7.5 -> "7.5", 8 -> "8", 2.3333 -> "2.3" */
export const formatHours = (n) => String(Math.round(n * 10) / 10);

export const makeId = (prefix) =>
  prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
