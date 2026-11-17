import { useEffect } from "react";

export default function Toast({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2400);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex justify-center px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <div
        role="status"
        className="pointer-events-auto max-w-md animate-pop-in rounded-xl border border-line-strong bg-raised px-4 py-2.5 text-sm shadow-xl shadow-black/40 motion-reduce:animate-none"
      >
        {message}
      </div>
    </div>
  );
}
