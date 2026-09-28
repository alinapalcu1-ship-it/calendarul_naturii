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
  // Tight sprites use their own frame; legacy PNGs keep the full doll canvas.
  frame?: { x: number; y: number; width: number; height: number };
};

// Coordinates are in the original 1086 × 1448 canvas, not viewport pixels.
// Paired items scale around each hand/foot, preserving the distance between them.
type Fit = {
  scaleX: number; scaleY: number;
  translateX: number; translateY: number;
  originX: number; originY: number;
  pair?: [number, number];
  inset?: number;
  mirrorX?: boolean;
  rotate?: number;
  sides?: [
    { translateX: number; translateY: number; rotate: number },
    { translateX: number; translateY: number; rotate: number },
  ];
};
export const clothingFits: Record<ClothingGender, Record<ClothingSlot, Fit>> = {
  fata: {
    top: { scaleX: 1.04, scaleY: .82, translateX: 0, translateY: 42, originX: 543, originY: 538 },
    bottom: { scaleX: 1.04, scaleY: 1.02, translateX: 0, translateY: 12, originX: 543, originY: 820 },
    outer: { scaleX: 1.03, scaleY: .98, translateX: 0, translateY: 0, originX: 543, originY: 492 },
    scarf: { scaleX: .87, scaleY: .65, translateX: 0, translateY: 92, originX: 543, originY: 480 },
    shoes: { scaleX: .90, scaleY: .98, translateX: 0, translateY: -42, originX: 543, originY: 1436, pair: [399, 687], inset: 6, sides: [{ translateX: 0, translateY: 0, rotate: 7 }, { translateX: -2, translateY: -1, rotate: -7 }] },
    head: { scaleX: 1.55, scaleY: 1.05, translateX: 0, translateY: -20, originX: 543, originY: 295 },
    gloves: { mirrorX: true, scaleX: .98, scaleY: .68, translateX: 0, translateY: 30, originX: 543, originY: 865, pair: [264, 822], inset: 0, sides: [{ translateX: -7, translateY: 0, rotate: 10 }, { translateX: 7, translateY: 0, rotate: -10 }] },
    umbrella: { scaleX: 1.56, scaleY: 1.70, translateX: -64, translateY: 12, originX: 890, originY: 865, rotate: 8 },
  },
  baiat: {
    top: { scaleX: 1.06, scaleY: .84, translateX: 0, translateY: 32, originX: 543, originY: 530 },
    bottom: { scaleX: 1.01, scaleY: 1.10, translateX: -2, translateY: -8, originX: 545, originY: 850 },
    outer: { scaleX: 1.04, scaleY: .98, translateX: 0, translateY: 0, originX: 543, originY: 490 },
    
    shoes: { scaleX: .96, scaleY: 1, translateX: 0, translateY: -14, originX: 543, originY: 1436, pair: [387, 699], inset: 8, sides: [{ translateX: 0, translateY: 0, rotate: 5 }, { translateX: 0, translateY: -1, rotate: -5 }] },
    scarf: { scaleX: .97, scaleY: .67, translateX: -2, translateY: 88, originX: 543, originY: 480 },
   
    head: { scaleX: 1.55, scaleY: 1.10, translateX: 0, translateY: -8, originX: 543, originY: 280 },
    gloves: { mirrorX: true, scaleX: .96, scaleY: .78, translateX: 0, translateY: 27, originX: 543, originY: 875, pair: [254, 833], inset: 0, sides: [{ translateX: 2, translateY: 0, rotate: 15 }, { translateX: -4, translateY: 0, rotate: -15 }] },
    umbrella: { scaleX: 1.60, scaleY: 1.74, translateX: -60, translateY: 30, originX: 890, originY: 865, rotate: 9 },
  },
};

