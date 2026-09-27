import { clothingFit, clothingItems, type ClothingGender, type ClothingItem } from "../utils/clothingCatalog";

function Layer({ item }: { item: ClothingItem }) {
  const fit = clothingFit(item);
  return (fit.pair ?? [fit.originX]).map((originX, side) => (
    <img
      key={side}
      className="fitted-layer"
      data-item={item.id}
      data-slot={item.slot}
      src={item.src}
      alt=""
      draggable={false}
      style={{
        zIndex: item.zIndex,
        transformOrigin: `${originX / 1086 * 100}% ${fit.originY / 1448 * 100}%`,
        transform: `translate(${(fit.translateX + (fit.pair ? (side === 0 ? 1 : -1) * (fit.inset ?? 0) : 0)) / 1086 * 100}%, ${fit.translateY / 1448 * 100}%) scale(${fit.scaleX}, ${fit.scaleY})`,
        clipPath: fit.pair ? (side === 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)") : undefined,
      }}
    />
  ));
}

export function ClothingMannequin({ gender, clothes }: { gender: ClothingGender; clothes: string[] }) {
  const prefix = gender === "fata" ? "girl" : "boy";
  const selected = clothingItems.filter(item => item.gender === gender && clothes.includes(item.id));
  return (
    <div className="fitted-mannequin" role="img" aria-label={`${gender === "fata" ? "Fetiță" : "Băiat"}, ${selected.length} articole alese`}>
      <img className="mannequin-base" src={`${import.meta.env.BASE_URL}assets/dress-ready/${prefix}/${prefix}-base.png`} alt="" draggable={false} />
      {/* The catalog controls stacking. Body/feet foregrounds would cover clothes;
          the old glove underlay painted exposed fingers instead of fitting gloves. */}
      {selected.map(item => <Layer key={item.id} item={item} />)}
      {selected.some(item => item.slot === "outer") && [
        "inset(0 0 62.2% 0)",
        "ellipse(7.2% 3% at 50% 39.2%)",
      ].map(clipPath => (
        <img
          key={clipPath}
          className="fitted-foreground"
          src={`${import.meta.env.BASE_URL}assets/dress-ready/${prefix}/${prefix}-base.png`}
          alt=""
          draggable={false}
          style={{
            zIndex: 45,
            // Only the head and neck come in front of a hood, never arms or feet.
            clipPath,
          }}
        />
      ))}
    </div>
  );
}
