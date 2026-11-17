import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { hoursPerDay } from "../utils/calc";
import { formatHours, formatShortDate, parseKey } from "../utils/dates";

/** Shows a member's tasks for one day, positioned under (or above) the clicked cell. */
export default function Popover({ member, dateKey, tasks, projects, anchor, onClose }) {
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
      className="fixed z-40 max-h-[60dvh] w-64 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-xl border border-line-strong bg-raised p-3 shadow-2xl shadow-black/50"
    >
      <h4 className="mb-1 flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
        {member.name}
        <span className="text-xs font-normal text-muted">{formatShortDate(parseKey(dateKey))}</span>
      </h4>

      {tasks.length ? (
        tasks.map((t) => {
          const project = projects.find((p) => p._id === t.projectId) || {};
          return (
            <div className="flex items-center gap-2.5 border-t border-line py-2 text-sm" key={t._id}>
              <i
                className="size-2 shrink-0 rounded-full bg-muted"
                style={{ background: project.color || project.colour || undefined }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate">{t.title}</div>
                <small className="block truncate text-xs text-muted">{project.name || ""}</small>
              </div>
              <span className="shrink-0 tabular-nums text-muted">{formatHours(hoursPerDay(t))}h</span>
            </div>
          );
        })
      ) : (
        <small className="text-xs text-muted">No tasks on this day.</small>
      )}
    </div>
  );
}
