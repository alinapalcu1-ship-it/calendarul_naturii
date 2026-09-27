export type ClothingGender = "fata" | "baiat";
export type ClothingGroup = "top" | "bottom" | "outer" | "shoes" | "accessory";
export type ClothingSlot =
  | "top"
  | "bottom"
  | "outer"
  | "scarf"
  | "shoes"
  | "head"
  | "gloves"
  | "umbrella";

export type ClothingItem = {
  id: string;
  label: string;
  gender: ClothingGender;
  group: ClothingGroup;
  slot: ClothingSlot;
  src: string;
  thumb: string;
  zIndex: number;
};

// Coordinates are in the original 1086 × 1448 canvas, not viewport pixels.
// Paired items scale around each hand/foot, preserving the distance between them.
type Fit = {
  scaleX: number; scaleY: number;
  translateX: number; translateY: number;
  originX: number; originY: number;
  pair?: [number, number];
  inset?: number;
};
export const clothingFits: Record<ClothingGender, Record<ClothingSlot, Fit>> = {
  fata: {
    top: { scaleX: 1.04, scaleY: .82, translateX: 0, translateY: 42, originX: 543, originY: 538 },
    bottom: { scaleX: 1.08, scaleY: 1.02, translateX: 0, translateY: 12, originX: 543, originY: 820 },
    outer: { scaleX: 1.03, scaleY: .98, translateX: 0, translateY: 0, originX: 543, originY: 492 },
    scarf: { scaleX: 1, scaleY: .75, translateX: 0, translateY: 95, originX: 543, originY: 480 },
    shoes: { scaleX: 1.12, scaleY: 1.03, translateX: 0, translateY: -42, originX: 543, originY: 1436, pair: [399, 687], inset: 10 },
    head: { scaleX: 1.55, scaleY: 1.05, translateX: 0, translateY: -20, originX: 543, originY: 295 },
    gloves: { scaleX: 1.22, scaleY: 1.12, translateX: 0, translateY: 12, originX: 543, originY: 865, pair: [264, 822], inset: 0 },
    umbrella: { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, originX: 543, originY: 724 },
  },
  baiat: {
    top: { scaleX: 1.06, scaleY: .84, translateX: 0, translateY: 32, originX: 543, originY: 530 },
    bottom: { scaleX: 1.05, scaleY: 1.10, translateX: -2, translateY: -8, originX: 545, originY: 850 },
    outer: { scaleX: 1.04, scaleY: .98, translateX: 0, translateY: 0, originX: 543, originY: 490 },
    scarf: { scaleX: 1.05, scaleY: .75, translateX: 0, translateY: 100, originX: 543, originY: 480 },
    shoes: { scaleX: 1.16, scaleY: 1.04, translateX: 0, translateY: -12, originX: 543, originY: 1436, pair: [387, 699], inset: 14 },
    head: { scaleX: 1.55, scaleY: 1.10, translateX: 0, translateY: -8, originX: 543, originY: 280 },
    gloves: { scaleX: 1.25, scaleY: 1.15, translateX: 0, translateY: 18, originX: 543, originY: 875, pair: [254, 833], inset: 0 },
    umbrella: { scaleX: 1, scaleY: 1, translateX: 0, translateY: 0, originX: 543, originY: 724 },
  },
};

export function clothingFit(item: ClothingItem): Fit {
  const fit = clothingFits[item.gender][item.slot];
  if (item.slot === "head" && item.id.endsWith("02"))
    return { ...fit, scaleX: 1.95, scaleY: 1.12, translateY: 0 };
  // Skirts and shorts already end at the right height; do not stretch them like trousers.
  if (item.slot === "bottom" && (item.id.endsWith("04") || (item.gender === "fata" && item.id.endsWith("03"))))
    return { ...fit, scaleX: 1, scaleY: 1, translateY: item.gender === "baiat" ? 25 : 12 };
  return fit;
}

export const clothingGroups = [
  { id: "top", label: "Partea de sus" },
  { id: "bottom", label: "Partea de jos" },
  { id: "outer", label: "Exterior" },
  { id: "shoes", label: "Încălțăminte" },
  { id: "accessory", label: "Accesorii" },
] as const;

const base = `${import.meta.env.BASE_URL}assets/dress-ready`;

