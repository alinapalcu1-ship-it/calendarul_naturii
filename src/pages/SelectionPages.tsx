import { isConfiguredChild } from "../utils/data";
import { childLabel } from "../utils/data";
import { ChildEmotionPicker } from "../components/ChildEmotionPicker";
import { useState } from "react";
import type { PageProps } from "../types";
import { Choice, Notice, ChildCard, Avatar } from "../components/Controls";
import { Face, Icon } from "../components/Icon";
import { StoryArt } from "../components/StoryArt";
import { seasons, weatherOptions, emotions } from "../utils/data";
import {
  dateText,
  parseDate,
  makeDate,
  months,
  weekdays,
  today,
} from "../utils/dateUtils";
import {
  weekdayAudio,
  seasonAudio,
  emotionAudio,
  monthAudio,
  promptAudio,
  temperatureAudio,
  weatherAudio,
} from "../utils/audioPrompts";
import { useAudioPlayer } from "../hooks/useAudioPlayer";

export function CalendarPage({ state, update }: PageProps) {
  const d = parseDate(state.date);
  const [part, setPart] = useState("Ziua");
  const weekday = (d.getDay() + 6) % 7;
  const { play } = useAudioPlayer();

  return (
    <>
      <div className="date-preview">Astăzi este {dateText(state.date)}.</div>
      <div className="tabs">
        {["Ziua", "Data", "Luna", "Anul"].map((p) => (
          <button
            key={p}
            aria-pressed={part === p}
            className={part === p ? "active" : ""}
            onClick={() => setPart(p)}
          >
            {p}
            <small>
              {p === "Ziua"
                ? weekdays[weekday]
                : p === "Data"
                  ? d.getDate()
                  : p === "Luna"
                    ? months[d.getMonth()]
                    : d.getFullYear()}
            </small>
          </button>
        ))}
      </div>
      {part === "Ziua" && (
        <>
          <p className="instruction">
            Atinge o zi. Data se schimbă în aceeași săptămână.
          </p>
          <div className="choices weekdays">
            {weekdays.slice(0, 5).map((w, i) => (
              <Choice
                key={w}
                label={w}
                selected={weekday === i}
                onClick={() => {
                  const nd = new Date(d);
                  nd.setDate(d.getDate() + i - weekday);
                  update({
                    date: makeDate(
                      nd.getFullYear(),
                      nd.getMonth(),
                      nd.getDate(),
                    ),
                  });
                  play(weekdayAudio[w]);
                }}
              >
                <StoryArt name={w} size={100} />
              </Choice>
            ))}
          </div>
        </>
      )}
      {part === "Data" && (
        <div className="date-grid">
          {Array.from(
            {
              length: new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(),
            },
            (_, i) => (
              <button
                aria-pressed={d.getDate() === i + 1}
                className={d.getDate() === i + 1 ? "active" : ""}
                key={i}
                onClick={() =>
                  update({
                    date: makeDate(d.getFullYear(), d.getMonth(), i + 1),
                  })
                }
              >
                {i + 1}
              </button>
            ),
          )}
        </div>
      )}
      {part === "Luna" && (
        <div className="month-grid">
          {months.map((m, i) => (
            <button
              key={m}
              aria-pressed={i === d.getMonth()}
              className={i === d.getMonth() ? "active" : ""}
              onClick={() => {
                update({ date: makeDate(d.getFullYear(), i, d.getDate()) });
                play(monthAudio[m]);
              }}
            >
              <StoryArt name={m} size={82} />
              <span>{m}</span>
              {i === d.getMonth() && (
                <span className="month-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {part === "Anul" && (
        <div className="year-picker">
          <button
            aria-label="Anul anterior"
            disabled={d.getFullYear() <= 1900}
            onClick={() =>
              update({
                date: makeDate(d.getFullYear() - 1, d.getMonth(), d.getDate()),
              })
            }
          >
            <Icon name="minus" />
          </button>
          <strong>{d.getFullYear()}</strong>
          <button
            aria-label="Anul următor"
            disabled={d.getFullYear() >= 2200}
            onClick={() =>
              update({
                date: makeDate(d.getFullYear() + 1, d.getMonth(), d.getDate()),
              })
            }
          >
            <Icon name="plus" />
          </button>
        </div>
      )}
      <button className="secondary" onClick={() => update({ date: today() })}>
        <Icon name="reset" size={23} /> Folosește data de azi
      </button>
    </>
  );
}

export function SeasonPage({ state, update }: PageProps) {
  const { play } = useAudioPlayer();
  return (
    <>
      <p className="instruction">
        În ce anotimp suntem? Atinge imaginea potrivită.
      </p>
      <div className="choices seasons">
        {seasons.map((s, i) => (
          <div className={["sage", "yellow", "peach", "blue"][i]} key={s}>
            <Choice
              label={s}
              selected={state.season === s}
              onClick={() => {
                update({ season: s });
                play(seasonAudio[s]);
              }}
            >
              <div className="season-picture">
                <Icon name={s} size={112} />
                <span className="ground" />
              </div>
            </Choice>
          </div>
        ))}
      </div>
      <Notice>
        {state.season
          ? `Anotimpul nostru: ${state.season.toLowerCase()}.`
          : "Privim afară și descoperim împreună."}
      </Notice>
    </>
  );
}

export function WeatherPage({ state, update }: PageProps) {
  const { play } = useAudioPlayer();

  return (
    <>
      <p className="instruction">
        Privește pe fereastră. Alege una sau două imagini.
      </p>
      <div className="choices weather">
        {weatherOptions.map((w) => (
          <Choice
            key={w}
            label={w}
            selected={state.weather.includes(w)}
            onClick={() => {
              update({
                weather: state.weather.includes(w)
                  ? state.weather.filter((x) => x !== w)
                  : [...state.weather.slice(-1), w],
              });
              play(weatherAudio[w]);
            }}
          />
        ))}
      </div>
      <div className="section-audio-row">
        <h2 className="section-label">Cum este afară?</h2>
        <button
          className="audio-trigger compact"
          type="button"
          onClick={() => play(promptAudio.weatherQuestion)}
          aria-label="Ascultă întrebarea Cum este afară"
        >
          <span aria-hidden="true">🔊</span>
          Ascultă
        </button>
      </div>
      <div className="temperature">
        {["Cald", "Răcoare", "Frig"].map((t) => (
          <button
            className={state.temperature === t ? "active" : ""}
            aria-pressed={state.temperature === t}
            key={t}
            onClick={() => {
              update({ temperature: state.temperature === t ? "" : t });
              play(temperatureAudio[t]);
            }}
          >
            <Icon name={t} />
            {t}
            {state.temperature === t && <Icon name="check" size={22} />}
          </button>
        ))}
      </div>
      <Notice>
        {state.weather.length
          ? `Am ales: ${state.weather.join(" și ").toLowerCase()}${state.temperature ? `, ${state.temperature.toLowerCase()}` : ""}.`
          : "Cum este vremea astăzi?"}
      </Notice>
    </>
  );
}

export function AttendancePage({ state, update }: PageProps) {
  const [confirm, setConfirm] = useState(false);
  const [emotionChild, setEmotionChild] = useState<number | null>(null);
  const selectedChild = state.children.find((c) => c.id === emotionChild);
  return (
    <>
      <div className="attendance-bar">
        <p className="instruction">
          Atinge-ți fotografia și spune „Bună dimineața!”.
        </p>
        <div className="counts">
          <span>
            Prezenți: <b>{state.present.length}</b>
          </span>
          <span>
            Absenți:{" "}
            <b>
              {state.children.filter(isConfiguredChild).length -
                state.present.length}
            </b>
          </span>
        </div>
      </div>
      <div className="children-grid attendance-emotions">
        {state.children.map((c) => (
          <ChildCard
            key={c.id}
            child={c}
            emotion={state.childEmotions[c.id]}
            onEmotion={() => setEmotionChild(c.id)}
            selected={state.present.includes(c.id)}
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
          />
        ))}
      </div>
      {selectedChild && state.present.includes(selectedChild.id) && (
        <ChildEmotionPicker
          child={selectedChild}
          value={state.childEmotions[selectedChild.id]}
          onClose={() => setEmotionChild(null)}
          onSelect={(emotion) => {
            const next = { ...state.childEmotions };
            if (emotion) next[selectedChild.id] = emotion;
            else delete next[selectedChild.id];
            update({ childEmotions: next });
            setEmotionChild(null);
          }}
        />
      )}
      {confirm ? (
        <div className="confirm-inline">
          Resetăm prezența și responsabilul?
          <button
            onClick={() => {
              update({ present: [], helper: null });
              setConfirm(false);
            }}
          >
            Da, resetăm
          </button>
          <button onClick={() => setConfirm(false)}>Anulează</button>
        </div>
      ) : (
        <button className="secondary" onClick={() => setConfirm(true)}>
          <Icon name="reset" size={23} />
          Resetează prezența
        </button>
      )}
    </>
  );
}

export function EmotionsPage({ state, update }: PageProps) {
  const { play } = useAudioPlayer();
  return (
    <>
      <p className="instruction">
        Cum te simți astăzi? Toate emoțiile sunt binevenite.
      </p>
      <div className="choices emotions">
        {emotions.map((e) => (
          <Choice
            key={e}
            label={e}
            selected={state.emotion === e}
            onClick={() => {
              update({ emotion: e });
              play(emotionAudio[e]);
            }}
          >
            <Face emotion={e} size={112} />
          </Choice>
        ))}
      </div>
      <Notice>
        {state.emotion
          ? `Astăzi mă simt ${state.emotion.toLowerCase()}.`
          : "Atinge chipul care arată cum te simți."}
      </Notice>
    </>
  );
}

export function HelperPage({ state, update }: PageProps) {
  const helper = state.children.find(
    (c) => c.id === state.helper && state.present.includes(c.id),
  );
  return (
    <>
      {helper && (
        <div className="helper-highlight">
          <span className="helper-star">
            <Icon name="helper" size={66} />
          </span>
          <Avatar child={helper} size={116} />
          <div>
            <p>Responsabilul zilei este:</p>
            <h2>{childLabel(helper)}</h2>
          </div>
        </div>
      )}
      {state.present.length === 0 ? (
        <Notice>
          Mai întâi alegem cine este la grădiniță, în secțiunea „Cine este la
          grădiniță?”.
        </Notice>
      ) : (
        <>
          <p className="instruction">
            Cine ne ajută astăzi? Alegem dintre copiii prezenți.
          </p>
          <div className="children-grid">
            {state.children
              .filter(
                (c) => isConfiguredChild(c) && state.present.includes(c.id),
              )
              .map((c) => (
                <ChildCard
                  key={c.id}
                  child={c}
                  selected={helper?.id === c.id}
                  status={false}
                  onClick={() => update({ helper: c.id })}
                />
              ))}
          </div>
        </>
      )}
    </>
  );
}
