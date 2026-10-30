import "../styles/Sidebar.css";

function ProjectItem({ name, colour, count, active, onClick }) {
  return (
    <div className={`project-item${active ? " is-active" : ""}`} onClick={onClick}>
      <span className="project-item__dot" style={colour ? { background: colour } : undefined} />
      <span className="project-item__name">{name}</span>
      <span className="project-item__count">{count}</span>
    </div>
  );
}

export default function Sidebar({ projects, tasks, selectedProjectId, onSelect, onAddProject }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        ▦ Work<span>Wise</span>
      </div>

      <div className="sidebar__label">Projects</div>
      <div>
        <ProjectItem
          name="All projects"
          count={tasks.length}
          active={selectedProjectId === null}
          onClick={() => onSelect(null)}
        />
        {projects.map((p) => (
          <ProjectItem
            key={p.id}
            name={p.name}
            colour={p.colour}
            count={tasks.filter((t) => t.projectId === p.id).length}
            active={selectedProjectId === p.id}
            onClick={() => onSelect(p.id)}
          />
        ))}
      </div>

      <button className="btn btn--block" onClick={onAddProject}>
        + Add project
      </button>

      <div className="legend">
        <div><i className="legend__swatch legend__swatch--ok" />Up to 70% of hours</div>
        <div><i className="legend__swatch legend__swatch--warn" />70-100%</div>
        <div><i className="legend__swatch legend__swatch--over" />Over 100%</div>
      </div>
    </aside>
  );
}
