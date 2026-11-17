
import Button from "./Button";
import Legend from "./Legend";

function ProjectItem({ name, colour, count, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-max max-w-52 shrink-0 touch-manipulation items-center gap-2 whitespace-nowrap rounded-full border px-3 py-2 text-sm transition-colors short:py-1
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
        lg:w-full lg:max-w-none lg:rounded-lg lg:border-transparent ${
          active
            ? "border-accent/60 bg-raised text-ink"
            : "border-line bg-card text-soft hover:bg-raised lg:bg-transparent lg:hover:bg-hover"
        }`}
    >
      <span
        className="size-2.5 shrink-0 rounded-full bg-muted"
        style={colour ? { background: colour } : undefined}
      />

      <span className="min-w-0 truncate lg:max-w-none">
        {name}
      </span>

      <span className="ml-1 shrink-0 text-xs tabular-nums text-muted lg:ml-auto">
        {count}
      </span>
    </button>
  );
}

export default function Sidebar({
  projects,
  tasks,
  selectedProjectId,
  onSelect,
  onAddProject,
}) {
  return (
    <aside
      className="flex w-full min-w-0 shrink-0 items-center gap-2 overflow-hidden border-b border-line bg-side px-3 py-2.5 short:py-1.5
        lg:h-full lg:w-60 lg:flex-col lg:items-stretch lg:gap-1 lg:border-b-0 lg:border-r lg:px-3 lg:py-5
        xl:w-64"
    >
      {/* Brand */}
      <div className="shrink-0 pr-1 text-[0.9375rem] font-semibold lg:px-3 lg:pb-4 lg:pr-3">
        ▦ Work<span className="text-accent">Wise</span>
      </div>

      {/* Desktop heading */}
      <div className="hidden px-3 pb-1 pt-2 text-xs font-medium text-muted lg:block">
        Projects
      </div>

      {/* Only the project list scrolls */}
      <div
        className="min-w-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain
          lg:min-h-0 lg:w-full lg:overflow-x-hidden lg:overflow-y-auto"
      >
        <div className="flex w-max min-w-max flex-nowrap gap-2 lg:w-full lg:min-w-0 lg:flex-col lg:gap-0.5">
          <ProjectItem
            name="All projects"
            count={tasks.length}
            active={selectedProjectId === null}
            onClick={() => onSelect(null)}
          />

          {projects.map((p) => (
            <ProjectItem
              key={p._id}
              name={p.name}
              colour={p.color}
              count={tasks.filter((t) => t.projectId === p._id).length}
              active={selectedProjectId === p._id}
              onClick={() => onSelect(p._id)}
            />
          ))}
        </div>
      </div>

      {/* Add project */}
      <Button
        variant="dashed"
        onClick={onAddProject}
        className="min-h-10! shrink-0 whitespace-nowrap rounded-full lg:mt-2 lg:w-full lg:justify-start lg:rounded-lg"
      >
        + Add project
      </Button>

      <Legend className="mt-auto hidden shrink-0 gap-2 p-3 lg:flex lg:flex-col" />
    </aside>
  );
}
