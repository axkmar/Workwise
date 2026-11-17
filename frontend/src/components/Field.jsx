const CONTROL =
  "w-full min-w-0 min-h-11 rounded-lg border border-line bg-bg text-base text-ink [color-scheme:dark] " +
  "[&::-webkit-date-and-time-value]:text-left placeholder:text-muted/60 " +
  "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

/** Labelled input or select. Pass `type="select"` with `options=[{value,label}]` for a dropdown. */
export default function Field({ label, type = "text", options, className = "", ...inputProps }) {
  return (
    <label className={`flex min-w-0 flex-col gap-1.5 text-xs font-medium text-muted ${className}`}>
      {label}
      {type === "select" ? (
        <select className={`${CONTROL} px-3 py-2`} {...inputProps}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className={`${CONTROL} ${type === "color" ? "h-11 cursor-pointer p-1" : "px-3 py-2"}`}
          {...inputProps}
        />
      )}
    </label>
  );
}
