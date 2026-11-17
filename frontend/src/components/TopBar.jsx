import Button from "./Button";
import { VISIBLE_DAYS } from "../utils/calendar";
import { formatShortDate } from "../utils/dates";

const first = VISIBLE_DAYS[0];
const last = VISIBLE_DAYS[VISIBLE_DAYS.length - 1];
const RANGE_TEXT = `${formatShortDate(first)} – ${formatShortDate(last)} ${last.getFullYear()}`;

export default function TopBar({ title, onAddMember, onAddTask, onToggleWhatIf }) {
  return (
    <header className="flex flex-wrap items-center gap-x-3 gap-y-2.5 border-b border-line px-3 py-3 short:py-1.5 sm:px-6">
      <h1 className="order-1 min-w-0 flex-1 truncate text-base font-semibold sm:flex-none sm:text-lg">{title}</h1>

      {/* phones: buttons drop to their own row; sm and up: title | buttons | date range */}
      <div className="order-3 flex w-full gap-2 sm:order-2 sm:w-auto">
        <Button onClick={onAddMember} className="flex-1 sm:flex-none">+ Add member</Button>
        <Button onClick={onAddTask} className="flex-1 sm:flex-none">+ Add task</Button>
        <Button variant="primary" onClick={onToggleWhatIf} className="flex-1 sm:flex-none">What-if check</Button>
      </div>

      <div className="order-2 text-xs text-muted sm:order-3 sm:ml-auto sm:text-sm">{RANGE_TEXT}</div>
    </header>
  );
}
