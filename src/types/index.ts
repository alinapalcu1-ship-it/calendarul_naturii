export interface Child {
  id: number;
  name: string;
  photo?: string;
  birthday: string;
}
export interface State {
  version: 1;
  dayKey: string;
  date: string;
  group: string;
  message: string;
  children: Child[];
  present: number[];
  season: string;
  weather: string[];
  temperature: string;
  clothes: string[];
  outfits: { girl: string[]; boy: string[] };
  childEmotions: Record<number, string>;

  mannequin: "girl" | "boy";
  emotion: string;
  helper: number | null;
  activities: string[];
}
export type Page =
  | "home"
  | "calendar"
  | "season"
  | "weather"
  | "clothing"
  | "attendance"
  | "emotions"
  | "helper"
  | "summary"
  | "settings";
export interface PageProps {
  state: State;
  update: (patch: Partial<State>) => void;
}
