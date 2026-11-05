import { useState } from "react";
import App from "./App";
import LoginPage from "./pages/LoginPage";

export default function Root() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) return <LoginPage onLogin={handleLogin} />;
  return <App token={token} onLogout={handleLogout} />;
}