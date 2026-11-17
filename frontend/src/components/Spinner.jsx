export default function Spinner({ className = "size-5 border-line border-t-accent" }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 motion-reduce:animate-none ${className}`}
    />
  );
}
