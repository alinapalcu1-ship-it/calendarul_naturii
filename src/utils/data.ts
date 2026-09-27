import type { State } from "../types";
import { today } from "./dateUtils";
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
    group: "Grupa Mămăruțelor",
    message: "Astăzi descoperim lumea împreună.",
    children: Array.from({ length: 22 }, (_, i) => ({
      id: i + 1,
      name: `Copil ${i + 1}`,
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
