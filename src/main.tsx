import { LanguageProvider } from "./i18n/LanguageContext";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AudioProvider } from "./components/AudioProvider";
import "./styles.css";
import "./refinements.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider><AudioProvider><App /></AudioProvider></LanguageProvider>
  </React.StrictMode>,
);
import "./clothing.css";
import "./visual-polish.css";
