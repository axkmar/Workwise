import { VISIBLE_DAYS } from "../utils/calendar";
import { formatShortDate } from "../utils/dates";
import "../styles/TopBar.css";

const first = VISIBLE_DAYS[0];
const last = VISIBLE_DAYS[VISIBLE_DAYS.length - 1];
const RANGE_TEXT = `${formatShortDate(first)} – ${formatShortDate(last)} ${last.getFullYear()}`;

export default function TopBar({ title, onAddMember, onAddTask, onToggleWhatIf }) {
  return (
    <div className="topbar">
      <h1 className="topbar__title">{title}</h1>
      <button className="btn" onClick={onAddMember}>+ Add member</button>
      <button className="btn" onClick={onAddTask}>+ Add task</button>
      <button className="btn btn--primary" onClick={onToggleWhatIf}>What-if check</button>
      <div className="topbar__range">{RANGE_TEXT}</div>
    </div>
  );
}
