import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AudioContext } from "../hooks/useAudioPlayer";
import { AudioManager } from "../utils/AudioManager";

/** Mounted once above App; changing pages never disposes the audio session. */
export function AudioProvider({ children }: { children: ReactNode }) {
  const manager = useRef<AudioManager | null>(null);
  const [snapshot, setSnapshot] = useState({ musicOn: true, error: "" });
  useEffect(() => {
    const session = new AudioManager();
    manager.current = session;
    const unsubscribe = session.subscribe(setSnapshot);
    session.mount();
    return () => {
      unsubscribe();
      session.dispose();
      manager.current = null;
    };
  }, []);
  const play = useCallback((src?: string) => manager.current?.play(src), []);
  const stop = useCallback(() => manager.current?.stop(), []);
  const toggleMusic = useCallback(() => manager.current?.toggleMusic(), []);
  return (
    <AudioContext.Provider
      value={{ play, stop, musicOn: snapshot.musicOn, toggleMusic }}
    >
      {children}
      {snapshot.error && (
        <p className="audio-notice" role="status">
          {snapshot.error}
        </p>
      )}
    </AudioContext.Provider>
  );
}
