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
  if (!controls) throw new Error("useAudioPlayer requires AudioProvider");
  return controls;
}
