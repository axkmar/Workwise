// Workload maths. All functions are pure: pass in the tasks/members you want to use.
import { addDays, isWorkday, parseKey, toKey } from "./dates";

/** All Mon-Fri date keys between start and due, inclusive. [] for empty/invalid/reversed ranges. */
export function getWorkdays(startKey, endKey) {
  if (!startKey || !endKey) return [];
  const start = parseKey(startKey);
  const end = parseKey(endKey);
  if (isNaN(start) || isNaN(end) || end < start) return [];
  const out = [];
  for (let d = start, i = 0; d <= end && i < 3700; d = addDays(d, 1), i++) {
    if (isWorkday(d)) out.push(toKey(d));
  }
  return out;
}

const countCache = new Map();
export function countWorkdays(startKey, endKey) {
  const cacheKey = startKey + "|" + endKey;
  if (!countCache.has(cacheKey)) countCache.set(cacheKey, getWorkdays(startKey, endKey).length);
  return countCache.get(cacheKey);
}

/** Hours per working day for a task: totalHours spread evenly. 0 if the range has no working days. */
export function hoursPerDay(task) {
  const days = countWorkdays(task.startDate, task.dueDate);
  return days ? task.totalHours / days : 0;
}

/** Tasks of a member covering a date (ISO strings compare correctly), optionally for one project. */
export function tasksOnDay(tasks, memberId, dateKey, projectId) {
  return tasks.filter(
    (t) =>
      t.memberId === memberId &&
      (!projectId || t.projectId === projectId) &&
      t.startDate <= dateKey &&
      dateKey <= t.dueDate
  );
}

/** A member's load on a day = sum of each covering task's daily share. Weekends are always 0. */
export function loadOnDay(tasks, memberId, dateKey, projectId) {
  if (!isWorkday(parseKey(dateKey))) return 0;
  return tasksOnDay(tasks, memberId, dateKey, projectId).reduce((sum, t) => sum + hoursPerDay(t), 0);
}

/** "empty" | "ok" (<=70%) | "warn" (<=100%) | "over" (>100%). Epsilon avoids float edge errors. */
export function loadStatus(load, available) {
  if (load <= 1e-4) return "empty";
  const ratio = load / available;
  if (ratio <= 0.7 + 1e-9) return "ok";
  if (ratio <= 1 + 1e-9) return "warn";
  return "over";
}

/**
 * What-if check: spread hypothetical work over the working days, then rank members
 * by peak load. Returns { message } when input is invalid, otherwise { extra, dayKeys, candidates }.
 */
export function evaluateWhatIf(members, tasks, { hours, start, due }) {
  const hrs = parseFloat(hours);
  if (!(hrs > 0)) return { message: "Enter hours greater than 0." };
  if (!start || !due) return { message: "Pick a start and due date." };
  if (due < start) return { message: "Due date is before the start date." };

  const dayKeys = getWorkdays(start, due);
  if (!dayKeys.length) return { message: "That range has no working days (Mon-Fri)." };
  if (!members.length) return { message: "Add team members first." };

  const extra = hrs / dayKeys.length;

  const candidates = members
    .map((member) => {
      const available = member.dailyAvailableHours;
      const loads = dayKeys.map((d) => loadOnDay(tasks, member.id, d, null));
      const peak = Math.max(...loads.map((l) => (l + extra) / available));
      const free = loads.reduce((sum, l) => sum + Math.max(0, available - l), 0);
      // over = overloaded, warn = tight (hits 100%), ok = has room
      const verdict = peak > 1 + 1e-9 ? "over" : peak >= 0.995 ? "warn" : "ok";
      return { member, peak, free, verdict };
    })
    .sort((a, b) => a.peak - b.peak || b.free - a.free);

  return { extra, dayKeys, candidates };
}
