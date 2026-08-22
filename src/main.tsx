import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./chronoglyph.css";
import "./demo.css";
import PlaygroundPage from "./playground/PlaygroundPage";
import "./scenes.css";
import { siteRoute } from "./sitePath";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Chronoglyph could not find the #root element.");
}

const route = siteRoute(window.location.pathname);

createRoot(root).render(
  <StrictMode>
    {route === "/playground" ? <PlaygroundPage /> : <App />}
  </StrictMode>,
);
