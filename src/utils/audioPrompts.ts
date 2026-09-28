import type { Language } from "../i18n/translations";
const audioUrl = (file: string) => `${import.meta.env.BASE_URL}audio/${file}`;

export const monthAudio: Record<string, string> = {
  Ianuarie: audioUrl("ianuarie.mp3"),
  Februarie: audioUrl("februarie.mp3"),
  Martie: audioUrl("martie.mp3"),
  Aprilie: audioUrl("aprilie.mp3"),
  Mai: audioUrl("mai.mp3"),
  Iunie: audioUrl("iunie.mp3"),
  Iulie: audioUrl("iulie.mp3"),
  August: audioUrl("august.mp3"),
  Septembrie: audioUrl("septembrie.mp3"),
  Octombrie: audioUrl("octombrie.mp3"),
  Noiembrie: audioUrl("noiembrie.mp3"),
  Decembrie: audioUrl("decembrie.mp3"),
};

export const weatherAudio: Record<string, string> = {
  "Însorit": audioUrl("insorit.mp3"),
  "Parțial noros": audioUrl("partial_noros.mp3"),
  "Înnorat": audioUrl("innorat.mp3"),
  Ploaie: audioUrl("ploaie.mp3"),
  Ninsoare: audioUrl("ninsoare.mp3"),
  "Vânt": audioUrl("vant.mp3"),
  "Ceață": audioUrl("ceata.mp3"),
};

export const temperatureAudio: Record<string, string> = {
  Cald: audioUrl("cald.mp3"),
  "Răcoare": audioUrl("racoare.mp3"),
  Frig: audioUrl("frig.mp3"),
};

export const promptAudio = {
  welcome: audioUrl("buna_dimineata_ne_intalnim.mp3"),
  weatherQuestion: audioUrl("cum_e_afara.mp3"),
  finalMessage: audioUrl("impreuna_ziua_e_mai.mp3"),
};

export const weekdayAudio: Record<string, string> = {
  Luni: audioUrl("zile/zi_luni.mp3"),
  Marți: audioUrl("zile/zi_marti.mp3"),
  Miercuri: audioUrl("zile/zi_miercuri.mp3"),
  Joi: audioUrl("zile/zi_joi.mp3"),
  Vineri: audioUrl("zile/zi_vineri.mp3"),
};
export const seasonAudio: Record<string, string> = {
  Primăvara: audioUrl("anotimpuri/anotimp_primavara.mp3"),
  Vara: audioUrl("anotimpuri/anotimp_vara.mp3"),
  Toamna: audioUrl("anotimpuri/anotimp_toamna.mp3"),
  Iarna: audioUrl("anotimpuri/anotimp_iarna.mp3"),
};
export const emotionAudio: Record<string, string> = {
  Vesel: audioUrl("emotii/emotie_vesel.mp3"),
  Trist: audioUrl("emotii/emotie_trist.mp3"),
  Supărat: audioUrl("emotii/emotie_suparat.mp3"),
  Speriat: audioUrl("emotii/emotie_speriat.mp3"),
  Obosit: audioUrl("emotii/emotie_obosit.mp3"),
  Liniștit: audioUrl("emotii/emotie_linistit.mp3"),
};
export const backgroundAudio = audioUrl("fundal/fundal_calendar.mp3");

const germanWords: Record<string, string> = {
  "Luni": "de/zile/montag.mp3",
  "Marți": "de/zile/dienstag.mp3",
  "Miercuri": "de/zile/mittwoch.mp3",
  "Joi": "de/zile/donnerstag.mp3",
  "Vineri": "de/zile/freitag.mp3",
  "Ianuarie": "de/luni/januar.mp3",
  "Februarie": "de/luni/februar.mp3",
  "Martie": "de/luni/maerz.mp3",
  "Aprilie": "de/luni/april.mp3",
  "Mai": "de/luni/mai.mp3",
  "Iunie": "de/luni/juni.mp3",
  "Iulie": "de/luni/juli.mp3",
  "August": "de/luni/august.mp3",
  "Septembrie": "de/luni/september.mp3",
  "Octombrie": "de/luni/oktober.mp3",
  "Noiembrie": "de/luni/november.mp3",
  "Decembrie": "de/luni/dezember.mp3",
  "Primăvara": "de/anotimpuri/fruehling.mp3",
  "Vara": "de/anotimpuri/sommer.mp3",
  "Toamna": "de/anotimpuri/herbst.mp3",
  "Iarna": "de/anotimpuri/winter.mp3",
  "Însorit": "de/vreme/sonnig.mp3",
  "Parțial noros": "de/vreme/teilweise_bewoelkt.mp3",
  "Înnorat": "de/vreme/bewoelkt.mp3",
  "Ploaie": "de/vreme/regen.mp3",
  "Ninsoare": "de/vreme/schnee.mp3",
  "Vânt": "de/vreme/wind.mp3",
  "Ceață": "de/vreme/nebel.mp3",
  "Cald": "de/vreme/warm.mp3",
  "Răcoare": "de/vreme/kuehl.mp3",
  "Frig": "de/vreme/kalt.mp3",
  "Vesel": "de/emotii/froehlich.mp3",
  "Trist": "de/emotii/traurig.mp3",
  "Supărat": "de/emotii/wuetend.mp3",
  "Speriat": "de/emotii/aengstlich.mp3",
  "Obosit": "de/emotii/muede.mp3",
  "Liniștit": "de/emotii/ruhig.mp3",
  "Fetiță": "de/personaje/maedchen.mp3",
  "Băiat": "de/personaje/junge.mp3",
  "Bună dimineața": "de/rutina/guten_morgen.mp3",
  "Mic dejun": "de/rutina/fruehstueck.mp3",
  "Joacă": "de/rutina/spielzeit.mp3",
  "Activități": "de/rutina/aktivitaeten.mp3",
  "Masa de prânz": "de/rutina/mittagessen.mp3",
  "Odihnă": "de/rutina/ruhezeit.mp3"
};
const romanianWords: Record<string, string> = { ...weekdayAudio, ...monthAudio, ...seasonAudio, ...weatherAudio, ...temperatureAudio, ...emotionAudio };
export type PromptKey = keyof typeof promptAudio;
const germanPrompts: Partial<Record<PromptKey, string>> = { welcome: "de/mesaje/start.mp3", finalMessage: "de/mesaje/ende.mp3" };
export function wordAudio(label: string, language: Language): string | undefined {
  return language === "ro" ? romanianWords[label] : germanWords[label] ? audioUrl(germanWords[label]) : undefined;
}
export function promptFor(key: PromptKey, language: Language): string | undefined {
  return language === "ro" ? promptAudio[key] : germanPrompts[key] ? audioUrl(germanPrompts[key]!) : undefined;
}
export const hasAudio = (label: string, language: Language) => !!wordAudio(label, language);
