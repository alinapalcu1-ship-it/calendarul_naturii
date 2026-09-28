import { backgroundAudio } from "./audioPrompts";

type Snapshot = { musicOn: boolean; error: string };
type LegacyWindow = Window & { webkitAudioContext?: typeof AudioContext };
const NORMAL = 0.15;
const DUCKED = 0.03;

/** Session owner. React pages only issue commands; they never own players. */
export class AudioManager {
  private music: HTMLAudioElement | null = null;
  private voice: HTMLAudioElement | null = null;
  private context: AudioContext | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private gain: GainNode | null = null;
  private graphAttempted = false;
  private fallback = false;
  private unlocked = false;
  private disposed = false;
  private voiceToken = 0;
  private musicRequest = 0;
  private musicPending = false;
  private needsAudioUnlock = true;
  private needsContextResume = true;
  // iOS can leave a routed media element silent after interruption. Keep its
  // native output from the outset: Web Audio routing cannot be undone on the
  // same element. Include iPads that advertise a desktop Mac user agent.
  private readonly nativeIOS = typeof navigator !== "undefined" &&
    (/iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1));
  private resuming = false;
  private intentionalPauses = new WeakSet<HTMLAudioElement>();
  private musicStallTimer: ReturnType<typeof setTimeout> | undefined;
  private stallTimer: ReturnType<typeof setTimeout> | undefined;
  private snapshot: Snapshot = { musicOn: true, error: "" };
  private listeners = new Set<(value: Snapshot) => void>();
  private mounted = false;

  subscribe(listener: (value: Snapshot) => void) {
    this.listeners.add(listener);
    listener(this.snapshot);
    return () => {
      this.listeners.delete(listener);
    };
  }
  private publish(patch: Partial<Snapshot>) {
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach((listener) => listener(this.snapshot));
  }
  mount() {
    if (this.mounted || this.disposed) return;
    this.mounted = true;
    for (const name of ["pointerdown", "touchstart", "click", "keydown"]) {
      document.addEventListener(name, this.interaction, {
        capture: true,
        passive: true,
      });
    }
    document.addEventListener("visibilitychange", this.visibility);
    window.addEventListener("pageshow", this.returned);
    window.addEventListener("focus", this.returned);
    window.addEventListener("pagehide", this.hidden);
  }
  private interaction = (event: Event) => {
    if (!event.isTrusted || (event instanceof KeyboardEvent && event.repeat))
      return;
    this.unlock();
  };
  private createMusic(position = 0) {
    const audio = new Audio(backgroundAudio);
    audio.loop = true;
    audio.preload = "auto";
    audio.setAttribute("playsinline", "");
    audio.volume = NORMAL;
    const seek = () => {
      if (position > 0) {
        try {
          audio.currentTime = position;
        } catch {
          /* Metadata may still be unavailable. */
        }
      }
    };
    audio.onloadedmetadata = seek;
    if (position > 0) seek();
    audio.onerror = () => {
      if (audio !== this.music) return;
      this.needsAudioUnlock = true;
      this.pauseMusic();
      this.publish({
        error: "Muzica nu a pornit. Atinge din nou butonul Muzică.",
      });
    };
    audio.onstalled = () => {
      if (audio !== this.music) return;
      clearTimeout(this.musicStallTimer);
      const position = audio.currentTime;
      // Buffered audio may still be playing during a network stall. Only stop
      // after a bounded grace period with no playback progress.
      this.musicStallTimer = setTimeout(() => {
        if (audio !== this.music || this.disposed || audio.currentTime > position) return;
        this.needsAudioUnlock = true;
        this.pauseMusic();
      }, 8000);
    };
    audio.onpause = () => {
      if (this.intentionalPauses.delete(audio)) return;
      if (
        audio !== this.music ||
        !audio.paused ||
        !this.snapshot.musicOn ||
        document.hidden
      )
        return;
      if (this.voice && this.gain && this.context?.state === "running") {
        // Some signage engines cannot mix two HTML media streams reliably.
        this.useFallback();
      } else if (!this.voice) this.needsAudioUnlock = true;
    };
    audio.onended = () => {
      if (audio === this.music) this.needsAudioUnlock = true;
    };
    audio.oncanplay = () => {
      clearTimeout(this.musicStallTimer);
      if (audio === this.music && !this.needsAudioUnlock) this.startMusic();
    };
    this.music = audio;
  }
  private prepare() {
    if (!this.music) this.createMusic();
    if (this.graphAttempted) return;
    this.graphAttempted = true;
    const Constructor =
      window.AudioContext || (window as LegacyWindow).webkitAudioContext;
    if (!Constructor) {
      this.fallback = true;
      return;
    }
    try {
      this.context = new Constructor();
      this.context.onstatechange = () => {
        if (this.disposed) return;
        this.needsContextResume = this.context?.state !== "running";
        if (this.fallback) return;
        if (this.needsContextResume) {
          this.needsAudioUnlock = true;
          this.pauseMusic();
        } else this.setLevel(!!this.voice);
      };
      if (this.nativeIOS) {
        this.fallback = true;
        return;
      }
      this.gain = this.context.createGain();
      this.gain.gain.value = this.voice ? DUCKED : NORMAL;
      this.source = this.context.createMediaElementSource(this.music!);
      this.source.connect(this.gain);
      this.gain.connect(this.context.destination);
      this.music!.volume = 1;

    } catch {
      this.useFallback();
    }
  }
  private unlock() {
    if (this.disposed || document.hidden) return;
    this.unlocked = true;
    this.prepare();
    this.needsAudioUnlock = false;
    if (this.music?.error) {
      const audio = this.music;
      const position = audio.currentTime;
      audio.onloadedmetadata = () => {
        try {
          audio.currentTime = position;
        } catch {
          /* Invalid seek ranges can require a fresh start. */
        }
      };
      audio.load(); // Recover a failed resource only on a gesture.
    }
    if (this.context?.state === "closed" && !this.fallback) this.useFallback();
    if (
      this.context &&
      (!this.fallback || this.nativeIOS) &&
      (this.needsContextResume || this.context.state !== "running") &&
      !this.resuming
    ) {
      this.resuming = true;
      try {
        Promise.resolve(this.context.resume()).then(
          () => {
            this.resuming = false;
            this.needsContextResume = this.context?.state !== "running";
          },
          () => {
            this.resuming = false;
            this.needsContextResume = true;
            if (!this.fallback) { this.needsAudioUnlock = true; this.pauseMusic(); }
          },
        );
      } catch {
        this.resuming = false;
        this.needsContextResume = true;
        if (!this.fallback) { this.needsAudioUnlock = true; this.pauseMusic(); }
      }
    }
    // Both resume() above and play() below run in the gesture stack. Awaiting
    // resume before invoking play would hand control back to WebKit first.
    this.startMusic(true);
  }
  private pauseMusic() {
    clearTimeout(this.musicStallTimer);
    this.musicRequest++;
    this.musicPending = false;
    if (this.music && !this.music.paused) {
      this.intentionalPauses.add(this.music);
      this.music.pause();
    }
  }
  private startMusic(fromGesture = false) {
    const audio = this.music;
    if (
      this.disposed ||
      !audio ||
      !this.unlocked ||
      !this.snapshot.musicOn ||
      document.hidden ||
      this.needsAudioUnlock ||
      this.musicPending
    )
      return;
    if (this.voice && (this.fallback || (!fromGesture && this.context?.state !== "running")))
      return;
    if (!fromGesture && !this.fallback && this.context?.state !== "running") return;
    if (!audio.paused) return;
    const request = ++this.musicRequest;
    this.musicPending = true;
    const failed = () => {
      if (
        this.disposed ||
        request !== this.musicRequest ||
        audio !== this.music
      )
        return;
      this.musicPending = false;
      this.needsAudioUnlock = true;
      this.publish({
        error: "Muzica nu a pornit. Atinge din nou butonul Muzică.",
      });
    };
    try {
      Promise.resolve(audio.play()).then(() => {
        if (request === this.musicRequest) this.musicPending = false;
      }, failed);
    } catch {
      failed();
    }
  }
  private setLevel(duck: boolean) {
    if (!this.gain || !this.context || this.fallback) {
      if (duck) this.pauseMusic();
      else this.startMusic();
      return;
    }
    try {
      const param = this.gain.gain;
      const now = this.context.currentTime;
      // Hold an in-flight ramp before replacing it (rapid taps never restore).
      if (typeof param.cancelAndHoldAtTime === "function")
        param.cancelAndHoldAtTime(now);
      else {
        const value = param.value;
        param.cancelScheduledValues(now);
        param.setValueAtTime(value, now);
      }
      param.linearRampToValueAtTime(
        duck ? DUCKED : NORMAL,
        now + (duck ? 0.1 : 0.32),
      );
    } catch {
      this.useFallback();
    }
  }
  private release(audio: HTMLAudioElement) {
    audio.onended =
      audio.onerror =
      audio.onpause =
      audio.onstalled =
      audio.oncanplay =
      audio.onloadedmetadata =
      audio.ontimeupdate =
        null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
  }
  private useFallback() {
    if (this.fallback) return;
    this.fallback = true;
    const position = this.music?.currentTime || 0;
    // A MediaElementSource cannot be detached back to native output. Replace
    // only this failed routed element, after stopping it, never on navigation.
    if (this.source && this.music) {
      this.pauseMusic();
      this.release(this.music);
      this.source.disconnect();
      this.gain?.disconnect();
      this.source = null;
      this.gain = null;
      this.createMusic(position);
    } else if (this.music) this.music.volume = NORMAL;
    if (this.voice) this.pauseMusic();
    else this.startMusic();
  }
  play = (src?: string) => {
    if (!src || this.disposed) return;
    // Keep the old voice active while unlocking, so music cannot briefly rise.
    this.unlock();
    const token = ++this.voiceToken;
    this.clearVoice();
    const audio = new Audio(src);
    audio.setAttribute("playsinline", "");
    this.voice = audio;
    this.publish({ error: "" });
    this.setLevel(true);
    const finish = (failed = false) => {
      if (this.disposed || token !== this.voiceToken || this.voice !== audio)
        return;
      this.clearVoice();
      this.setLevel(false);
      if (failed)
        this.publish({
          error: "Sunetul nu a pornit. Atinge din nou pentru a reîncerca.",
        });
    };
    audio.onended = () => finish();
    audio.onerror = () => finish(true);
    audio.onpause = () => {
      if (audio.paused && !audio.ended) finish(true);
    };
    audio.onstalled = () => {
      clearTimeout(this.stallTimer);
      this.stallTimer = setTimeout(() => finish(true), 8000);
    };
    audio.ontimeupdate = () => {
      if (!audio.paused && audio.currentTime > 0) clearTimeout(this.stallTimer);
    };
    audio.oncanplay = () => {
      /* The existing play request handles buffering; never retry here. */
    };
    // Called synchronously in the click/tap handler, even while context resumes.
    try {
      Promise.resolve(audio.play()).catch(() => finish(true));
    } catch {
      finish(true);
    }
  };
  private clearVoice() {
    clearTimeout(this.stallTimer);
    if (this.voice) this.release(this.voice);
    this.voice = null;
  }
  stop = () => {
    ++this.voiceToken;
    this.clearVoice();
    this.setLevel(false);
  };
  toggleMusic = () => {
    if (this.disposed) return;
    this.publish({ musicOn: !this.snapshot.musicOn, error: "" });
    if (!this.snapshot.musicOn) this.pauseMusic();
    else this.unlock();
  };
  private hidden = () => {
    ++this.voiceToken;
    this.clearVoice();
    this.pauseMusic();
  };
  private visibility = () => {
    if (document.hidden) this.hidden();
    else this.returned();
  };
  private returned = () => {
    // Never resume AudioContext here: wait for a trusted gesture if suspended.
    if (document.hidden || !this.unlocked) return;
    if (this.context && this.context.state !== "running") {
      this.needsContextResume = true;
      this.needsAudioUnlock = true;
      return;
    }
    this.setLevel(!!this.voice);
    this.startMusic();
  };
  dispose() {
    this.disposed = true;
    this.mounted = false;
    for (const name of ["pointerdown", "touchstart", "click", "keydown"])
      document.removeEventListener(name, this.interaction, true);
    document.removeEventListener("visibilitychange", this.visibility);
    window.removeEventListener("pageshow", this.returned);
    window.removeEventListener("focus", this.returned);
    window.removeEventListener("pagehide", this.hidden);
    ++this.voiceToken;
    this.clearVoice();
    this.pauseMusic();
    if (this.music) this.release(this.music);
    this.source?.disconnect();
    this.gain?.disconnect();
    if (this.context) {
      this.context.onstatechange = null;
      try {
        void Promise.resolve(this.context.close()).catch(() => {});
      } catch {
        /* Older engines can already be closed. */
      }
    }
    this.listeners.clear();
    this.music = null;
  }
}
