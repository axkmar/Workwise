import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { hoursPerDay } from "../utils/calc";
import { formatHours, formatShortDate, parseKey } from "../utils/dates";
import "../styles/Popover.css";

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

  // Close on any mouse press outside. (mousedown, not click, so the click that opened it doesn't close it.)
  useEffect(() => {
    const handle = (e) => {
      if (!ref.current?.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  return (
    <div className="popover" ref={ref} style={{ left: pos.left, top: pos.top }}>
      <h4 className="popover__title">
        {member.name} · {formatShortDate(parseKey(dateKey))}
      </h4>

      {tasks.length ? (
        tasks.map((t) => {
          const project = projects.find((p) => p.id === t.projectId) || {};
          return (
            <div className="popover__row" key={t.id}>
              <i className="popover__dot" style={{ background: project.colour || "#888" }} />
              <div>
                {t.title}
                <br />
                <small className="popover__muted">{project.name || ""}</small>
              </div>
              <span className="popover__hours">{formatHours(hoursPerDay(t))}h</span>
            </div>
          );
        })
      ) : (
        <small className="popover__muted">No tasks on this day.</small>
      )}
    </div>
  );
}
