import { WeekdayArt } from "./WeekdayArt";
import { SeasonArt } from "./SeasonArt";
import type { CSSProperties } from "react";

const sheets = {
  premium: { file: "premium-emotions-routine.png", columns: 4, rows: 3 },
  months: { file: "premium-months.png", columns: 4, rows: 3 },
  days: { file: "premium-weekdays.png", columns: 4, rows: 2 },
  world: { file: "storybook-world.png", columns: 4, rows: 3 },
  weather: { file: "storybook-weather.png", columns: 4, rows: 2 },
  emotions: { file: "storybook-emotions.png", columns: 3, rows: 2 },
  clothes: { file: "premium-clothes.png", columns: 4, rows: 4 },
};
type Sheet = keyof typeof sheets;
const illustrations: Record<string, [Sheet, number]> = {
  "Mic dejun": ["premium", 7],
  Activități: ["premium", 9],
  "Masa de prânz": ["premium", 10],
  Luni: ["days", 0],
  Marți: ["days", 1],
  Miercuri: ["days", 2],
  Joi: ["days", 3],
  Vineri: ["days", 4],
  Sâmbătă: ["days", 5],
  Duminică: ["days", 6],
  avatar: ["days", 7],
  girl: ["clothes", 13],
  boy: ["clothes", 14],
  Ianuarie: ["months", 0],
  Februarie: ["months", 1],
  Martie: ["months", 2],
  Aprilie: ["months", 3],
  Mai: ["months", 4],
  Iunie: ["months", 5],
  Iulie: ["months", 6],
  August: ["months", 7],
  Septembrie: ["months", 8],
  Octombrie: ["months", 9],
  Noiembrie: ["months", 10],
  Decembrie: ["months", 11],
  calendar: ["world", 0],
  season: ["world", 1],
  weather: ["world", 2],
  clothing: ["world", 3],
  attendance: ["world", 4],
  emotions: ["premium", 0],
  helper: ["world", 6],
  summary: ["world", 7],
  Primăvara: ["world", 8],
  Vara: ["world", 9],
  Toamna: ["world", 10],
  Iarna: ["world", 11],
  Însorit: ["weather", 0],
  "Parțial noros": ["weather", 1],
  Înnorat: ["weather", 2],
  Ploaie: ["weather", 3],
  Ninsoare: ["weather", 4],
  Vânt: ["weather", 5],
  Ceață: ["weather", 6],
  Cald: ["weather", 0],
  Răcoare: ["weather", 5],
  Frig: ["weather", 4],
  Vesel: ["premium", 0],
  Trist: ["premium", 1],
  Supărat: ["premium", 2],
  Speriat: ["premium", 3],
  Obosit: ["premium", 4],
  Liniștit: ["premium", 5],
  Tricou: ["clothes", 0],
  Bluză: ["clothes", 1],
  Pantaloni: ["clothes", 2],
  Rochiță: ["clothes", 3],
  Geacă: ["clothes", 4],
  "Haină groasă": ["clothes", 5],
  Căciulă: ["clothes", 6],
  Șapcă: ["clothes", 7],
  Pantofi: ["clothes", 8],
  Cizme: ["clothes", 9],
  Umbrelă: ["clothes", 10],
  Fular: ["clothes", 11],
  Mănuși: ["clothes", 12],
  "Bună dimineața": ["premium", 6],
  Activitate: ["world", 7],
  Gustare: ["clothes", 13],
  Joacă: ["premium", 8],
  Masa: ["clothes", 13],
  Odihnă: ["premium", 11],
};
export function hasIllustration(name: string) {
  return name in illustrations;
}
export function StoryArt({
  name,
  size = 100,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const weekdayIndex = ["Luni", "Marți", "Miercuri", "Joi", "Vineri"].indexOf(
    name,
  );
  if (["season", "Primăvara", "Vara", "Toamna", "Iarna"].includes(name))
    return <SeasonArt name={name} size={size} />;
  if (weekdayIndex >= 0)
    return <WeekdayArt count={weekdayIndex + 1} size={size} name={name} />;
  const entry = illustrations[name];
  if (!entry) return null;
  const [sheet, index] = entry;
  const { file, columns, rows } = sheets[sheet];
  const style: CSSProperties = {
    width: size,
    height: size,
    backgroundImage: `url(${import.meta.env.BASE_URL}illustrations/${file})`,
    backgroundSize: `${columns * 100}% ${rows * 100}%`,
    backgroundPosition: `${((index % columns) * 100) / (columns - 1)}% ${(Math.floor(index / columns) * 100) / (rows - 1)}%`,
  };
  return (
    <span
      aria-hidden="true"
      data-illustration={name}
      className={`storybook-art storybook-${sheet} ${className}`}
      style={style}
    />
  );
}
