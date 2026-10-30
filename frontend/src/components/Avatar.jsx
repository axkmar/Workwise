import "../styles/Avatar.css";

export default function Avatar() {
  return (
    <div className="avatar">
      <svg viewBox="0 0 32 32" width="32" height="32">
        <rect width="32" height="32" fill="#3a3c43" />
        <circle cx="16" cy="12.5" r="5.2" fill="#8b8e97" />
        <path d="M3 32c0-7 6-12 13-12s13 5 13 12z" fill="#8b8e97" />
      </svg>
    </div>
  );
}
