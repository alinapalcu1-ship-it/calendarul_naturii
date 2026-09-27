import { clothingItems, type ClothingGender, type ClothingItem } from "../utils/clothingCatalog";

function Layer({ item }: { item: ClothingItem }) {
  return (
    <img
      className="fitted-layer"
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
      {/* Corpul este baza fixă. */}
      <img
        className="mannequin-base"
        src={asset("base")}
        alt=""
        draggable={false}
      />

      {/* Hainele care trebuie să stea pe corp. */}
      {bottoms.map((item) => <Layer key={item.id} item={item} />)}
      {tops.map((item) => <Layer key={item.id} item={item} />)}
      {outer.map((item) => <Layer key={item.id} item={item} />)}

      {/* Gâtul și mâinile revin în față: efect de haină îmbrăcată, nu lipită. */}
      <img
        className="fitted-foreground"
        src={asset("foreground-body")}
        alt=""
        draggable={false}
      />

      {/* Fularul trebuie să rămână în fața gâtului. */}
      {scarves.map((item) => <Layer key={item.id} item={item} />)}

      {/* Încălțămintea acoperă laba piciorului, iar glezna intră în pantof. */}
      {shoes.map((item) => <Layer key={item.id} item={item} />)}
      <img
        className="fitted-foreground"
        src={asset("foreground-shoes")}
        alt=""
        draggable={false}
      />

      {/* Pălăria/șapca: fața rămâne în față, iar părul lateral trece peste margini. */}
      {head.map((item) => <Layer key={item.id} item={item} />)}
      <img
        className="fitted-foreground"
        src={asset("foreground-head")}
        alt=""
        draggable={false}
      />

      {/* Aceste accesorii trebuie să fie complet în față. */}
      {gloves.map((item) => <Layer key={item.id} item={item} />)}
      {umbrellas.map((item) => <Layer key={item.id} item={item} />)}
    </div>
  );
}
