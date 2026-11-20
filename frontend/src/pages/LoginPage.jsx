import { useState } from "react";
import Button from "../components/Button";
import Field from "../components/Field";
import "./LoginPage.css";

const API = import.meta.env.VITE_API_URL;

/** Login + signup in one card. Calls onLogin(token, user) when the server accepts it. */
export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";

  const switchMode = (next) => {
    setMode(next);
    setError("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));

    if (isSignup && !values.name.trim()) return setError("Enter your name.");
    if (!values.email.trim()) return setError("Enter your email.");
    if (!values.password) return setError("Enter your password.");
    // the backend schema requires 10-30 characters when creating an account
    if (isSignup && (values.password.length < 10 || values.password.length > 30))
      return setError("Password must be 10 to 30 characters.");

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/v1/users/${isSignup ? "signup" : "signin"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({})); // a server crash can return HTML, not JSON
      if (!res.ok || !data.token) throw new Error(data.message || "Something went wrong.");
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth">
      <form className="auth__card" onSubmit={handleSubmit} noValidate>
        <div className="auth__brand">
          ▦ Work<span>Wise</span>
        </div>
        <p className="auth__subtitle">
          {isSignup ? "Create an account to plan your team's workload." : "Log in to see your team's workload."}
        </p>

        <div className="auth__tabs">
          <button type="button" className={`auth__tab${!isSignup ? " is-active" : ""}`} onClick={() => switchMode("login")}>
            Log in
          </button>
          <button type="button" className={`auth__tab${isSignup ? " is-active" : ""}`} onClick={() => switchMode("signup")}>
            Sign up
          </button>
        </div>

        {isSignup && <Field label="Name" name="name" type="text" autoComplete="name" />}
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete={isSignup ? "new-password" : "current-password"}
        />

        {error && (
          <div role="alert" className="auth__error">
            {error}
          </div>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? "Please wait..." : isSignup ? "Create account" : "Log in"}
        </Button>
      </form>
    </div>
  );
}
