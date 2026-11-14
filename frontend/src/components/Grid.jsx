import MemberRow from "./MemberRow";
import { VISIBLE_DAYS } from "../utils/calendar";
import { DAY_NAMES, isWorkday } from "../utils/dates";
import "../styles/Grid.css";

export default function Grid({ members, tasks, projectId, preview, onCellClick }) {
  if (!members.length) {
    return (
      <div className="planner-grid">
        <div className="empty-state">
          No team members yet. Add one to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="planner-grid">
      <div />
      {VISIBLE_DAYS.map((d) => (
        <div key={d.getTime()} className={`day-header${isWorkday(d) ? "" : " is-weekend"}`}>
          {DAY_NAMES[d.getDay()]}
          <span className="day-header__num">{d.getDate()}</span>
        </div>
      ))}
      <div className="day-header">Total</div>

      {members.map((m) => (
        <MemberRow
          key={m._id}
          member={m}
          tasks={tasks}
          projectId={projectId}
          preview={preview}
          onCellClick={onCellClick}
        />
      ))}
    </div>
  );
}