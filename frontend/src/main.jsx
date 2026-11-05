import React from "react";
import { createRoot } from "react-dom/client";
import Root from "./Root";

import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/buttons.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
