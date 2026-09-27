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
