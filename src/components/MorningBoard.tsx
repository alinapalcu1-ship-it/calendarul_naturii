import { isConfiguredChild } from "../utils/data";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { weekdayAudio, emotionAudio } from "../utils/audioPrompts";
import { childLabel } from "../utils/data";
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
  const { play } = useAudioPlayer();
  const day = parseDate(state.date);
  const weekday = (day.getDay() + 6) % 7;
  const [emotionChild, setEmotionChild] = useState<number | null>(null);
  const child = state.children.find((c) => c.id === emotionChild);
  return (
    <>
      <div className="morning-board">
        <div className="board-left">
          <section className="board-panel board-weekdays">
            <h2>Zilele săptămânii</h2>
            <p>Alegem ziua de azi.</p>
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
                    play(weekdayAudio[name]);
                  }}
                >
                  <StoryArt name={name} size={60} />
                  <span>{name}</span>
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
            <h2>Emoțiile mele</h2>
            <p>Cum te simți astăzi?</p>
            <div className="board-emotions">
              {emotions.map((emotion) => (
                <button
                  key={emotion}
                  aria-pressed={state.emotion === emotion}
                  onClick={() => {
                    update({
                      emotion: state.emotion === emotion ? "" : emotion,
                    });
                    play(emotionAudio[emotion]);
                  }}
                >
                  <Face emotion={emotion} size={52} />
                  <span>{emotion}</span>
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
        <section className="board-dressing" aria-label="Atelierul de îmbrăcare">
          <ClothingPage state={state} update={update} />
        </section>
      </div>
      <div className="board-bottom">
        <section className="board-panel board-attendance">
          <div className="board-panel-heading">
            <div>
              <h2>Prezența la grădiniță</h2>
              <p>Ne bucurăm să fim împreună.</p>
            </div>
            <div className="board-counts">
              <span>Prezenți: {state.present.length}</span>
              <span>
                Absenți:{" "}
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
                      ? `${childLabel(c)}: ${state.present.includes(c.id) ? "prezent" : "absent"}`
                      : "Loc disponibil"
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
                  <span>{childLabel(c)}</span>
                  {state.present.includes(c.id) && (
                    <span className="board-tick" aria-hidden="true">
                      ✓
                    </span>
                  )}
                </button>
                {state.present.includes(c.id) && (
                  <button
                    className="board-child-emotion"
                    aria-label={`Alege emoția pentru ${childLabel(c)}`}
                    onClick={() => {
                      setEmotionChild(c.id);
                    }}
                  >
                    {state.childEmotions[c.id] ? (
                      <Face emotion={state.childEmotions[c.id]} size={32} />
                    ) : (
                      <span>Emoție +</span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="board-all" onClick={() => navigate("attendance")}>
            Vezi prezența grupei <Icon name="next" size={18} />
          </button>
        </section>
        <section className="board-panel board-routine">
          <h2>Pașii zilei noastre</h2>
          <div className="routine-items">
            {state.activities.map((a) => (
              <div className="routine-item" key={a}>
                <Icon name={a} size={64} />
                <span>{a}</span>
              </div>
            ))}
          </div>
          <button className="board-all" onClick={() => navigate("summary")}>
            Ziua noastră <Icon name="next" size={18} />
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
