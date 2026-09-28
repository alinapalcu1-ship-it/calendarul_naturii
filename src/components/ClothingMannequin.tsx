import { useLanguage } from "../i18n/LanguageContext";
import { clothingFit, clothingItems, type ClothingGender, type ClothingItem } from "../utils/clothingCatalog";

function Layer({ item, front = false }: { item: ClothingItem; front?: boolean }) {
  if (item.frame) {
    const { x, y, width, height } = item.frame;
    return <img className="fitted-layer" data-item={front ? undefined : item.id}
      data-slot={front ? undefined : item.slot} src={item.src} alt="" draggable={false}
      style={{ left: `${x / 1086 * 100}%`, top: `${y / 1448 * 100}%`, width: `${width / 1086 * 100}%`, height: `${height / 1448 * 100}%`, objectFit: "fill", zIndex: item.zIndex }} />;
  }
  const fit = clothingFit(item);
  if (item.slot === "umbrella") {
    // Crop only the transparent canvas margins, not the source artwork. This
    // keeps the outward tilt from creating horizontal scrolling on phones.
    const x = 720, y = 590, width = 340, height = 308;
    return <div className="fitted-layer" data-item={item.id} data-slot={item.slot}
      style={{ left: `${x / 1086 * 100}%`, top: `${y / 1448 * 100}%`,
        width: `${width / 1086 * 100}%`, height: `${height / 1448 * 100}%`,
        overflow: "hidden", zIndex: item.zIndex,
        transformOrigin: `${(fit.originX - x) / width * 100}% ${(fit.originY - y) / height * 100}%`,
        transform: `translate(${fit.translateX / width * 100}%, ${fit.translateY / height * 100}%) rotate(${fit.rotate ?? 0}deg) scale(${fit.scaleX}, ${fit.scaleY})` }}>
      <img src={item.src} alt="" draggable={false} style={{ position: "absolute",
        maxWidth: "none", width: `${1086 / width * 100}%`, height: `${1448 / height * 100}%`,
        left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} />
    </div>;
  }
  return (fit.pair ?? [fit.originX]).map((originX, side) => {
    const adjustment = fit.sides?.[side];
    const x = fit.translateX + (adjustment?.translateX ?? 0) +
      (fit.pair ? (side === 0 ? 1 : -1) * (fit.inset ?? 0) : 0);
    const y = fit.translateY + (adjustment?.translateY ?? 0);
    // Source-pixel bounds retain the whole glove but exclude detached specks.
    // Mirror each glove locally: the source thumbs point away from the doll.
    const bounds = item.gender === "baiat"
      ? (side === 0 ? [196, 783, 318, 962] : [767, 783, 888, 962])
      : (side === 0 ? [203, 788, 317, 952] : [771, 788, 884, 952]);
    const gloveClip = `inset(${bounds[1] / 1448 * 100}% ${(1086 - bounds[2]) / 1086 * 100}% ${(1448 - bounds[3]) / 1448 * 100}% ${bounds[0] / 1086 * 100}%)`;

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
          transform: `translate(${x / 1086 * 100}%, ${y / 1448 * 100}%) rotate(${adjustment?.rotate ?? fit.rotate ?? 0}deg) scale(${fit.mirrorX ? -fit.scaleX : fit.scaleX}, ${fit.scaleY})`,
          clipPath: item.slot === "gloves" ? gloveClip : fit.pair
            ? (side === 0 ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)")
            : undefined,
        }}
      />
    );
  });
}
export function ClothingMannequin({ gender, clothes }: { gender: ClothingGender; clothes: string[] }) {
  const { t, labelFor } = useLanguage();
  const prefix = gender === "fata" ? "girl" : "boy";
  const selected = clothingItems.filter(item => item.gender === gender && clothes.includes(item.id));
  const collar = selected.find(item => item.slot === "outer") ?? selected.find(item => item.slot === "top");
  const hooded = collar?.slot === "outer" || collar?.id === "fata_top_04" || collar?.id === "baiat_top_03";
  const tshirt = collar?.id.endsWith("_tshirt");
  const scarf = selected.find(item => item.slot === "scarf");
  const umbrella = selected.find(item => item.slot === "umbrella");
  const gloves = selected.some(item => item.slot === "gloves");
  const winterHat = selected.some(item => item.id.endsWith("_winter-hat"));
  // The glove sprites have open fingers; the base has a closed hand. Hide only
  // the covered bare-hand silhouette below the cuffs, retaining both forearms.
  const wrist = gender === "fata" ? [239, 843, 320, 865] : [235, 830, 321, 858];
  const px = (x: number) => `${x / 1086 * 100}%`;
  const py = (y: number) => `${y / 1448 * 100}%`;
  const baseClip = gloves
    ? `polygon(0 ${winterHat ? 20 : 0}%, 100% ${winterHat ? 20 : 0}%, 100% ${py(wrist[1])}, ${px(1086 - wrist[0])} ${py(wrist[1])}, ${px(1086 - wrist[2])} ${py(wrist[3])}, ${px(1086 - wrist[2])} ${py(990)}, 100% ${py(990)}, 100% 100%, 0 100%, 0 ${py(990)}, ${px(wrist[2])} ${py(990)}, ${px(wrist[2])} ${py(wrist[3])}, ${px(wrist[0])} ${py(wrist[1])}, 0 ${py(wrist[1])})`
    : winterHat ? "inset(20% 0 0 0)" : undefined;
  const base = `${import.meta.env.BASE_URL}assets/dress-ready/${prefix}/${prefix}-base.png`;
  return (
    <div className="fitted-mannequin" style={{ overflow: umbrella ? "visible" : undefined }} role="img" aria-label={t("{character}, {count} articole alese", { character: labelFor(gender === "fata" ? "Fetiță" : "Băiat"), count: selected.length })}>
      {umbrella && <Layer item={umbrella} />}
      {/* Only the tilted canopy may extend into the stage padding. Keep the
          other garment canvases clipped, with their existing layer order. */}
      <div style={{ position: "absolute", inset: 0, overflow: "clip", zIndex: 0 }}>
      <img className="mannequin-base" src={base} alt="" draggable={false}
        style={{ clipPath: baseClip }} />
      {selected.filter(item => item.slot !== "umbrella").map(item => <Layer key={item.id} item={item} />)}
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
    </div>
  );
}
