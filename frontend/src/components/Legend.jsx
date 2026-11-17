const ITEMS = [
  ["bg-ok", "Up to 70% of hours"],
  ["bg-warn", "70-100%"],
  ["bg-over", "Over 100%"],
];

/** Colour key for the grid. The caller decides layout (row on small screens, column in the sidebar). */
export default function Legend({ className = "" }) {
  return (
    <div className={`text-xs text-muted ${className}`}>
      {ITEMS.map(([swatch, label]) => (
        <div key={label} className="flex items-center gap-2">
          <i className={`size-2.5 rounded-[3px] ${swatch}`} />
          {label}
        </div>
      ))}
    </div>
  );
}
