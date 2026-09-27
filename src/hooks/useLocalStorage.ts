import { useEffect, useState } from "react";
import type { State } from "../types";
import { initialState } from "../utils/data";
import { today } from "../utils/dateUtils";
import { migrateState } from "../utils/migrateState";
const KEY = "calendarul-naturii-v1";
export function useLocalStorage() {
  const [error, setError] = useState("");
  const [state, setState] = useState<State>(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return initialState();
      const s = JSON.parse(raw) as State;
      if (
        s.version !== 1 ||
        !Array.isArray(s.children) ||
        !Array.isArray(s.present) ||
        !Array.isArray(s.weather) ||
        !Array.isArray(s.clothes) ||
        !Array.isArray(s.activities) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(s.date)
      )
        return initialState();
      return {
        ...initialState(),
        ...migrateState(s),
        ...(s.dayKey !== today()
          ? {
              dayKey: today(),
              date: today(),
              present: [],
              helper: null,
              weather: [],
              temperature: "",
              emotion: "",
              clothes: [],
              outfits: { girl: [], boy: [] },
              childEmotions: {},
            }
          : {}),
      };
    } catch {
      return initialState();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      setError("");
    } catch {
      setError(
        "Salvarea nu a reușit. Spațiul browserului poate fi plin sau blocat. Micșorează numărul fotografiilor și încearcă din nou.",
      );
    }
  }, [state]);
  useEffect(() => {
    const tick = () =>
      setState((s) =>
        s.dayKey === today()
          ? s
          : {
              ...s,
              dayKey: today(),
              date: today(),
              present: [],
              helper: null,
              weather: [],
              temperature: "",
              emotion: "",
              clothes: [],
              outfits: { girl: [], boy: [] },
              childEmotions: {},
            },
      );
    const id = window.setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  return {
    state,
    update: (patch: Partial<State>) =>
      setState((s) => {
        const mannequin = patch.mannequin ?? s.mannequin;
        const outfits =
          patch.outfits ??
          (patch.clothes
            ? { ...s.outfits, [mannequin]: patch.clothes }
            : s.outfits);
        return { ...s, ...patch, outfits, clothes: outfits[mannequin] };
      }),
    reset: () => setState(initialState()),
    error,
  };
}
