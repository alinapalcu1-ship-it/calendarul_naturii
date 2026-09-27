import type { Child, State } from "../types";
import { today } from "./dateUtils";
export const CHILD_SLOT_COUNT = 30;
export const childLabel = (child: Child) => child.name.trim() || "Loc disponibil";

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
