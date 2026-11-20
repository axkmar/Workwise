import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { hoursPerDay } from "../utils/calc";
import { formatHours, formatShortDate, parseKey } from "../utils/dates";
import { PRIORITIES, PRIORITY_TONE, STATUSES, isCompleted, labelOf, priorityOf, statusOf } from "../utils/task";

/** Shows a member's tasks for one day, positioned under (or above) the clicked cell. Click a task to edit it. */
export default function Popover({ member, dateKey, tasks, projects, anchor, onClose, onEditTask }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ left: 0, top: 0 });

  // Measure after render, before paint, then place within the viewport
  useLayoutEffect(() => {
    const el = ref.current;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const left = Math.max(8, Math.min(window.innerWidth - w - 8, anchor.left + anchor.width / 2 - w / 2));
    const top =
      anchor.bottom + h + 12 > window.innerHeight ? Math.max(8, anchor.top - h - 6) : anchor.bottom + 6;
    setPos({ left, top });
  }, [anchor]);

  // Close on any press outside (pointerdown also fires for touch, mousedown doesn't on iOS) or on Escape.
  // The press that opened it has already finished, so it can't close it.
  useEffect(() => {
    const onPress = (e) => {
      if (!ref.current?.contains(e.target)) onClose();
    };
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onPress);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPress);
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label={`${member.name}, tasks`}
      style={{ left: pos.left, top: pos.top }}
      className="fixed z-40 max-h-[60dvh] w-72 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-xl border border-line-strong bg-raised p-3 shadow-2xl shadow-black/50"
    >
      <h4 className="mb-1 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
        {member.name}
        <span className="text-xs font-normal text-muted">{formatShortDate(parseKey(dateKey))}</span>
      </h4>

      {tasks.length ? (
        tasks.map((t) => {
          const project = projects.find((p) => p._id === t.projectId) || {};
          const done = isCompleted(t);
          const priority = priorityOf(t);
          return (
            <button
              type="button"
              key={t._id}
              onClick={() => onEditTask(t)}
              title="Edit task"
              className={`flex w-full items-start gap-2.5 border-t border-line py-2 text-left text-sm transition-colors hover:bg-card focus-visible:outline-2 focus-visible:outline-accent ${
                done ? "opacity-60" : ""
              }`}
            >
              <i
                className="mt-1.5 size-2 shrink-0 rounded-full bg-muted"
                style={{ background: project.color || project.colour || undefined }}
              />
              <div className="min-w-0 flex-1">
                <div className={`truncate ${done ? "line-through" : ""}`}>
                  {done && <span aria-hidden="true">✓ </span>}
                  {t.title}
                </div>
                <small className="block truncate text-xs text-muted">{project.name || ""}</small>
                {t.description && <small className="mt-0.5 line-clamp-2 block text-xs text-soft">{t.description}</small>}
                <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[0.6875rem]">
                  <span className={`rounded-full border px-1.5 py-px ${PRIORITY_TONE[priority]}`}>
                    {labelOf(PRIORITIES, priority)}
                  </span>
                  <span className="rounded-full border border-line px-1.5 py-px text-muted">
                    {labelOf(STATUSES, statusOf(t))}
                  </span>
                  <span className="tabular-nums text-muted">
                    Est {formatHours(t.estTime)}h · Actual {formatHours(t.actualTime ?? 0)}h
                  </span>
                </div>
              </div>
              <span className="shrink-0 tabular-nums text-muted">{done ? "–" : `${formatHours(hoursPerDay(t))}h`}</span>
            </button>
          );
        })
      ) : (
        <small className="text-xs text-muted">No tasks on this day.</small>
      )}
    </div>
  );
}
