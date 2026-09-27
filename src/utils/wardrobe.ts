export type GarmentSlot =
  "top" | "bottom" | "dress" | "outer" | "head" | "shoes" | "accessory";
export type GarmentColor =
  "ivory" | "coral" | "blue" | "denim" | "rose" | "gold" | "plum" | "sage";
export interface Garment {
  id: string;
  label: string;
  slot: GarmentSlot;
  shape: string;
  color: GarmentColor;
  detail?: "dots" | "stripes" | "seams" | "quilt";
}
export const garmentPalettes: Record<GarmentColor, [string, string, string]> = {
  ivory: ["#fffdf4", "#eae1cb", "#c8b99d"],
  coral: ["#ffb8a2", "#e78270", "#b95050"],
  blue: ["#c7e4f3", "#80b5d3", "#477eaa"],
  denim: ["#9abdd6", "#668dad", "#385b80"],
  rose: ["#f4c4cb", "#d994a6", "#b56584"],
  gold: ["#ffe793", "#edc157", "#c8952f"],
  plum: ["#d2aac7", "#a875a0", "#765075"],
  sage: ["#d0dfb6", "#9cb782", "#698258"],
};
// Original IDs are retained so existing local selections continue to work.
export const garments: Garment[] = [
  {
    id: "Tricou mentă",
    label: "Tricou mentă",
    slot: "top",
    shape: "tee",
    color: "sage",
  },
  {
    id: "Hanorac albastru",
    label: "Hanorac albastru",
    slot: "top",
    shape: "hoodie",
    color: "blue",
  },
  {
    id: "Rochiță piersică",
    label: "Rochiță piersică",
    slot: "dress",
    shape: "summer-dress",
    color: "coral",
    detail: "dots",
  },
  {
    id: "Tricou",
    label: "Tricou roșu",
    slot: "top",
    shape: "tee",
    color: "coral",
  },
  {
    id: "Tricou alb",
    label: "Tricou alb",
    slot: "top",
    shape: "tee",
    color: "ivory",
  },
  {
    id: "Tricou cu model",
    label: "Tricou cu model",
    slot: "top",
    shape: "tee",
    color: "gold",
    detail: "stripes",
  },
  {
    id: "Bluză",
    label: "Bluză albastră",
    slot: "top",
    shape: "long",
    color: "blue",
  },
  {
    id: "Pulover verde",
    label: "Pulover verde",
    slot: "top",
    shape: "sweater",
    color: "sage",
    detail: "stripes",
  },
  {
    id: "Pulover simplu",
    label: "Pulover simplu",
    slot: "top",
    shape: "sweater",
    color: "plum",
  },
  {
    id: "Hanorac",
    label: "Hanorac",
    slot: "top",
    shape: "hoodie",
    color: "rose",
  },
  {
    id: "Pantaloni scurți",
    label: "Pantaloni scurți",
    slot: "bottom",
    shape: "shorts",
    color: "gold",
  },
  {
    id: "Pantaloni",
    label: "Pantaloni lungi",
    slot: "bottom",
    shape: "trousers",
    color: "sage",
  },
  {
    id: "Blugi",
    label: "Blugi",
    slot: "bottom",
    shape: "jeans",
    color: "denim",
    detail: "seams",
  },
  {
    id: "Colanți",
    label: "Colanți",
    slot: "bottom",
    shape: "leggings",
    color: "plum",
  },
  {
    id: "Pantaloni groși",
    label: "Pantaloni groși",
    slot: "bottom",
    shape: "winter-pants",
    color: "blue",
    detail: "quilt",
  },
  {
    id: "Rochiță",
    label: "Rochiță roz",
    slot: "dress",
    shape: "dress",
    color: "rose",
  },
  {
    id: "Rochiță de vară",
    label: "Rochiță de vară",
    slot: "dress",
    shape: "summer-dress",
    color: "gold",
    detail: "dots",
  },
  {
    id: "Rochiță cu mânecă lungă",
    label: "Rochiță cu mânecă lungă",
    slot: "dress",
    shape: "long-dress",
    color: "plum",
  },
  {
    id: "Rochiță cu buline",
    label: "Rochiță cu buline",
    slot: "dress",
    shape: "dress",
    color: "blue",
    detail: "dots",
  },
  {
    id: "Fustă",
    label: "Fustă",
    slot: "bottom",
    shape: "skirt",
    color: "coral",
  },
  {
    id: "Geacă",
    label: "Geacă subțire",
    slot: "outer",
    shape: "jacket",
    color: "sage",
  },
  {
    id: "Geacă de ploaie",
    label: "Geacă de ploaie",
    slot: "outer",
    shape: "raincoat",
    color: "gold",
  },
  {
    id: "Haină groasă",
    label: "Haină groasă",
    slot: "outer",
    shape: "coat",
    color: "plum",
    detail: "quilt",
  },
  {
    id: "Geacă pufoasă",
    label: "Geacă pufoasă",
    slot: "outer",
    shape: "puffer",
    color: "blue",
    detail: "quilt",
  },
  {
    id: "Parka",
    label: "Parka",
    slot: "outer",
    shape: "parka",
    color: "denim",
  },
  {
    id: "Căciulă",
    label: "Căciulă",
    slot: "head",
    shape: "beanie",
    color: "coral",
  },
  { id: "Șapcă", label: "Șapcă", slot: "head", shape: "cap", color: "sage" },
  {
    id: "Pălărie de vară",
    label: "Pălărie de vară",
    slot: "head",
    shape: "sunhat",
    color: "gold",
  },
  {
    id: "Pantofi",
    label: "Pantofi",
    slot: "shoes",
    shape: "shoes",
    color: "coral",
  },
  {
    id: "Adidași",
    label: "Adidași",
    slot: "shoes",
    shape: "sneakers",
    color: "blue",
  },
  {
    id: "Sandale",
    label: "Sandale",
    slot: "shoes",
    shape: "sandals",
    color: "gold",
  },
  { id: "Cizme", label: "Cizme", slot: "shoes", shape: "boots", color: "plum" },
  {
    id: "Cizme de ploaie",
    label: "Cizme de ploaie",
    slot: "shoes",
    shape: "rainboots",
    color: "blue",
  },
  {
    id: "Umbrelă",
    label: "Umbrelă",
    slot: "accessory",
    shape: "umbrella",
    color: "blue",
  },
  {
    id: "Fular",
    label: "Fular",
    slot: "accessory",
    shape: "scarf",
    color: "coral",
  },
  {
    id: "Mănuși",
    label: "Mănuși",
    slot: "accessory",
    shape: "mittens",
    color: "gold",
  },
];
// Keep legacy definitions to render older saved outfits; offer only 14 clear choices.
const visibleIds = new Set([
  "Tricou",
  "Bluză",
  "Pantaloni scurți",
  "Blugi",
  "Rochiță de vară",
  "Fustă",
  "Geacă",
  "Geacă pufoasă",
  "Căciulă",
  "Pălărie de vară",
  "Pantofi",
  "Cizme",
  "Umbrelă",
  "Fular",
]);
const visibleGarments = garments.filter((g) => visibleIds.has(g.id));
export const wardrobeCategories = [
  {
    id: "tops",
    name: "Topuri",
    items: visibleGarments.filter((g) => g.slot === "top"),
  },
  {
    id: "bottoms",
    name: "Pantaloni",
    items: visibleGarments.filter(
      (g) => g.slot === "bottom" && g.shape !== "skirt",
    ),
  },
  {
    id: "dresses",
    name: "Rochițe și fuste",
    items: visibleGarments.filter(
      (g) => g.slot === "dress" || g.shape === "skirt",
    ),
  },
  {
    id: "outer",
    name: "Geci și haine",
    items: visibleGarments.filter((g) => g.slot === "outer"),
  },
  {
    id: "head",
    name: "Pentru cap",
    items: visibleGarments.filter((g) => g.slot === "head"),
  },
  {
    id: "shoes",
    name: "Încălțăminte",
    items: visibleGarments.filter((g) => g.slot === "shoes"),
  },
  {
    id: "accessories",
    name: "Accesorii",
    items: visibleGarments.filter((g) => g.slot === "accessory"),
  },
];
export const getGarment = (id: string) => garments.find((g) => g.id === id);
export function toggleGarment(current: string[], id: string): string[] {
  if (current.includes(id)) return current.filter((item) => item !== id);
  const next = getGarment(id);
  if (!next) return current;
  return [
    ...current.filter((item) => {
      const old = getGarment(item);
      if (!old) return true;
      if (old.slot === next.slot && next.slot !== "accessory") return false;
      if (
        ((old.slot === "top" || old.slot === "bottom") &&
          next.slot === "dress") ||
        (old.slot === "dress" &&
          (next.slot === "top" || next.slot === "bottom"))
      )
        return false;
      if (
        (old.shape === "skirt" && next.slot === "dress") ||
        (next.shape === "skirt" && old.slot === "dress")
      )
        return false;
      return true;
    }),
    id,
  ];
}

/** Reconcile old saved outfits without changing identifiers or unrelated data. */
export function normalizeOutfit(items: string[]): string[] {
  return items.reduce<string[]>((result, id) => {
    if (!getGarment(id) || result.includes(id)) return result;
    return toggleGarment(result, id);
  }, []);
}
