import Avatar from "./Avatar";
import { loadOnDay, loadStatus } from "../utils/calc";
import { formatHours, isWorkday, toKey } from "../utils/dates";

// Full class names (not built from strings) so Tailwind can see them.
const TONE = {
  empty: "border-line bg-card text-muted",
  ok: "border-ok/40 bg-ok/15 text-ok-ink",
  warn: "border-warn/40 bg-warn/15 text-warn-ink",
  over: "border-over/45 bg-over/15 text-over-ink",
};

const HOVER = {
  empty: "hover:border-line-strong hover:bg-raised",
  ok: "hover:bg-ok/25",
  warn: "hover:bg-warn/25",
  over: "hover:bg-over/25",
};

const CELL =
  "flex min-h-12 w-full short:min-h-10 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-lg border px-0.5 py-1 " +
  "text-center tabular-nums transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const PREVIEW = "outline-2 -outline-offset-2 outline-dashed outline-accent";

/** One grid row: member name, one cell per visible day, total for the visible range. Rendered as a fragment so it sits in the parent grid. */
export default function MemberRow({ member, days, tasks, projectId, preview, onCellClick }) {
  const available = member.hoursPerDay;
  const activePreview = preview && preview.memberId === member._id ? preview : null;

  let totalLoad = 0;
  let totalAvailable = 0;

  const cells = days.map((day) => {
    const dateKey = toKey(day);
    if (!isWorkday(day)) {
      return <div key={dateKey} className="min-h-12 rounded-lg border border-dashed border-line/60 opacity-50" />;
    }

    let load = loadOnDay(tasks, member._id, dateKey, projectId);
    const isPreview = activePreview && activePreview.dayKeys.has(dateKey);
    if (isPreview) load += activePreview.extra;

    totalLoad += load;
    totalAvailable += available;

    const status = loadStatus(load, available);
    return (
      <button
        key={dateKey}
        type="button"
        className={`${CELL} ${TONE[status]} ${HOVER[status]} ${isPreview ? PREVIEW : ""}`}
        onClick={(e) => onCellClick(member._id, dateKey, e.currentTarget.getBoundingClientRect())}
      >
        {status === "empty" ? (
          "–"
        ) : (
          <>
            <span className="text-sm font-semibold leading-none">{formatHours(load)}h</span>
            <span className="text-[0.6875rem] leading-none opacity-70">/ {formatHours(available)}h</span>
          </>
        )}
      </button>
    );
  });

  const ratio = totalAvailable ? totalLoad / totalAvailable : 0;
  const totalStatus = loadStatus(totalLoad, totalAvailable || 1);

  return (
    <>
      {/* sticky: the name stays visible while the days scroll sideways */}
      <div className="sticky left-0 z-10 flex min-h-12 min-w-0 items-center gap-2.5 rounded-xl border border-line bg-card px-2.5 py-1.5 shadow-[0.25rem_0_0_var(--color-bg)] sm:px-3">
        <Avatar className="hidden size-8 sm:block" />
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{member.name}</div>
          <small className="block text-[0.6875rem] text-muted">{formatHours(available)}h / day</small>
        </div>
      </div>
      {cells}
      <div
        className={`flex min-h-12 items-center justify-center rounded-lg border text-sm font-semibold tabular-nums ${TONE[totalStatus]}`}
      >
        {Math.round(ratio * 100)}%
      </div>
    </>
  );
}
