import "./styles/globals.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { initSentry } from "@/shared/lib/sentry.ts";

import App from "./app/App.tsx";

initSentry();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
