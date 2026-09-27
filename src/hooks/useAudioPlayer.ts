import { useEffect, useRef } from "react";

export function useAudioPlayer() {
  const currentRef = useRef<HTMLAudioElement | null>(null);

  const stop = () => {
    if (!currentRef.current) return;
    currentRef.current.pause();
    currentRef.current.currentTime = 0;
    currentRef.current = null;
  };

  const play = (src?: string) => {
    if (!src) return;
    stop();
    const audio = new Audio(src);
    audio.preload = "auto";
    currentRef.current = audio;
    void audio.play().catch(() => {
      // Browsers may block autoplay outside a direct gesture.
    });
    audio.onended = () => {
      if (currentRef.current === audio) currentRef.current = null;
    };
  };

  useEffect(() => stop, []);

  return { play, stop };
}
