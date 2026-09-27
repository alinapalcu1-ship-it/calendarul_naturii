import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AudioContext } from "../hooks/useAudioPlayer";
import { backgroundAudio } from "../utils/audioPrompts";

const MUSIC_VOLUME = 0.15;
const VOICE_MUSIC_VOLUME = 0.025;

/** One voice channel across pages and dialogs; music starts only from its button. */
export function AudioProvider({ children }: { children: ReactNode }) {
  const voice = useRef<HTMLAudioElement | null>(null);
  const music = useRef<HTMLAudioElement | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [error, setError] = useState("");

  const stop = useCallback(() => {
    const current = voice.current;
    voice.current = null;
    if (current) {
      current.onended = null;
      current.onerror = null;
      current.pause();
      current.currentTime = 0;
    }
    if (music.current) music.current.volume = MUSIC_VOLUME;
  }, []);

  const play = useCallback((src?: string) => {
    if (!src) return;
    stop();
    setError("");
    const audio = new Audio(src);
    voice.current = audio;
    if (music.current) music.current.volume = VOICE_MUSIC_VOLUME;
    const failed = () => {
      if (voice.current !== audio) return;
      stop();
      setError("Sunetul nu a pornit. Atinge din nou pentru a reîncerca.");
    };
    audio.onerror = failed;
    audio.onended = () => {
      if (voice.current !== audio) return;
      voice.current = null;
      audio.onerror = null;
      audio.onended = null;
      if (music.current) music.current.volume = MUSIC_VOLUME;
    };
    // No await before play(): preserve the browser's click/tap activation.
    void audio.play().catch(failed);
  }, [stop]);

  const toggleMusic = useCallback(() => {
    setError("");
    if (music.current) {
      const current = music.current;
      music.current = null;
      current.onerror = null;
      current.pause();
      setMusicOn(false);
      return;
    }
    const audio = new Audio(backgroundAudio);
    music.current = audio;
    audio.loop = true;
    audio.volume = voice.current ? VOICE_MUSIC_VOLUME : MUSIC_VOLUME;
    setMusicOn(true);
    const failed = () => {
      if (music.current !== audio) return;
      music.current = null;
      audio.onerror = null;
      audio.pause();
      setMusicOn(false);
      setError("Muzica nu a pornit. Atinge din nou butonul Muzică.");
    };
    audio.onerror = failed;
    void audio.play().catch(failed);
  }, []);

  useEffect(() => () => {
    stop();
    if (music.current) {
      music.current.onerror = null;
      music.current.pause();
      music.current = null;
    }
  }, [stop]);

  return (
    <AudioContext.Provider value={{ play, stop, musicOn, toggleMusic }}>
      {children}
      {error && <p className="audio-notice" role="status">{error}</p>}
    </AudioContext.Provider>
  );
}
