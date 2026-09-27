import { useState, type CSSProperties } from "react";
import type { PageProps } from "../types";
import { Icon, Face } from "../components/Icon";
import { dateText } from "../utils/dateUtils";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { promptAudio } from "../utils/audioPrompts";

export default function SummaryPage({ state }: PageProps) {
  const [done, setDone] = useState(false);
  const { play } = useAudioPlayer();
  const helper = state.children.find(
    (c) => c.id === state.helper && state.present.includes(c.id),
  );
  const weather: Record<string, string> = {
    Însorit: "însorit",
    "Parțial noros": "parțial noros",
    Înnorat: "înnorat",
    Ploaie: "ploaie",
    Ninsoare: "ninsoare",
    Vânt: "vânt",
    Ceață: "ceață",
  };
  const rows = [
    { icon: "calendar", text: `Astăzi este ${dateText(state.date)}.` },
    {
      icon: state.season || "season",
      text: state.season
        ? `Anotimpul nostru este ${state.season.toLowerCase()}.`
        : "Încă nu am ales anotimpul.",
    },
    {
      icon: state.weather[0] || "weather",
      text: state.weather.length
        ? `Vremea de astăzi: ${state.weather.map((w) => weather[w]).join(" și ")}${state.temperature ? `. Afară este ${state.temperature.toLowerCase()}` : ""}.`
        : state.temperature
          ? `Afară este ${state.temperature.toLowerCase()}.`
          : "Încă nu am ales vremea.",
    },
    {
      icon: "attendance",
      text:
        state.present.length === 1
          ? "La grădiniță este un copil."
          : `La grădiniță sunt ${state.present.length} copii.`,
    },
    {
      icon: "helper",
      text: helper
        ? `Responsabilul zilei este ${helper.name}.`
        : "Încă nu am ales responsabilul zilei.",
    },
    {
      icon: "emotions",
      text: state.emotion
        ? `Astăzi mă simt ${state.emotion.toLowerCase()}.`
        : "Încă nu am ales o emoție.",
    },
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
          <p className="celebration-kicker">ÎMPREUNĂ, ZIUA E MAI FRUMOASĂ</p>
          <h2>O zi plină de bucurie!</h2>
          <p>Suntem gata să descoperim lumea împreună.</p>
          <div className="celebration-actions">
            <button
              className="audio-trigger"
              type="button"
              onClick={() => play(promptAudio.finalMessage)}
              aria-label="Ascultă mesajul final"
            >
              <span aria-hidden="true">🔊</span>
              Ascultă mesajul
            </button>
            <button className="primary" onClick={() => setDone(false)}>
              Înapoi la ziua noastră
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="instruction">Iată povestea dimineții noastre.</p>
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
                play(promptAudio.finalMessage);
              }}
            >
              <Icon name="check" />
              Gata! Începem ziua!
            </button>
          </div>
        </>
      )}
    </>
  );
}
