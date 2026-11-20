import Button from "./Button";

export default function TopBar({ title, onAddMember, onAddTask, onToggleWhatIf}) {
  return (
    <header className="flex flex-wrap items-center gap-x-3 gap-y-2.5 border-b border-line px-3 py-3 short:py-1.5 sm:px-6">
      <h1 className="order-1 min-w-0 flex-1 truncate text-base font-semibold sm:text-lg">{title}</h1>

      {/* phones: buttons drop to their own row; sm and up: title | buttons */}
      <div className="order-2 flex w-full gap-2 sm:w-auto">
        <Button onClick={onAddMember} className="flex-1 sm:flex-none">+ Add member</Button>
        <Button onClick={onAddTask} className="flex-1 sm:flex-none">+ Add task</Button>
        <Button variant="primary" onClick={onToggleWhatIf} className="flex-1 sm:flex-none">What-if check</Button>
      </div>
    </header>
  );
}
