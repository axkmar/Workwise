import { useState } from "react";
import Field from "../Field";
import "../../styles/Modal.css";

/**
 * Generic form dialog.
 * fields: [{ name, label, type, defaultValue, options, min, max, step }]
 * onSubmit(values) -> return an error string to keep the dialog open, or nothing to close it.
 */
export default function FormModal({ title, fields, submitLabel, onSubmit, onClose }) {
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = onSubmit(Object.fromEntries(new FormData(e.currentTarget)));
    if (err) setError(err);
    else onClose();
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="modal" noValidate onSubmit={handleSubmit}>
        <h2 className="modal__title">{title}</h2>

        {fields.map(({ name, ...rest }, i) => (
          <Field key={name} name={name} autoFocus={i === 0} {...rest} />
        ))}

        <div className="modal__error">{error}</div>
        <div className="modal__actions">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary">{submitLabel}</button>
        </div>
      </form>
    </div>
  );
}
