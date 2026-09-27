import { useCallback, useEffect, useRef, useState } from "react";

export function useAudioPlayer() {
  const currentRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState("");

  const stop = useCallback(() => {
    const audio = currentRef.current;
    currentRef.current = null;
    if (!audio) return;
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  const play = useCallback((src?: string) => {
    if (!src) return;
    stop();
    setError("");
    const audio = new Audio(src);
    currentRef.current = audio;
    const failed = () => {
      // A replaced clip can reject after the next tap; ignore that stale result.
      if (currentRef.current !== audio) return;
      stop();
      setError("Sunetul nu a pornit. Atinge din nou pentru a reîncerca.");
    };
    audio.onerror = failed;
    audio.onended = () => {
      if (currentRef.current === audio) currentRef.current = null;
    };
    // Keep play() synchronous with the click/tap for browsers requiring activation.
    void audio.play().catch(failed);
  }, [stop]);

  useEffect(() => stop, [stop]);
  return { play, stop, error };
}
