import type { State } from "../types";
import { initialState, routines } from "./data";
import { today } from "./dateUtils";

export const STORAGE_KEY = "calendarul-naturii-v1";
export function newDay(state: State): State {
  return {
    ...state,
    dayKey: today(),
    date: today(),
    present: [],
    helper: null,
    season: "",
    weather: [],
    temperature: "",
    emotion: "",
    childEmotions: {},
    clothes: [],
    outfits: { girl: [], boy: [] },
  };
}

function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("calendarul-naturii-photos", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("photos");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () =>
      reject(new Error("Închide celelalte file ale aplicației și reîncearcă."));
  });
}

export async function hydratePhotos(state: State): Promise<State> {
  if (!state.children.some((c) => c.photo?.startsWith("idb:"))) return state;
  const db = await database();
  try {
    const children = await Promise.all(
      state.children.map(async (c) => {
        if (!c.photo?.startsWith("idb:")) return c;
        const photo = await new Promise<string>((resolve, reject) => {
          const request = db
            .transaction("photos")
            .objectStore("photos")
            .get(c.photo!.slice(4));
          request.onsuccess = () =>
            typeof request.result === "string"
              ? resolve(request.result)
              : reject(
                  new Error(
                    "O fotografie lipsește din stocarea locală. Restaurează un backup.",
                  ),
                );
          request.onerror = () => reject(request.error);
        });
        return { ...c, photo };
      }),
    );
    return { ...state, children };
  } finally {
    db.close();
  }
}

// Photos are staged before the small localStorage record is replaced. A failed
// write never removes the photos referenced by the previous saved configuration.
export async function persistState(state: State): Promise<void> {
  if (navigator.locks)
    return navigator.locks.request("calendarul-naturii-save", () =>
      writeState(state),
    );
  return writeState(state);
}

async function writeState(state: State): Promise<void> {
  const db = await database();
  try {
    const children = await Promise.all(
      state.children.map(async (c) => {
        if (!c.photo) return c;
        const digest = await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(c.photo),
        );
        const key = Array.from(new Uint8Array(digest), (b) =>
          b.toString(16).padStart(2, "0"),
        ).join("");
        return { ...c, photo: `idb:${key}` };
      }),
    );
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("photos", "readwrite");
      state.children.forEach((c, i) => {
        if (c.photo)
          tx.objectStore("photos").put(c.photo, children[i].photo!.slice(4));
      });
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
      tx.onerror = () => reject(tx.error);
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, children }));
    // Without cross-tab locking, retain old images rather than risking removal
    // of a photo another tab has just staged for its own save.
    if (!navigator.locks) return;
    const keep = new Set(
      children.filter((c) => c.photo).map((c) => c.photo!.slice(4)),
    );
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("photos", "readwrite");
      const cursor = tx.objectStore("photos").openCursor();
      cursor.onsuccess = () => {
        const c = cursor.result;
        if (c) {
          if (!keep.has(String(c.key))) c.delete();
          c.continue();
        }
      };
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export function configurationBackup(state: State): string {
  return JSON.stringify(
    {
      format: "calendarul-naturii-config",
      version: 1,
      group: state.group,
      message: state.message,
      activities: state.activities,
      children: state.children,
    },
    null,
    2,
  );
}

export function parseConfiguration(text: string): State {
  const value = JSON.parse(text);
  const validText = (v: unknown, max: number): v is string =>
    typeof v === "string" && v.length <= max;
  if (
    value?.format !== "calendarul-naturii-config" ||
    value.version !== 1 ||
    !validText(value.group, 70) ||
    !validText(value.message, 240) ||
    !Array.isArray(value.activities) ||
    !value.activities.every(
      (a: unknown) => typeof a === "string" && routines.includes(a),
    ) ||
    !Array.isArray(value.children) ||
    value.children.length !== 30
  )
    throw new Error(
      "Fișierul nu este o configurație validă pentru această aplicație.",
    );
  const ids = new Set<number>();
  const children = value.children.map((c: Record<string, unknown>) => {
    if (
      !c ||
      !Number.isSafeInteger(c.id) ||
      Number(c.id) < 1 ||
      ids.has(Number(c.id)) ||
      !validText(c.name, 45) ||
      !validText(c.birthday, 10) ||
      (c.birthday !== "" &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(c.birthday) ||
          Number.isNaN(Date.parse(c.birthday)) ||
          new Date(c.birthday).toISOString().slice(0, 10) !== c.birthday)) ||
      (c.photo !== undefined &&
        (!validText(c.photo, 300000) ||
          !/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/.test(
            c.photo,
          )))
    )
      throw new Error("Datele unui copil sau fotografia nu sunt valide.");
    ids.add(Number(c.id));
    return {
      id: Number(c.id),
      name: c.name,
      birthday: c.birthday,
      photo: c.photo as string | undefined,
    };
  });
  return {
    ...initialState(),
    group: value.group,
    message: value.message,
    activities: [...new Set<string>(value.activities)],
    children,
  };
}
