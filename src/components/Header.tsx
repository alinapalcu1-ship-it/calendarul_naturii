import { useAudioPlayer } from "../hooks/useAudioPlayer";
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
  const { musicOn, toggleMusic } = useAudioPlayer();
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
        <button className="settings-button" aria-label={musicOn ? "Oprește muzica" : "Pornește muzica"} aria-pressed={musicOn} onClick={toggleMusic}>
          <span aria-hidden="true">♫</span> Muzică: {musicOn ? "pornită" : "oprită"}
        </button>
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
