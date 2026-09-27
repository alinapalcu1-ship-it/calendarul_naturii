import { clothingFit, clothingItems, type ClothingGender, type ClothingItem } from "../utils/clothingCatalog";

function Layer({ item, front = false }: { item: ClothingItem; front?: boolean }) {
  if (item.frame) {
    const { x, y, width, height } = item.frame;
    return <img className="fitted-layer" data-item={front ? undefined : item.id}
      data-slot={front ? undefined : item.slot} src={item.src} alt="" draggable={false}
      style={{ left: `${x / 1086 * 100}%`, top: `${y / 1448 * 100}%`, width: `${width / 1086 * 100}%`, height: `${height / 1448 * 100}%`, objectFit: "fill", zIndex: item.zIndex }} />;
  }
  const fit = clothingFit(item);
  return (fit.pair ?? [fit.originX]).map((originX, side) => {
    const adjustment = fit.sides?.[side];
    const x = fit.translateX + (adjustment?.translateX ?? 0) +
      (fit.pair ? (side === 0 ? 1 : -1) * (fit.inset ?? 0) : 0);
    const y = fit.translateY + (adjustment?.translateY ?? 0);
    // Exclude detached edge pixels in the existing glove PNGs without editing assets.
    const gloveClip = item.gender === "baiat"
      ? (side === 0 ? "inset(53% 70.5% 33% 17.8%)" : "inset(53% 17.8% 33% 70.5%)")
      : (side === 0 ? "inset(53% 69.5% 33% 18%)" : "inset(53% 18% 33% 69.5%)");
    return (
      <img
        key={side}
        className="fitted-layer"
        data-item={front ? undefined : item.id}
        data-slot={front ? undefined : item.slot}
        src={item.src}
        alt=""
        draggable={false}
        style={{
          zIndex: item.slot === "scarf" && !front ? 44 : item.zIndex,
          transformOrigin: `${originX / 1086 * 100}% ${fit.originY / 1448 * 100}%`,
          transform: `translate(${x / 1086 * 100}%, ${y / 1448 * 100}%) rotate(${adjustment?.rotate ?? 0}deg) scale(${fit.scaleX}, ${fit.scaleY})`,
          clipPath: item.slot === "gloves" ? gloveClip : fit.pair ? (side === 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)") : undefined,
        }}
      />
    );
  });
}

export function ClothingMannequin({ gender, clothes }: { gender: ClothingGender; clothes: string[] }) {
  const prefix = gender === "fata" ? "girl" : "boy";
  const selected = clothingItems.filter(item => item.gender === gender && clothes.includes(item.id));
  const collar = selected.find(item => item.slot === "outer") ?? selected.find(item => item.slot === "top");
  const hooded = collar?.slot === "outer" || collar?.id === "fata_top_04" || collar?.id === "baiat_top_03";
  const tshirt = collar?.id.endsWith("_tshirt");
  const scarf = selected.find(item => item.slot === "scarf");
  const winterHat = selected.some(item => item.id.endsWith("_winter-hat"));
  const base = `${import.meta.env.BASE_URL}assets/dress-ready/${prefix}/${prefix}-base.png`;
  return (
    <div className="fitted-mannequin" role="img" aria-label={`${gender === "fata" ? "Fetiță" : "Băiat"}, ${selected.length} articole alese`}>
      <img className="mannequin-base" src={base} alt="" draggable={false}
        style={{ clipPath: winterHat ? "inset(20% 0 0 0)" : undefined }} />
      {selected.map(item => <Layer key={item.id} item={item} />)}
      {/* Reuse the unmodified base and garment: collar back, neck, collar front.
          Hands and feet are never painted over fitted clothing. Hats remain above hair. */}
      {(collar || scarf) && [
        `inset(${winterHat ? 20 : 0}% 0 62.2% 0)`,
        tshirt ? "ellipse(7.2% 3.8% at 50% 39.5%)" : "ellipse(7.2% 3% at 50% 39.2%)",
      ].map(clipPath => (
        <img key={clipPath} className="fitted-foreground" src={base} alt="" draggable={false}
          style={{ zIndex: 45, clipPath }} />
      ))}
      {collar && (
        <div className="fitted-collar-front" aria-hidden="true"
          style={{ clipPath: `inset(${tshirt ? 43 : hooded ? 41 : 40}% 38% 54% 38%)` }}>
          <Layer item={collar} front />
        </div>
      )}
      {scarf && (
        <div className="fitted-collar-front" aria-hidden="true"
          style={{ zIndex: 55, clipPath: "inset(41.3% 0 0 0)" }}>
          <Layer item={scarf} front />
        </div>
      )}
    </div>
  );
}