// Hooded tops have narrower sleeves and higher collars than the other tops.
// Waist/hem corrections account for the different bounds of each source PNG.
const itemFits: Record<string, Partial<Fit>> = {
  fata_top_02: { scaleY: .85, translateY: 30 },
  fata_top_03: { scaleY: .87, translateY: 25 },
  fata_top_04: { scaleX: 1.22, scaleY: .94, translateY: -10 },
  baiat_top_03: { scaleX: 1.26, scaleY: .94, translateY: -5 },
  fata_outer_03: { scaleX: 1.18 },
  baiat_outer_03: { scaleX: 1.12 },
  fata_bottom_01: { scaleY: 1.045, translateY: 18 },
  fata_bottom_02: { scaleY: 1.05, translateY: 16 },
  fata_bottom_03: { scaleX: 1, scaleY: 1, translateY: 10 },
  fata_bottom_04: { scaleX: 1, scaleY: 1, translateY: 25 },
  baiat_bottom_01: { scaleY: 1.09, translateY: -6 },
  baiat_bottom_02: { scaleX: .99, scaleY: 1.08, translateY: 0 },
  baiat_bottom_03: { scaleX: 1, scaleY: 1.12, translateY: -12 },
  baiat_bottom_04: { scaleX: 1, scaleY: 1, translateY: 30 },
  // Each model has its own ankle angle, sole width and grounded sole height.
  fata_shoes_01: { scaleX: .93, scaleY: .96, translateY: -39, inset: 5, sides: [{ translateX: 0, translateY: 0, rotate: 6 }, { translateX: -1, translateY: -1, rotate: -6 }] },
  fata_shoes_02: { scaleX: .91, scaleY: .93, translateY: -40, inset: 5, sides: [{ translateX: 0, translateY: 0, rotate: 5 }, { translateX: -1, translateY: -1, rotate: -5 }] },
  fata_shoes_03: { scaleX: .94, scaleY: .96, translateY: -39, inset: 4, sides: [{ translateX: 0, translateY: 0, rotate: 6 }, { translateX: -1, translateY: -1, rotate: -6 }] },
  fata_shoes_04: { scaleX: .93, scaleY: 1, translateY: -38, pair: [395, 691], inset: 9, sides: [{ translateX: 0, translateY: 0, rotate: 8 }, { translateX: -1, translateY: -1, rotate: -8 }] },
  baiat_shoes_01: { scaleX: .99, scaleY: .98, translateY: -10, inset: 7, sides: [{ translateX: 0, translateY: 0, rotate: 4 }, { translateX: 0, translateY: -1, rotate: -4 }] },
  baiat_shoes_02: { scaleX: .98, scaleY: .97, translateY: -10, inset: 6, sides: [{ translateX: 0, translateY: 0, rotate: 5 }, { translateX: 0, translateY: -1, rotate: -5 }] },
  baiat_shoes_03: { scaleX: .97, scaleY: 1, translateY: -9, pair: [385, 701], inset: 9, sides: [{ translateX: 0, translateY: 0, rotate: 6 }, { translateX: 0, translateY: -1, rotate: -6 }] },
  baiat_shoes_04: { scaleX: .96, scaleY: 1, translateY: -8, pair: [386, 700], inset: 8, sides: [{ translateX: 0, translateY: 0, rotate: 7 }, { translateX: 0, translateY: -1, rotate: -7 }] },
};

