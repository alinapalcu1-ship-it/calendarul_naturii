import { Icon } from "./Icon";
import type { Page } from "../types";
export function Header({
  page,
  navigate,
  fullscreen,
  toggleFullscreen,
}: {
  page: Page;
  navigate: (p: Page) => void;
  fullscreen: boolean;
  toggleFullscreen: () => void;
}) {
  return (
    <header className="header">
      <button
        className="brand"
        onClick={() => navigate("home")}
        aria-label="Acasă – Calendarul naturii"
      >
        <span className="brand-mark">
          <Icon name="Primăvara" size={33} />
        </span>
        <span>
          Calendarul naturii<small>Întâlnirea de dimineață</small>
        </span>
      </button>
      <div className="header-actions">
        {page !== "home" && (
          <button
            className="icon-button"
            aria-label="Acasă"
            onClick={() => navigate("home")}
          >
            <Icon name="home" />
          </button>
        )}
        <button
          className="icon-button"
          aria-label={fullscreen ? "Ieși din ecran complet" : "Ecran complet"}
          onClick={toggleFullscreen}
        >
          <Icon name={fullscreen ? "exit" : "fullscreen"} />
        </button>
        <button
          className="settings-button"
          aria-label="Setări educatoare"
          onClick={() => navigate("settings")}
        >
          <Icon name="settings" size={23} />
          <span>Setări educatoare</span>
        </button>
      </div>
    </header>
  );
}
