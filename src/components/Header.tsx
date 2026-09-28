import { useLanguage } from "../i18n/LanguageContext";
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
  const { t, language, setLanguage } = useLanguage();
  const { musicOn, toggleMusic } = useAudioPlayer();
  return (
    <header className="header">
      <button
        className="brand"
        onClick={() => navigate("home")}
        aria-label={t("Acasă – Calendarul naturii")}
      >
        <span className="brand-mark">
          <Icon name="Primăvara" size={33} />
        </span>
        <span>{t("Calendarul naturii")}<small>{t("Întâlnirea de dimineață")}</small>
        </span>
      </button>
      <div className="header-actions">
        <div className="language-switch" role="group" aria-label={language === "ro" ? "Limba" : "Sprache"}>
          {(["ro", "de"] as const).map(code => <button key={code} className="settings-button" lang={code} aria-label={code === "ro" ? "Română" : "Deutsch"} aria-pressed={language === code} onClick={() => setLanguage(code)}>{code.toUpperCase()}</button>)}
        </div>
        <button className="settings-button" aria-label={t(musicOn ? "Oprește muzica" : "Pornește muzica")} aria-pressed={musicOn} onClick={toggleMusic}>
          <span aria-hidden="true">♫</span>{t("Muzică:")}{" "}{t(musicOn ? "pornită" : "oprită")}
        </button>
        {page !== "home" && (
          <button
            className="icon-button"
            aria-label={t("Acasă")}
            onClick={() => navigate("home")}
          >
            <Icon name="home" />
          </button>
        )}
        <button
          className="icon-button"
          aria-label={t(fullscreen ? "Ieși din ecran complet" : "Ecran complet")}
          onClick={toggleFullscreen}
        >
          <Icon name={fullscreen ? "exit" : "fullscreen"} />
        </button>
        <button
          className="settings-button"
          aria-label={t("Setări educatoare")}
          onClick={() => navigate("settings")}
        >
          <Icon name="settings" size={23} />
          <span>{t("Setări educatoare")}</span>
        </button>
      </div>
    </header>
  );
}
