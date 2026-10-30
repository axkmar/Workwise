import MemberRow from "./MemberRow";
import { VISIBLE_DAYS } from "../utils/calendar";
import { DAY_NAMES, isWorkday } from "../utils/dates";
import "../styles/Grid.css";

export default function Grid({ members, tasks, projectId, preview, onCellClick }) {
  // When a project is selected, only show members who have tasks on it
  const visibleMembers = members.filter(
    (m) => !projectId || tasks.some((t) => t.memberId === m.id && t.projectId === projectId)
  );

  if (!visibleMembers.length) {
    return (
      <div className="planner-grid">
        <div className="empty-state">
          {members.length
            ? "No members have tasks on this project yet."
            : "No team members yet. Add one to get started."}
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

      {visibleMembers.map((m) => (
        <MemberRow
          key={m.id}
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
