import Button from "./Button";
import { VIEWS, rangeLabel } from "../utils/calendar";
import { toKey } from "../utils/dates";

/** Prev / Today / Next, a date picker, the Week | 2 weeks | Month switch, and the visible range. */
export default function CalendarControls({ days, anchor, view, onViewChange, onPrev, onNext, onToday, onPickDate }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-3 short:py-1.5 sm:px-6">
      <div className="flex items-center gap-1.5">
        <Button size="sm" onClick={onPrev} aria-label="Previous period">‹</Button>
        <Button size="sm" onClick={onToday}>Today</Button>
        <Button size="sm" onClick={onNext} aria-label="Next period">›</Button>
      </div>

      <input
        type="date"
        aria-label="Jump to date"
        value={toKey(anchor)}
        onChange={(e) => e.target.value && onPickDate(e.target.value)}
        className="min-h-9 rounded-lg border border-line bg-bg px-2 text-xs text-ink [color-scheme:dark] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div role="group" aria-label="View" className="flex overflow-hidden rounded-lg border border-line">
        {VIEWS.map((v) => (
          <button
            key={v.value}
            type="button"
            aria-pressed={view === v.value}
            onClick={() => onViewChange(v.value)}
            className={`min-h-9 touch-manipulation px-3 text-xs transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
              view === v.value ? "bg-raised font-semibold text-ink" : "bg-card text-muted hover:bg-hover"
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="ml-auto text-xs text-muted sm:text-sm">{rangeLabel(days)}</div>
    </div>
  );
}
