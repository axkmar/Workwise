// Task constants shared by the modal, popover and calc. Full class names so Tailwind can see them.

export const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

export const STATUSES = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "in_review", label: "In review" },
  { value: "completed", label: "Completed" },
];

export const PRIORITY_TONE = {
  low: "border-line text-muted",
  medium: "border-accent/40 bg-accent/10 text-accent",
  high: "border-warn/40 bg-warn/15 text-warn-ink",
  critical: "border-over/45 bg-over/15 text-over-ink",
};

export const labelOf = (list, value) => list.find((x) => x.value === value)?.label ?? value;

// Old tasks saved before these fields existed come back with defaults from the backend,
// but fall back here too so the UI never breaks.
export const priorityOf = (t) => t.priority || "medium";
export const statusOf = (t) => t.status || "todo";
export const isCompleted = (t) => statusOf(t) === "completed";
