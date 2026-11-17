export default function Avatar({ className = "size-8" }) {
  return (
    <div className={`shrink-0 overflow-hidden rounded-full ${className}`}>
      <svg viewBox="0 0 32 32" className="block size-full" aria-hidden="true">
        <rect width="32" height="32" fill="#3a3c43" />
        <circle cx="16" cy="12.5" r="5.2" fill="#8b8e97" />
        <path d="M3 32c0-7 6-12 13-12s13 5 13 12z" fill="#8b8e97" />
      </svg>
    </div>
  );
}