export function clothingFit(item: ClothingItem): Fit {
  const fit = clothingFits[item.gender][item.slot];
  if (item.slot === "head" && item.id.endsWith("02"))
    return { ...fit, scaleX: 1.95, scaleY: 1.12, translateY: 0 };
  return { ...fit, ...itemFits[item.id] };
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

function newSprite(gender: ClothingGender, slot: "top" | "head", file: string, label: string, frame: NonNullable<ClothingItem["frame"]>): ClothingItem {
  const prefix = gender === "fata" ? "girl" : "boy";
  const src = `${base}/${prefix}/${prefix}-${file}.png`;
  return { id: `${gender}_${file}`, label, gender, group: slot === "top" ? "top" : "accessory", slot, src, thumb: src, zIndex: slot === "top" ? 30 : 70, frame };
}

// Keep the saved scarf IDs and file paths while moving their UI category.
function scarf(gender: ClothingGender, label: string): ClothingItem {
  return { ...item(gender, "outer", "scarf", 4, label, 55), group: "accessory" };
}

export const clothingItems: ClothingItem[] = [
  // Fetiță
  item("fata", "top", "top", 1, "Bluză roz cu floricele", 30),
  item("fata", "top", "top", 2, "Bluză crem cu floricele", 30),
  item("fata", "top", "top", 3, "Cardigan mov", 30),
  item("fata", "top", "top", 4, "Hanorac roz", 30),
  newSprite("fata", "top", "tshirt", "Tricou crem cu curcubeu", { x: 249, y: 546, width: 587, height: 350 }),

  item("fata", "bottom", "bottom", 1, "Colanți roz", 20),
  item("fata", "bottom", "bottom", 2, "Colanți mov", 20),
  item("fata", "bottom", "bottom", 3, "Fustă roz", 25),
  item("fata", "bottom", "bottom", 4, "Fustă denim", 25),

  item("fata", "outer", "outer", 1, "Geacă roz", 40),
  item("fata", "outer", "outer", 2, "Geacă mov", 40),
  item("fata", "outer", "outer", 3, "Pelerină galbenă", 40),

  item("fata", "shoes", "shoes", 1, "Adidași roz", 60),
  item("fata", "shoes", "shoes", 2, "Pantofi crem", 60),
  item("fata", "shoes", "shoes", 3, "Adidași mov", 60),
  item("fata", "shoes", "shoes", 4, "Cizme roz", 60),

  item("fata", "accessory", "head", 1, "Pălărie de soare", 70),
  item("fata", "accessory", "head", 2, "Șapcă roz", 70),
  newSprite("fata", "head", "winter-hat", "Căciulă roz-lila cu pompon", { x: 226, y: 3, width: 634, height: 327 }),
  item("fata", "accessory", "gloves", 3, "Mănuși roz", 75),
  item("fata", "accessory", "umbrella", 4, "Umbrelă roz", -1),
  scarf("fata", "Fular roz"),

  // Băiat
  item("baiat", "top", "top", 1, "Pulover cu mașinuță", 30),
  item("baiat", "top", "top", 2, "Pulover cu ursuleț", 30),
  item("baiat", "top", "top", 3, "Hanorac cu dinozaur", 30),
  item("baiat", "top", "top", 4, "Bluză crem-verde", 30),
  newSprite("baiat", "top", "tshirt", "Tricou crem cu bărcuță", { x: 221, y: 558, width: 644, height: 340 }),

  item("baiat", "bottom", "bottom", 1, "Blugi albaștri", 20),
  item("baiat", "bottom", "bottom", 2, "Pantaloni bej", 20),
  item("baiat", "bottom", "bottom", 3, "Pantaloni verzi", 20),
  item("baiat", "bottom", "bottom", 4, "Pantaloni scurți", 20),

  item("baiat", "outer", "outer", 1, "Geacă albastră", 40),
  item("baiat", "outer", "outer", 2, "Geacă verde", 40),
  item("baiat", "outer", "outer", 3, "Pelerină galbenă", 40),

  item("baiat", "shoes", "shoes", 1, "Adidași albaștri", 60),
  item("baiat", "shoes", "shoes", 2, "Adidași verzi", 60),
  item("baiat", "shoes", "shoes", 3, "Ghete maro", 60),
  item("baiat", "shoes", "shoes", 4, "Cizme albastre", 60),

  item("baiat", "accessory", "head", 1, "Pălărie de soare", 70),
  item("baiat", "accessory", "head", 2, "Șapcă albastră", 70),
  newSprite("baiat", "head", "winter-hat", "Căciulă bleu-verde cu pompon", { x: 265, y: 4, width: 556, height: 324 }),
  item("baiat", "accessory", "gloves", 3, "Mănuși albastre", 75),
  item("baiat", "accessory", "umbrella", 4, "Umbrelă cu dinozaur", -1),
  scarf("baiat", "Fular în carouri"),
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
