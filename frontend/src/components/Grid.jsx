import MemberRow from "./MemberRow";
import { DAY_NAMES, isWorkday, toKey } from "../utils/dates";

// name column | one column per visible day | total column (the column template is set inline, see below)
const GRID =
  "grid w-max min-w-full gap-1 " +
  "[--name-col:7rem] sm:[--name-col:10rem] lg:[--name-col:11rem] " +
  "[--day-min:3.25rem] [--total-col:3.5rem]";

const HEADER = "sticky top-0 z-20 bg-bg pb-2 pt-3 shadow-[0_1px_0_var(--color-line)]";

export default function Grid({ members, days, tasks, projectId, preview, onCellClick }) {
  if (!members.length) {
    return (
      <div className="grid min-h-[50dvh] place-items-center px-4 text-center">
        <div className="max-w-xs">
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl border border-line bg-card text-muted">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="8" r="3.2" />
              <path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" />
              <path d="M17 5.5v5M14.5 8h5" />
            </svg>
          </div>
          <p className="text-base font-medium">No team members yet</p>
          <p className="mt-1 text-sm text-muted">Add one to get started.</p>
        </div>
      </div>
    );
  }

  const todayKey = toKey(new Date());

  return (
    <div
      className={GRID}
      style={{ gridTemplateColumns: `var(--name-col) repeat(${days.length}, minmax(var(--day-min), 1fr)) var(--total-col)` }}
    >
      <div className={`${HEADER} left-0 z-30`} />
      {days.map((d) => {
        const work = isWorkday(d);
        const today = toKey(d) === todayKey;
        return (
          <div
            key={d.getTime()}
            className={`${HEADER} flex flex-col items-center gap-1 text-xs ${work ? "text-muted" : "text-muted/40"}`}
          >
            {DAY_NAMES[d.getDay()]}
            <span
              className={`rounded-full px-1.5 text-sm font-semibold tabular-nums ${
                today ? "bg-accent text-on-accent" : work ? "text-ink" : "text-ink/40"
              }`}
            >
              {d.getDate()}
            </span>
          </div>
        );
      })}
      <div className={`${HEADER} text-center text-xs text-muted`}>Total</div>

      {members.map((m) => (
        <MemberRow
          key={m._id}
          member={m}
          days={days}
          tasks={tasks}
          projectId={projectId}
          preview={preview}
          onCellClick={onCellClick}
        />
      ))}
    </div>
  );
}
