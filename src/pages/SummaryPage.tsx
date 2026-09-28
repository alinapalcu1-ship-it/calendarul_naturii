import { useLanguage } from "../i18n/LanguageContext";
import { useState, type CSSProperties } from "react";
import type { PageProps } from "../types";
import { Icon, Face } from "../components/Icon";
import { dateText } from "../utils/dateUtils";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

export default function SummaryPage({ state }: PageProps) {
  const { t, labelFor, language } = useLanguage();
  const [done, setDone] = useState(false);
  const { playPrompt } = useAudioPlayer();
  const helper = state.children.find(
    (c) => c.id === state.helper && state.present.includes(c.id),
  );
  const lower = (value: string) => labelFor(value).toLocaleLowerCase(language);
  const rows = [
    { icon: "calendar", text: t("Astăzi este {date}.", { date: dateText(state.date, language) }) },
    { icon: state.season || "season", text: state.season
      ? t("Anotimpul nostru este {season}.", { season: language === "de" ? labelFor(state.season) : lower(state.season) })
      : t("Încă nu am ales anotimpul.") },
    { icon: state.weather[0] || "weather", text: state.weather.length
      ? t("Vremea de astăzi: {weather}.", { weather: state.weather.map(lower).join(t(" și ")) }) + (state.temperature ? " " + t("Afară este {temperature}.", { temperature: lower(state.temperature) }) : "")
      : state.temperature ? t("Afară este {temperature}.", { temperature: lower(state.temperature) }) : t("Încă nu am ales vremea.") },
    { icon: "attendance", text: state.present.length === 1 ? t("La grădiniță este un copil.") : t("La grădiniță sunt {count} copii.", { count: state.present.length }) },
    { icon: "helper", text: helper ? t("Responsabilul zilei este {name}.", { name: helper.name }) : t("Încă nu am ales responsabilul zilei.") },
    { icon: "emotions", text: state.emotion ? t("Astăzi mă simt {emotion}.", { emotion: lower(state.emotion) }) : t("Încă nu am ales o emoție.") },
  ];
  return (
    <>
      {done ? (
        <div className="celebration" role="status">
          <div className="celebration-confetti" aria-hidden="true">
            {Array.from({ length: 22 }, (_, i) => (
              <i
                key={i}
                style={
                  {
                    "--x": `${8 + ((i * 37) % 85)}%`,
                    "--y": `${6 + ((i * 19) % 75)}%`,
                    "--turn": `${i * 31}deg`,
                    "--delay": `${-(i % 7)}s`,
                    "--duration": `${6 + (i % 5)}s`,
                    "--tone": [
                      "#dc8f73",
                      "#e6b744",
                      "#78a68a",
                      "#88b8d0",
                      "#bd91b5",
                    ][i % 5],
                  } as CSSProperties
                }
              >
                {i % 3 === 0 ? "✦" : ""}
              </i>
            ))}
          </div>
          <div className="celebration-sun" aria-hidden="true">
            <Icon name="Bună dimineața" size={190} />
          </div>
          <p className="celebration-kicker">{t("ÎMPREUNĂ, ZIUA E MAI FRUMOASĂ")}</p>
          <h2>{t("O zi plină de bucurie!")}</h2>
          <p>{t("Suntem gata să descoperim lumea împreună.")}</p>
          <div className="celebration-actions">
            <button
              className="audio-trigger"
              type="button"
              onClick={() => playPrompt("finalMessage")}
              aria-label={t("Ascultă mesajul final")}
            >
              <span aria-hidden="true">🔊</span>{t("Ascultă mesajul")}</button>
            <button className="primary" onClick={() => setDone(false)}>{t("Înapoi la ziua noastră")}</button>
          </div>
        </div>
      ) : (
        <>
          <p className="instruction">{t("Iată povestea dimineții noastre.")}</p>
          <div className="summary-grid">
            {rows.map((r) => (
              <div className="summary-card" key={r.icon}>
                {r.icon === "emotions" && state.emotion ? (
                  <Face emotion={state.emotion} size={62} />
                ) : (
                  <Icon name={r.icon} size={53} />
                )}
                <p>{r.text}</p>
              </div>
            ))}
          </div>
          <div className="summary-actions">
            <button
              className="primary"
              onClick={() => {
                setDone(true);
                playPrompt("finalMessage");
              }}
            >
              <Icon name="check" />{t("Gata! Începem ziua!")}</button>
          </div>
        </>
      )}
    </>
  );
}
