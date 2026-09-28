import { useLanguage } from "../i18n/LanguageContext";
import { wordAudio, promptFor, hasAudio, type PromptKey } from "../utils/audioPrompts";
import { createContext, useContext } from "react";

export type AudioControls = {
  play: (src?: string) => void;
  stop: () => void;
  musicOn: boolean;
  toggleMusic: () => void;
};
export const AudioContext = createContext<AudioControls | null>(null);

export function useAudioPlayer() {
  const controls = useContext(AudioContext);
  const { language } = useLanguage();
  if (!controls) throw new Error("useAudioPlayer requires AudioProvider");
  return {
    ...controls,
    playWord: (label: string) => {
      const src = wordAudio(label, language);
      if (src) controls.play(src);
    },
    playPrompt: (key: PromptKey) => {
      const src = promptFor(key, language);
      if (src) controls.play(src);
    },
    hasAudio: (label: string) => hasAudio(label, language),
    hasPrompt: (key: PromptKey) => !!promptFor(key, language),
  };
}
