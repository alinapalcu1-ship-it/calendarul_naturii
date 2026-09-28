import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useLanguage } from "../i18n/LanguageContext";
import { useState } from "react";
import type { PageProps } from "../types";
import { ClothingMannequin } from "../components/ClothingMannequin";
import {
  clothingGroups,
  clothingItems,
  cleanClothing,
  selectClothing,
} from "../utils/clothingCatalog";
import { Icon } from "../components/Icon";
export default function ClothingPage({ state, update }: PageProps) {
  const { t, labelFor } = useLanguage();
  const { playWord } = useAudioPlayer();
  const [category, setCategory] = useState<string>("top");
  const gender = state.mannequin === "boy" ? "baiat" : "fata";
  const outfit = cleanClothing(state.clothes);
  const items = clothingItems.filter(
    (item) =>
      item.gender === gender && item.group === category,
  );
  return (
    <div className="final-dressing">
      <div className="final-doll-stage">
        <div
          className="character-picker"
          role="group"
          aria-label={t("Alege personajul")}
        >
          {(
            [
              ["girl", "Fetiță"],
              ["boy", "Băiat"],
            ] as const
          ).map(([variant, label]) => (
            <button
              key={variant}
              aria-pressed={state.mannequin === variant}
              className={state.mannequin === variant ? "active" : ""}
              onClick={() => {
                if (state.mannequin !== variant) update({ mannequin: variant });
                playWord(label);
              }}
            >
              {labelFor(label)}
              {state.mannequin === variant && <Icon name="check" size={20} />}
            </button>
          ))}
        </div>
        <ClothingMannequin gender={gender} clothes={outfit} />
        <button
          className="secondary clothing-reset"
          onClick={() => update({ clothes: [] })}
        >
          <Icon name="reset" size={22} />{t("Încep din nou")}</button>
      </div>
      <div className="final-wardrobe">
        <div
          className="final-categories"
          role="group"
          aria-label={t("Categorii de haine")}
        >
          {clothingGroups.map((group) => (
            <button
              key={group.id}
              aria-pressed={category === group.id}
              className={category === group.id ? "active" : ""}
              onClick={() => setCategory(group.id)}
            >
              {labelFor(group.label)}
            </button>
          ))}
        </div>
        <p className="clothing-instruction">{t("Atinge o hăinuță. Atinge din nou ca să o scoți.")}</p>
        <div
          className="final-garment-grid"
          aria-label={
            labelFor(clothingGroups.find((group) => group.id === category)?.label || "")
          }
        >
          {items.map((item) => (
            <button
              key={item.id}
              className={`final-garment ${outfit.includes(item.id) ? "selected" : ""}`}
              data-garment={item.id}
              aria-pressed={outfit.includes(item.id)}
              onClick={() =>
                update({ clothes: selectClothing(outfit, item.id) })
              }
            >
              <img src={item.thumb} alt="" draggable={false} />
              <span>{labelFor(item.label)}</span>
              {outfit.includes(item.id) && (
                <span className="clothes-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
