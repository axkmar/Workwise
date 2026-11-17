const BASE =
  "inline-flex touch-manipulation select-none items-center whitespace-nowrap justify-center gap-2 rounded-lg border font-medium transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const VARIANTS = {
  default: "border-line bg-card text-ink hover:border-line-strong hover:bg-raised",
  primary: "border-accent bg-accent font-semibold text-on-accent hover:brightness-110",
  dashed: "border-dashed border-line-strong bg-transparent text-soft hover:border-accent hover:text-ink",
};

const SIZES = {
  md: "min-h-11 px-3 py-2 text-[0.8125rem] short:min-h-9 sm:px-4 sm:text-sm",
  sm: "min-h-9 px-3 py-1 text-xs",
};

export default function Button({ variant = "default", size = "md", className = "", type = "button", ...props }) {
  return <button type={type} className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`} {...props} />;
}
