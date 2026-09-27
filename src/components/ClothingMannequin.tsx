import { clothingItems, type ClothingGender, type ClothingItem } from "../utils/clothingCatalog";

function Layer({ item, className = "" }: { item: ClothingItem; className?: string }) {
  return (
    <img
      className={`fitted-layer ${className}`.trim()}
      src={item.src}
      alt=""
      draggable={false}
    />
  );
}

export function ClothingMannequin({
  gender,
  clothes,
}: {
  gender: ClothingGender;
  clothes: string[];
}) {
  const prefix = gender === "fata" ? "girl" : "boy";
  const selected = clothingItems.filter(
    (item) => item.gender === gender && clothes.includes(item.id),
  );

  const inSlots = (...slots: ClothingItem["slot"][]) =>
    selected.filter((item) => slots.includes(item.slot));

  const bottoms = inSlots("bottom");
  const tops = inSlots("top");
  const outer = inSlots("outer");
  const scarves = inSlots("scarf");
  const shoes = inSlots("shoes");
  const head = inSlots("head");
  const gloves = inSlots("gloves");
  const umbrellas = inSlots("umbrella");

  const asset = (name: string) =>
    `${import.meta.env.BASE_URL}assets/dress-ready/${prefix}/${prefix}-${name}.png`;

  return (
    <div
      className="fitted-mannequin"
      role="img"
      aria-label={`${gender === "fata" ? "Fetiță" : "Băiat"}, ${selected.length} articole alese`}
    >
      <img className="mannequin-base" src={asset("base")} alt="" draggable={false} />

      {/* Fiecare PNG este deja aliniat pe același canvas ca manechinul.
          Nu mascăm corpul peste haine: gulerul, mânecile, pantalonii și
          încălțămintea rămân naturale și nu mai apar tăieturi artificiale. */}
      {bottoms.map((item) => <Layer key={item.id} item={item} />)}
      {tops.map((item) => <Layer key={item.id} item={item} />)}
      {outer.map((item) => <Layer key={item.id} item={item} />)}
      {scarves.map((item) => <Layer key={item.id} item={item} />)}
      {shoes.map((item) => <Layer key={item.id} item={item} />)}
      {head.map((item) => <Layer key={item.id} item={item} />)}
      {gloves.length > 0 && (
        <img
          className="fitted-layer"
          src={asset("gloves-underlay")}
          alt=""
          draggable={false}
        />
      )}
      {gloves.map((item) => <Layer key={item.id} item={item} />)}
      {umbrellas.map((item) => <Layer key={item.id} item={item} />)}
    </div>
  );
}
