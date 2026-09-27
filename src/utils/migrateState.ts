import type { State } from "../types";
import { routines, emotions, CHILD_SLOT_COUNT } from "./data";
import { cleanClothing as normalizeOutfit } from "./clothingCatalog";

/** Upgrade the original local data in place, retaining child IDs and photographs. */
export function migrateState(saved: State): State {
  const compatible = { ...saved } as State & { musicVolume?: number };
  delete compatible.musicVolume;
  const mannequin = saved.mannequin === "boy" ? "boy" : "girl";
  const outfits = {
    girl: normalizeOutfit(
      Array.isArray(saved.outfits?.girl)
        ? saved.outfits.girl
        : mannequin === "girl"
          ? saved.clothes
          : [],
    ),
    boy: normalizeOutfit(
      Array.isArray(saved.outfits?.boy)
        ? saved.outfits.boy
        : mannequin === "boy"
          ? saved.clothes
          : [],
    ),
  };
  const children = saved.children.map((child) => ({
    ...child,
    // Remove only the old generated labels; retain configured child details.
    name: /^Copil \d+$/i.test(child.name.trim()) ? "" : child.name,
  }));
  let nextId = Math.max(0, ...children.map((child) => child.id)) + 1;
  while (children.length < CHILD_SLOT_COUNT) {
    children.push({
      id: nextId,
      name: "",
      birthday: "",
    });
    nextId += 1;
  }
  const renamed: Record<string, string> = {
    Gustare: "Mic dejun",
    Activitate: "Activități",
    Masa: "Masa de prânz",
  };
  const enabled = new Set(
    saved.activities.map((activity) => renamed[activity] ?? activity),
  );
  return {
    ...compatible,
    group: saved.group === "Grupa Mămăruțelor" ? "" : saved.group,
    children,
    outfits,
    clothes: outfits[mannequin],
    mannequin,
    childEmotions: Object.fromEntries(
      Object.entries(saved.childEmotions || {}).filter(
        ([id, emotion]) =>
          children.some((c) => c.id === Number(id)) &&
          emotions.includes(emotion),
      ),
    ),
    activities: routines.filter((activity) => enabled.has(activity)),
  };
}
