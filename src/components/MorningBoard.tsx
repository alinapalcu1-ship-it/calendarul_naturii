import { useLanguage } from "../i18n/LanguageContext";
import { isConfiguredChild } from "../utils/data";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useState } from "react";
import type { Page, PageProps } from "../types";
import { Icon, Face } from "./Icon";
import { StoryArt } from "./StoryArt";
import { Avatar } from "./Controls";
import { ChildEmotionPicker } from "./ChildEmotionPicker";
import ClothingPage from "../pages/ClothingPage";
import { weekdays, parseDate, makeDate } from "../utils/dateUtils";
import { emotions } from "../utils/data";

export function MorningBoard({
  state,
  update,
  navigate,
}: PageProps & { navigate: (page: Page) => void }) {
  const { t, labelFor } = useLanguage();
  const { playWord } = useAudioPlayer();
  const day = parseDate(state.date);
  const weekday = (day.getDay() + 6) % 7;
  const [emotionChild, setEmotionChild] = useState<number | null>(null);
  const child = state.children.find((c) => c.id === emotionChild);
  return (
    <>
      <div className="morning-board">
        <div className="board-left">
          <section className="board-panel board-weekdays">
            <h2>{t("Zilele săptămânii")}</h2>
            <p>{t("Alegem ziua de azi.")}</p>
            <div className="board-day-grid">
              {weekdays.slice(0, 5).map((name, i) => (
                <button
                  key={name}
                  aria-pressed={weekday === i}
                  onClick={() => {
                    const next = new Date(day);
                    next.setDate(day.getDate() + i - weekday);
                    update({
                      date: makeDate(
                        next.getFullYear(),
                        next.getMonth(),
                        next.getDate(),
                      ),
                    });
                    playWord(name);
                  }}
                >
                  <StoryArt name={name} size={60} />
                  <span>{labelFor(name)}</span>
                  {weekday === i && (
                    <span className="board-tick" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
          <section className="board-panel board-feelings">
            <h2>{t("Emoțiile mele")}</h2>
            <p>{t("Cum te simți astăzi?")}</p>
            <div className="board-emotions">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  aria-pressed={state.emotion === emotion}
                  onClick={() => {
                    update({
                      emotion: state.emotion === emotion ? "" : emotion,
                    });
                    playWord(emotion);
                  }}
                >
                  <Face emotion={emotion} size={52} />
                  <span>{labelFor(emotion)}</span>
                  {state.emotion === emotion && (
                    <span className="board-tick" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>
        <section className="board-dressing" aria-label={t("Atelierul de îmbrăcare")}>
          <ClothingPage state={state} update={update} />
        </section>
      </div>
      <div className="board-bottom">
        <section className="board-panel board-attendance">
          <div className="board-panel-heading">
            <div>
              <h2>{t("Prezența la grădiniță")}</h2>
              <p>{t("Ne bucurăm să fim împreună.")}</p>
            </div>
            <div className="board-counts">
              <span>{t("Prezenți:")}{" "}{state.present.length}</span>
              <span>{t("Absenți:")}{" "}
                {state.children.filter(isConfiguredChild).length -
                  state.present.length}
              </span>
            </div>
          </div>
          <div className="board-children">
            {state.children.slice(0, 6).map((c) => (
              <div className="board-child" key={c.id}>
                <button
                  className="board-child-presence"
                  disabled={!isConfiguredChild(c)}
                  aria-label={
                    isConfiguredChild(c)
                      ? `${(c.name.trim() || t("Loc disponibil"))}: ${t(state.present.includes(c.id) ? "✓ Prezent" : "Absent")}`
                      : t("Loc disponibil")
                  }
                  aria-pressed={state.present.includes(c.id)}
                  onClick={() => {
                    const present = state.present.includes(c.id)
                      ? state.present.filter((id) => id !== c.id)
                      : [...state.present, c.id];
                    update({
                      present,
                      helper:
                        state.helper !== null && present.includes(state.helper)
                          ? state.helper
                          : null,
                    });
                  }}
                >
                  <Avatar child={c} size={64} />
                  <span>{(c.name.trim() || t("Loc disponibil"))}</span>
                  {state.present.includes(c.id) && (
                    <span className="board-tick" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
                {state.present.includes(c.id) && (
                  <button
                    className="board-child-emotion"
                    aria-label={t("Emoția pentru {name}", { name: c.name })}
                    onClick={() => {
                      setEmotionChild(c.id);
                    }}
                  >
                    {state.childEmotions[c.id] ? (
                      <Face emotion={state.childEmotions[c.id]} size={32} />
                    ) : (
                      <span>{t("Emoție +")}</span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="board-all" onClick={() => navigate("attendance")}>{t("Vezi prezența grupei")}<Icon name="next" size={18} />
          </button>
        </section>
        <section className="board-panel board-routine">
          <h2>{t("Pașii zilei noastre")}</h2>
          <div className="routine-items">
            {state.activities.map((a) => (
              <button type="button" className="routine-item" key={a} onClick={() => playWord(a)}>
                <Icon name={a} size={64} />
                <span>{labelFor(a)}</span>
              </button>
            ))}
          </div>
          <button className="board-all" onClick={() => navigate("summary")}>{t("Ziua noastră")}<Icon name="next" size={18} />
          </button>
        </section>
      </div>
      {child && state.present.includes(child.id) && (
        <ChildEmotionPicker
          child={child}
          value={state.childEmotions[child.id]}
          onClose={() => setEmotionChild(null)}
          onSelect={(emotion) => {
            const next = { ...state.childEmotions };
            if (emotion) next[child.id] = emotion;
            else delete next[child.id];
            update({ childEmotions: next });
            setEmotionChild(null);
          }}
        />
      )}
    </>
  );
}
