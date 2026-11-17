import Avatar from "./Avatar";
import Button from "./Button";
import Field from "./Field";
import { formatHours } from "../utils/dates";

const VERDICT_LABEL = { ok: "Has room", warn: "Tight", over: "Overloaded" };

const BADGE = {
  ok: "border-ok/50 bg-ok/15 text-ok-ink",
  warn: "border-warn/50 bg-warn/15 text-warn-ink",
  over: "border-over/50 bg-over/15 text-over-ink",
};

/* Phones: bottom sheet (the grid stays visible above it so hover/preview is useful).
   sm and up: panel sliding in from the right. */
export default function WhatIfPanel({ open, form, onFormChange, outcome, onHoverMember, onAssign, onClose }) {
  const set = (field) => (e) => onFormChange(field, e.target.value);

  return (
    <aside
      aria-hidden={!open}
      className={`fixed inset-x-0 bottom-0 z-30 flex h-[55dvh] flex-col gap-3 overflow-y-auto overscroll-contain rounded-t-2xl border-t border-line bg-side
        p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl shadow-black/50
        transition-[transform,visibility] duration-200 motion-reduce:transition-none
        sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-[22rem] sm:rounded-none sm:border-l sm:border-t-0
        sm:pr-[max(1rem,env(safe-area-inset-right))] sm:pt-[max(1rem,env(safe-area-inset-top))] ${
          open ? "visible translate-x-0 translate-y-0" : "invisible translate-y-full sm:translate-x-full sm:translate-y-0"
        }`}
    >
      <div className="mx-auto -mb-1 h-1 w-10 shrink-0 rounded-full bg-line-strong sm:hidden" />

      <h3 className="flex items-center justify-between text-base font-semibold">
        What-if check
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-mr-2 grid size-10 place-items-center rounded-lg text-2xl leading-none text-muted transition-colors hover:bg-card hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
        >
          ×
        </button>
      </h3>
      <div className="text-sm text-muted">Enter a piece of work to see who has room. Nothing is saved.</div>

      <Field label="Total hours" type="number" min="0" step="0.5" value={form.hours} onChange={set("hours")} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Start date" type="date" value={form.start} onChange={set("start")} />
        <Field label="Due date" type="date" value={form.due} onChange={set("due")} />
      </div>

      <div className="grid gap-2" onMouseLeave={() => onHoverMember(null)}>
        {outcome.message ? (
          <div className="text-sm text-muted">{outcome.message}</div>
        ) : (
          <>
            <div className="text-sm text-muted">
              {formatHours(outcome.extra)}h per working day over {outcome.dayKeys.length} day
              {outcome.dayKeys.length > 1 ? "s" : ""}. Hover a person to preview the grid.
            </div>
            {outcome.candidates.map(({ member, peak, free, verdict }) => (
              <div
                key={member._id}
                onMouseEnter={() => onHoverMember(member._id)}
                onClick={() => onHoverMember(member._id)}
                className="flex items-center gap-3 rounded-xl border border-line bg-card p-2.5 transition-colors hover:border-accent"
              >
                <Avatar />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{member.name}</div>
                  <small className="flex flex-wrap gap-x-3 text-xs text-muted">
                    <span>Peak {Math.round(peak * 100)}%</span>
                    <span>{formatHours(free)}h free</span>
                  </small>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className={`rounded-full border px-2 py-0.5 text-[0.6875rem] ${BADGE[verdict]}`}>
                    {VERDICT_LABEL[verdict]}
                  </span>
                  {verdict !== "over" && (
                    <Button size="sm" onClick={() => onAssign(member._id)}>
                      Assign
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </aside>
  );
}
