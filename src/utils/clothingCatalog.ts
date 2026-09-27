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
