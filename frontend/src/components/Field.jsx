import "../styles/Field.css";

/** Labelled input or select. Pass `type="select"` with `options=[{value,label}]` for a dropdown. */
export default function Field({ label, type = "text", options, ...inputProps }) {
  return (
    <label className="field">
      {label}
      {type === "select" ? (
        <select {...inputProps}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input type={type} {...inputProps} />
      )}
    </label>
  );
}
