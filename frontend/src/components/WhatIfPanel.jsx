import Avatar from "./Avatar";
import Field from "./Field";
import { formatHours } from "../utils/dates";
import "../styles/WhatIfPanel.css";

const VERDICT_LABEL = { ok: "Has room", warn: "Tight", over: "Overloaded" };

export default function WhatIfPanel({ open, form, onFormChange, outcome, onHoverMember, onAssign, onClose }) {
  const set = (field) => (e) => onFormChange(field, e.target.value);

  return (
    <div className={`whatif${open ? " is-open" : ""}`}>
      <h3 className="whatif__header">
        What-if check
        <button className="whatif__close" onClick={onClose} aria-label="Close">×</button>
      </h3>
      <div className="hint-text">Enter a piece of work to see who has room. Nothing is saved.</div>

      <Field label="Total hours" type="number" min="0" step="0.5" value={form.hours} onChange={set("hours")} />
      <Field label="Start date" type="date" value={form.start} onChange={set("start")} />
      <Field label="Due date" type="date" value={form.due} onChange={set("due")} />

      <div className="whatif__results" onMouseLeave={() => onHoverMember(null)}>
        {outcome.message ? (
          <div className="hint-text">{outcome.message}</div>
        ) : (
          <>
            <div className="hint-text">
              {formatHours(outcome.extra)}h per working day over {outcome.dayKeys.length} day
              {outcome.dayKeys.length > 1 ? "s" : ""}. Hover a person to preview the grid.
            </div>
            {outcome.candidates.map(({ member, peak, free, verdict }) => (
              <div className="candidate" key={member.id} onMouseEnter={() => onHoverMember(member.id)}>
                <Avatar />
                <div className="candidate__info">
                  <div className="candidate__name">{member.name}</div>
                  <small className="candidate__meta">
                    Peak {Math.round(peak * 100)}% · {formatHours(free)}h free
                  </small>
                </div>
                <span className={`badge badge--${verdict}`}>{VERDICT_LABEL[verdict]}</span>
                {verdict !== "over" && (
                  <button className="btn btn--small" onClick={() => onAssign(member.id)}>
                    Assign
                  </button>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
