import { useEffect, useState } from "react";
import type { State } from "../types";
import { initialState, cleanAttendance } from "../utils/data";
import { today } from "../utils/dateUtils";
import { migrateState } from "../utils/migrateState";
import {
  hydratePhotos,
  newDay,
  persistState,
  STORAGE_KEY,
} from "../utils/classroomStorage";

// Serialize saves, including slow photo writes, so older edits cannot win.
let writes = Promise.resolve();
export function useLocalStorage() {
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved" | "error">(
    "saving",
  );
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<State>(initialState);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        let loaded = initialState();
        if (raw) {
          const saved = JSON.parse(raw);
          if (
            saved.version !== 1 ||
            !Array.isArray(saved.children) ||
            !Array.isArray(saved.activities)
          )
            throw new Error(
              "Datele salvate nu pot fi citite. Nu au fost suprascrise.",
            );
          loaded = await hydratePhotos(migrateState({ ...loaded, ...saved }));
          if (loaded.dayKey !== today()) loaded = newDay(loaded);
        }
        if (!cancelled) {
          setState(cleanAttendance(loaded));
          setReady(true);
        }
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error
              ? e.message
              : "Stocarea locală nu este disponibilă. Datele existente nu au fost modificate.",
          );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!ready) return;
    let current = true;
    setSaveStatus("saving");
    const protectPendingSave = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", protectPendingSave);
    writes = writes.catch(() => {}).then(() => persistState(state));
    writes.then(
      () => {
        window.removeEventListener("beforeunload", protectPendingSave);
        if (current) {
          setError("");
          setSaveStatus("saved");
        }
      },
      () => {
        if (current) {
          setSaveStatus("error");
          setError(
            "Salvarea locală nu a reușit. Exportă configurația înainte să închizi aplicația și verifică spațiul disponibil în browser.",
          );
        }
      },
    );
    return () => {
      current = false;
      window.removeEventListener("beforeunload", protectPendingSave);
    };
  }, [state, ready, attempt]);
  useEffect(() => {
    if (!ready) return;
    const tick = () => setState((s) => (s.dayKey === today() ? s : newDay(s)));
    const id = window.setInterval(tick, 30000);
    window.addEventListener("focus", tick);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", tick);
    };
  }, [ready]);
  return {
    state,
    ready,
    error,
    saveStatus,
    retrySave: () => {
      setSaveStatus("saving");
      setAttempt((n) => n + 1);
    },
    restore: (restored: State) => {
      setSaveStatus("saving");
      setState(cleanAttendance(restored));
      setError("");
      setReady(true);
    },
    update: (patch: Partial<State>) => {
      setSaveStatus("saving");
      setState((s) => {
        const mannequin = patch.mannequin ?? s.mannequin;
        const outfits =
          patch.outfits ??
          (patch.clothes
            ? { ...s.outfits, [mannequin]: patch.clothes }
            : s.outfits);
        return cleanAttendance({
          ...s,
          ...patch,
          outfits,
          clothes: outfits[mannequin],
        });
      });
    },
    reset: () => {
      setSaveStatus("saving");
      setState(initialState());
    },
    startNewDay: () => {
      setSaveStatus("saving");
      setState(newDay);
    },
  };
}
