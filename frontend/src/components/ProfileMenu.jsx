import { useEffect, useRef, useState } from "react";

const ICON = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" className="size-4 shrink-0" aria-hidden="true" {...ICON}>
    {children}
  </svg>
);

// Placeholder items: they only close the menu for now (no pages behind them yet).
const ITEMS = [
  { label: "Account", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" /></> },
  { label: "Settings", icon: <path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4" /> },
  { label: "Notifications", icon: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" /> },
  { label: "Help & support", icon: <><circle cx="12" cy="12" r="9.5" /><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01" /></> },
];

const ITEM =
  "flex w-full touch-manipulation items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent";

const MENU_WIDTH = 224; // w-56

/** Profile button for the sidebar corner. Opens a dropdown; the last item logs out. */
export default function ProfileMenu({ onLogout }) {
  const [anchor, setAnchor] = useState(null); // button rect while open, null while closed
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const close = () => setAnchor(null);

  // Close on a press outside (or Escape). The button counts as inside so its own click can toggle.
  useEffect(() => {
    if (!anchor) return;
    const onPress = (e) => {
      if (!menuRef.current?.contains(e.target) && !buttonRef.current?.contains(e.target)) close();
    };
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("pointerdown", onPress);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPress);
      document.removeEventListener("keydown", onKey);
    };
  }, [anchor]);

  const toggle = (e) => setAnchor((a) => (a ? null : e.currentTarget.getBoundingClientRect()));

  // fixed position, because the sidebar clips overflow
  const left = anchor ? Math.max(8, Math.min(window.innerWidth - MENU_WIDTH - 8, anchor.left)) : 0;
  const top = anchor ? anchor.bottom + 6 : 0;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-label="Profile menu"
        aria-haspopup="menu"
        aria-expanded={Boolean(anchor)}
        className="grid size-9 shrink-0 touch-manipulation place-items-center rounded-full border border-line bg-card text-soft transition-colors hover:border-line-strong hover:bg-raised hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <svg viewBox="0 0 24 24" className="size-[1.125rem]" aria-hidden="true" {...ICON}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
        </svg>
      </button>

      {anchor && (
        <div
          ref={menuRef}
          role="menu"
          style={{ left, top, width: MENU_WIDTH }}
          className="fixed z-40 animate-pop-in rounded-xl border border-line-strong bg-raised p-1.5 shadow-2xl shadow-black/50 motion-reduce:animate-none"
        >
          {ITEMS.map((item) => (
            <button key={item.label} type="button" role="menuitem" onClick={close} className={`${ITEM} text-soft hover:bg-card hover:text-ink`}>
              <Icon>{item.icon}</Icon>
              {item.label}
            </button>
          ))}

          <div role="separator" className="my-1.5 h-px bg-line" />

          <button type="button" role="menuitem" onClick={onLogout} className={`${ITEM} text-over-ink hover:bg-over/15`}>
            <Icon>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </Icon>
            Log out
          </button>
        </div>
      )}
    </>
  );
}
