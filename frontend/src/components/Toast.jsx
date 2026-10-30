import { useEffect } from "react";
import "../styles/Toast.css";

export default function Toast({ message, onDone }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2400);
    return () => clearTimeout(timer);
  }, [onDone]);

  return <div className="toast">{message}</div>;
}
