import { useLanguage } from "./i18n/LanguageContext";
import { useEffect, useRef, useState } from "react";
import type { Page } from "./types";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Header } from "./components/Header";
import { Icon } from "./components/Icon";
import Home, { modules } from "./pages/Home";
import {
  CalendarPage,
  SeasonPage,
  WeatherPage,
  AttendancePage,
  EmotionsPage,
  HelperPage,
} from "./pages/SelectionPages";
import ClothingPage from "./pages/ClothingPage";
import SummaryPage from "./pages/SummaryPage";
import { StorageRecovery } from "./components/StorageRecovery";
import TeacherSettings from "./pages/TeacherSettings";
export default function App() {
  const { t } = useLanguage();
  const {
    state,
    update,
    reset,
    startNewDay,
    ready,
    error,
    saveStatus,
    retrySave,
    restore,
  } = useLocalStorage();
  const [page, setPage] = useState<Page>("home");
  const [fullscreen, setFullscreen] = useState(false);
  const [screenError, setScreenError] = useState("");
  const main = useRef<HTMLElement>(null);
  const navigate = (p: Page) => {
    setPage(p);
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    if (page !== "home") main.current?.focus();
  }, [page]);
  useEffect(() => {
    const listener = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", listener);
    return () => document.removeEventListener("fullscreenchange", listener);
  }, []);
  const props = { state, update };
  const content =
    page === "home" ? (
      <Home state={state} update={update} navigate={navigate} />
    ) : page === "calendar" ? (
      <CalendarPage {...props} />
    ) : page === "season" ? (
      <SeasonPage {...props} />
    ) : page === "weather" ? (
      <WeatherPage {...props} />
    ) : page === "clothing" ? (
      <ClothingPage {...props} />
    ) : page === "attendance" ? (
      <AttendancePage {...props} />
    ) : page === "emotions" ? (
      <EmotionsPage {...props} />
    ) : page === "helper" ? (
      <HelperPage {...props} />
    ) : page === "summary" ? (
      <SummaryPage {...props} />
    ) : (
      <TeacherSettings {...props} reset={reset} startNewDay={startNewDay} />
    );
  return (
    <>
      <Header
        page={page}
        navigate={navigate}
        fullscreen={fullscreen}
        toggleFullscreen={async () => {
          try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else await document.documentElement.requestFullscreen();
            setScreenError("");
          } catch {
            setScreenError(
              "Ecranul complet nu este disponibil în acest browser. Poți folosi tasta F11.",
            );
          }
        }}
      />
      <main ref={main} tabIndex={-1}>
        {(error || screenError) && (
          <p className="error" role="alert">
            {t(error || screenError)}
          </p>
        )}
        {ready && (
          <div className="save-status">
            <span role="status" aria-live="polite">
              {t(saveStatus === "saving" ? "Se salvează…" : saveStatus === "saved" ? "Salvat pe acest dispozitiv" : "Modificările nu sunt salvate")}
            </span>
            {saveStatus === "error" && (
              <button className="secondary" onClick={retrySave}>{t("Reîncearcă salvarea")}</button>
            )}
          </div>
        )}
        {page !== "home" && (
          <div className="page-heading">
            <button className="back-button" onClick={() => navigate("home")}>
              <Icon name="back" />{t("Înapoi")}</button>
            <div>
              <p className="eyebrow">{t("ÎNTÂLNIREA DE DIMINEAȚĂ")}</p>
              <h1>
                {t(page === "settings" ? "Setări educatoare" : modules.find((m) => m.page === page)?.title || "")}
              </h1>
            </div>
          </div>
        )}
        {ready ? (
          content
        ) : error ? (
          <StorageRecovery onRestore={restore} />
        ) : (
          <p role="status">{t("Se încarcă datele grupei…")}</p>
        )}
      </main>
    </>
  );
}
