import Avatar from "./Avatar";
import { VISIBLE_DAYS } from "../utils/calendar";
import { loadOnDay, loadStatus } from "../utils/calc";
import { formatHours, isWorkday, toKey } from "../utils/dates";

/** One grid row: member name, 14 day cells, weekly total. Rendered as a fragment so it sits in the parent grid. */
export default function MemberRow({ member, tasks, projectId, preview, onCellClick }) {
  const available = member.dailyAvailableHours;
  const activePreview = preview && preview.memberId === member.id ? preview : null;

  let totalLoad = 0;
  let totalAvailable = 0;

  const cells = VISIBLE_DAYS.map((day) => {
    const dateKey = toKey(day);
    if (!isWorkday(day)) return <div key={dateKey} className="cell cell--off" />;

    let load = loadOnDay(tasks, member.id, dateKey, projectId);
    const isPreview = activePreview && activePreview.dayKeys.has(dateKey);
    if (isPreview) load += activePreview.extra;

    totalLoad += load;
    totalAvailable += available;

    const status = loadStatus(load, available);
    return (
      <div
        key={dateKey}
        className={`cell cell--${status}${isPreview ? " cell--preview" : ""}`}
        onClick={(e) => onCellClick(member.id, dateKey, e.currentTarget.getBoundingClientRect())}
      >
        {status === "empty" ? "–" : `${formatHours(load)}h / ${formatHours(available)}h`}
      </div>
    );
  });

  const ratio = totalAvailable ? totalLoad / totalAvailable : 0;
  const totalStatus = loadStatus(totalLoad, totalAvailable || 1);

  return (
    <>
      <div className="member-cell">
        <Avatar />
        <div className="member-cell__name">
          {member.name}
          <small className="member-cell__hours">{formatHours(available)}h / day</small>
        </div>
      </div>
      {cells}
      <div className={`cell cell--total cell--${totalStatus}`}>{Math.round(ratio * 100)}%</div>
    </>
  );
}
