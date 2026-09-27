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
