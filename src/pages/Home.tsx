import type { Page, PageProps } from "../types";
import { Icon } from "../components/Icon";
import { SectionArt } from "../components/SectionArt";
import { MorningBoard } from "../components/MorningBoard";
import { dateText } from "../utils/dateUtils";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { promptAudio } from "../utils/audioPrompts";

export const modules: {
  page: Page;
  title: string;
  hint: string;
  color: string;
}[] = [
  {
    page: "calendar",
    title: "Astăzi este…",
    hint: "Descoperim ziua de azi",
    color: "yellow",
  },
  {
    page: "season",
    title: "Anotimpul",
    hint: "Privim natura împreună",
    color: "sage",
  },
  {
    page: "weather",
    title: "Cum este vremea?",
    hint: "Ce vedem pe fereastră?",
    color: "blue",
  },
  {
    page: "clothing",
    title: "Cum ne îmbrăcăm?",
    hint: "Alegem hăinuțele potrivite",
    color: "peach",
  },
  {
    page: "attendance",
    title: "Cine este la grădiniță?",
    hint: "Ne bucurăm că suntem aici",
    color: "rose",
  },
  {
    page: "emotions",
    title: "Cum ne simțim?",
    hint: "Fiecare emoție are locul ei",
    color: "yellow",
  },
  {
    page: "helper",
    title: "Responsabilul zilei",
    hint: "Micul nostru ajutor",
    color: "lavender",
  },
  {
    page: "summary",
    title: "Ziua noastră",
    hint: "Povestim ce am descoperit",
    color: "sage",
  },
];

export default function Home({
  state,
  update,
  navigate,
}: PageProps & { navigate: (p: Page) => void }) {
  const { play } = useAudioPlayer();
  const birthday = state.children.filter(
    (c) => c.birthday.slice(5) === state.date.slice(5),
  );
  return (
    <div className="dashboard">
      <section className="welcome">
        <div className="sun-art" aria-hidden="true">
          <SectionArt name="weather" size={118} />
        </div>
        <div className="welcome-copy">
          <h1>Bună dimineața!</h1>
          <p className="subtitle">
            Ne întâlnim, ne cunoaștem și descoperim ziua de azi.
          </p>
          <button
            className="audio-trigger"
            type="button"
            onClick={() => play(promptAudio.welcome)}
            aria-label="Ascultă mesajul de bun venit"
          >
            <span aria-hidden="true">🔊</span>
            Ascultă mesajul
          </button>
        </div>
      </section>
      <div className="morning-strip">
        <span className="today-chip">
          <Icon name="calendar" size={22} />
          {dateText(state.date)}
        </span>
        {state.message && (
          <span className="morning-message">{state.message}</span>
        )}
      </div>
      {birthday.length > 0 && (
        <div className="birthday">
          La mulți ani, {birthday.map((c) => c.name).join(", ")}!
        </div>
      )}
      <div className="home-grid">
        {modules
          .filter((m) => m.page !== "summary")
          .map((m) => (
            <button
              key={m.page}
              className={`home-card ${m.color}`}
              onClick={() => navigate(m.page)}
            >
              <span className="card-top">
                <span className="module-icon">
                  <SectionArt name={m.page} />
                </span>
              </span>
              <strong>{m.title}</strong>
              <span className="card-bottom">{m.hint}</span>
            </button>
          ))}
      </div>
      <MorningBoard state={state} update={update} navigate={navigate} />
    </div>
  );
}
