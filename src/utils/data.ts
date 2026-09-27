import type { Child, State } from "../types";
import { today } from "./dateUtils";
export const CHILD_SLOT_COUNT = 30;
export const childLabel = (child: Child) =>
  child.name.trim() || "Loc disponibil";

export const routines = [
  "Bună dimineața",
  "Mic dejun",
  "Joacă",
  "Activități",
  "Masa de prânz",
  "Odihnă",
];
export function initialState(): State {
  return {
    version: 1,
    dayKey: today(),
    date: today(),
    group: "",
    message: "Astăzi descoperim lumea împreună.",
    children: Array.from({ length: CHILD_SLOT_COUNT }, (_, i) => ({
      id: i + 1,
      name: "",
      birthday: "",
    })),
    present: [],
    season: "",
    weather: [],
    temperature: "",
    clothes: [],
    outfits: { girl: [], boy: [] },
    childEmotions: {},

    mannequin: "girl",
    emotion: "",
    helper: null,
    activities: routines,
  };
}
export const seasons = ["Primăvara", "Vara", "Toamna", "Iarna"];
export const weatherOptions = [
  "Însorit",
  "Parțial noros",
  "Înnorat",
  "Ploaie",
  "Ninsoare",
  "Vânt",
  "Ceață",
];
export const emotions = [
  "Vesel",
  "Trist",
  "Supărat",
  "Speriat",
  "Obosit",
  "Liniștit",
];

// A slot becomes a child when the teacher gives it a name.
export const isConfiguredChild = (child: Child) => child.name.trim().length > 0;
export function cleanAttendance(state: State): State {
  const ids = new Set(
    state.children.filter(isConfiguredChild).map((c) => c.id),
  );
  const present = [...new Set(state.present.filter((id) => ids.has(id)))];
  return {
    ...state,
    present,
    helper:
      state.helper !== null && present.includes(state.helper)
        ? state.helper
        : null,
    childEmotions: Object.fromEntries(
      Object.entries(state.childEmotions).filter(([id]) => ids.has(Number(id))),
    ),
  };
}