function item(
  gender: ClothingGender,
  group: ClothingGroup,
  slot: ClothingSlot,
  number: number,
  label: string,
  zIndex: number,
): ClothingItem {
  const prefix = gender === "fata" ? "girl" : "boy";
  const suffix = String(number).padStart(2, "0");
  const file = `${prefix}-${group}-${suffix}.png`;
  return {
    id: `${gender}_${group}_${suffix}`,
    label,
    gender,
    group,
    slot,
    src: `${base}/${prefix}/${file}`,
    thumb: `${base}/${prefix}/thumbs/${file}`,
    zIndex,
  };
}

export const clothingItems: ClothingItem[] = [
  // Fetiță — exact 4 opțiuni per categorie.
  item("fata", "top", "top", 1, "Bluză roz cu floricele", 30),
  item("fata", "top", "top", 2, "Bluză crem cu floricele", 30),
  item("fata", "top", "top", 3, "Cardigan mov", 30),
  item("fata", "top", "top", 4, "Hanorac roz", 30),

  item("fata", "bottom", "bottom", 1, "Colanți roz", 20),
  item("fata", "bottom", "bottom", 2, "Colanți mov", 20),
  item("fata", "bottom", "bottom", 3, "Fustă roz", 25),
  item("fata", "bottom", "bottom", 4, "Fustă denim", 25),

  item("fata", "outer", "outer", 1, "Geacă roz", 40),
  item("fata", "outer", "outer", 2, "Geacă mov", 40),
  item("fata", "outer", "outer", 3, "Pelerină galbenă", 40),
  item("fata", "outer", "scarf", 4, "Fular roz", 55),

  item("fata", "shoes", "shoes", 1, "Adidași roz", 60),
  item("fata", "shoes", "shoes", 2, "Pantofi crem", 60),
  item("fata", "shoes", "shoes", 3, "Adidași mov", 60),
  item("fata", "shoes", "shoes", 4, "Cizme roz", 60),

  item("fata", "accessory", "head", 1, "Pălărie de soare", 70),
  item("fata", "accessory", "head", 2, "Șapcă roz", 70),
  item("fata", "accessory", "gloves", 3, "Mănuși roz", 75),
  item("fata", "accessory", "umbrella", 4, "Umbrelă roz", 80),

  // Băiat — exact 4 opțiuni per categorie.
  item("baiat", "top", "top", 1, "Pulover cu mașinuță", 30),
  item("baiat", "top", "top", 2, "Pulover cu ursuleț", 30),
  item("baiat", "top", "top", 3, "Hanorac cu dinozaur", 30),
  item("baiat", "top", "top", 4, "Bluză crem-verde", 30),

  item("baiat", "bottom", "bottom", 1, "Blugi albaștri", 20),
  item("baiat", "bottom", "bottom", 2, "Pantaloni bej", 20),
  item("baiat", "bottom", "bottom", 3, "Pantaloni verzi", 20),
  item("baiat", "bottom", "bottom", 4, "Pantaloni scurți", 20),

  item("baiat", "outer", "outer", 1, "Geacă albastră", 40),
  item("baiat", "outer", "outer", 2, "Geacă verde", 40),
  item("baiat", "outer", "outer", 3, "Pelerină galbenă", 40),
  item("baiat", "outer", "scarf", 4, "Fular în carouri", 55),

  item("baiat", "shoes", "shoes", 1, "Adidași albaștri", 60),
  item("baiat", "shoes", "shoes", 2, "Adidași verzi", 60),
  item("baiat", "shoes", "shoes", 3, "Ghete maro", 60),
  item("baiat", "shoes", "shoes", 4, "Cizme albastre", 60),

  item("baiat", "accessory", "head", 1, "Pălărie de soare", 70),
  item("baiat", "accessory", "head", 2, "Șapcă albastră", 70),
  item("baiat", "accessory", "gloves", 3, "Mănuși albastre", 75),
  item("baiat", "accessory", "umbrella", 4, "Umbrelă cu dinozaur", 80),
];

export const findClothing = (id: string) =>
  clothingItems.find((item) => item.id === id);

export function selectClothing(current: string[], id: string) {
  if (current.includes(id)) return current.filter((value) => value !== id);
  const next = findClothing(id);
  if (!next) return current;

  return [
    ...current.filter((value) => {
      const old = findClothing(value);
      if (!old || old.gender !== next.gender) return false;
      // One item per actual body slot. This still allows a jacket + scarf,
      // or a hat + gloves + umbrella, because they occupy distinct slots.
      return old.slot !== next.slot;
    }),
    id,
  ];
}

export function cleanClothing(values: string[] = []) {
  return values.reduce<string[]>(
    (result, id) =>
      findClothing(id) && !result.includes(id)
        ? selectClothing(result, id)
        : result,
    [],
  );
}
