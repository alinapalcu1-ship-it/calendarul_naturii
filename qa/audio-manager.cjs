const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const code = ts.transpileModule(
  fs.readFileSync("src/utils/AudioManager.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  },
).outputText;
function fixture(web = true) {
  const audios = [],
    contexts = [],
    timers = new Map();
  let serial = 0;
  class Surface {
    listeners = new Map();
    hidden = false;
    addEventListener(n, f) {
      if (!this.listeners.has(n)) this.listeners.set(n, new Set());
      this.listeners.get(n).add(f);
    }
    removeEventListener(n, f) {
      this.listeners.get(n)?.delete(f);
    }
    emit(n, extra = {}) {
      for (const f of this.listeners.get(n) || [])
        f({ isTrusted: true, ...extra });
    }
  }
  class Audio {
    constructor(src) {
      this.src = src;
      this.paused = true;
      this.currentTime = 0;
      this.volume = 1;
      this.playCalls = 0;
      audios.push(this);
    }
    setAttribute() {}
    removeAttribute() {
      this.src = "";
    }
    load() {}
    play() {
      this.playCalls++;
      if (this.reject) return Promise.reject(Error("blocked"));
      this.paused = false;
      return Promise.resolve();
    }
    pause() {
      if (!this.paused) {
        this.paused = true;
        this.onpause?.();
      }
    }
  }
  class Context {
    constructor() {
      this.state = "suspended";
      this.currentTime = 1;
      this.resumeCalls = 0;
      this.ramps = [];
      contexts.push(this);
    }
    createGain() {
      const ctx = this;
      return {
        connect() {},
        disconnect() {},
        gain: {
          value: 0.15,
          cancelAndHoldAtTime() {},
          linearRampToValueAtTime(value, time) {
            if (ctx.breakGain) throw Error("broken gain");
            this.value = value;
            ctx.ramps.push([value, time]);
          },
        },
      };
    }
    createMediaElementSource() {
      return { connect() {}, disconnect() {} };
    }
    resume() {
      this.resumeCalls++;
      if (this.reject) return Promise.reject(Error("blocked context"));
      this.state = "running";
      this.onstatechange?.();
      return Promise.resolve();
    }
    close() {
      this.state = "closed";
      return Promise.resolve();
    }
  }
  const document = new Surface(),
    window = new Surface();
  window.AudioContext = web ? Context : undefined;
  const exports = {};
  vm.runInNewContext(code, {
    exports,
    require: () => ({
      backgroundAudio: "/calendarul_naturii/audio/fundal/fundal_calendar.mp3",
    }),
    window,
    document,
    Audio,
    KeyboardEvent: class {},
    setTimeout: (f) => {
      timers.set(++serial, f);
      return serial;
    },
    clearTimeout: (id) => timers.delete(id),
    console,
  });
  const m = new exports.AudioManager();
  let snapshot;
  m.subscribe((v) => (snapshot = v));
  m.mount();
  return {
    m,
    document,
    window,
    audios,
    contexts,
    timers,
    get snapshot() {
      return snapshot;
    },
  };
}
const flush = () => new Promise((r) => setImmediate(r));
(async () => {
  const f = fixture();
  assert.equal(f.audios.length, 0);
  assert.equal(f.contexts.length, 0);
  f.m.mount();
  assert.equal(f.document.listeners.get("click").size, 1);
  f.document.emit("pointerdown");
  await flush();
  assert.equal(f.audios.length, 1);
  assert.equal(f.contexts.length, 1);
  assert(f.audios[0].paused);
  f.m.toggleMusic();
  await flush();
  const bg = f.audios[0],
    ctx = f.contexts[0];
  assert(bg.loop && !bg.paused);
  bg.currentTime = 42;
  const ramps = ctx.ramps.length;
  f.m.play("luni");
  const old = f.audios.at(-1),
    stale = old.onended;
  assert.equal(ctx.ramps.at(-1)[0], 0.03);
  f.m.play("marti");
  f.m.play("miercuri");
  f.m.play("joi");
  stale();
  await flush();
  assert(ctx.ramps.slice(ramps).every((r) => r[0] === 0.03));
  assert.equal(f.audios.filter((a) => !a.paused).length, 2);
  f.audios.at(-1).onended();
  await flush();
  assert.equal(ctx.ramps.at(-1)[0], 0.15);
  assert.equal(bg.currentTime, 42);
  f.m.toggleMusic();
  f.m.toggleMusic();
  await flush();
  assert.equal(f.audios.filter((a) => a.loop).length, 1);
  assert.equal(bg.currentTime, 42);
  f.document.hidden = true;
  f.document.emit("visibilitychange");
  assert(bg.paused);
  f.document.hidden = false;
  f.document.emit("visibilitychange");
  await flush();
  assert(!bg.paused);
  assert.equal(bg.currentTime, 42);
  ctx.state = "suspended";
  ctx.onstatechange();
  assert(bg.paused);
  const resumes = ctx.resumeCalls;
  f.window.emit("focus");
  f.window.emit("pageshow");
  assert.equal(ctx.resumeCalls, resumes);
  f.document.emit("touchstart");
  await flush();
  assert.equal(ctx.resumeCalls, resumes + 1);
  assert(!bg.paused);
  assert.equal(f.contexts.length, 1);
  f.m.toggleMusic();
  bg.reject = true;
  f.m.toggleMusic();
  await flush();
  const plays = bg.playCalls;
  bg.oncanplay();
  f.window.emit("focus");
  f.window.emit("pageshow");
  await flush();
  assert.equal(bg.playCalls, plays);
  bg.reject = false;
  f.document.emit("click");
  await flush();
  assert(!bg.paused);
  bg.onstalled();
  assert(!bg.paused, "network stalls must not interrupt buffered audio");
  [...f.timers.values()][0]();
  const stalledCalls = bg.playCalls;
  bg.oncanplay();
  assert.equal(bg.playCalls, stalledCalls);
  f.document.emit("keydown");
  await flush();
  assert(!bg.paused);
  f.m.play("voice-error");
  f.audios.at(-1).onerror();
  assert.equal(ctx.ramps.at(-1)[0], 0.15);
  f.m.play("voice-stalled");
  f.audios.at(-1).onstalled();
  assert.equal(f.timers.size, 1);
  [...f.timers.values()][0]();
  assert.equal(ctx.ramps.at(-1)[0], 0.15);
  assert.equal(f.timers.size, 0);
  f.m.play("voice-pause");
  f.audios.at(-1).pause();
  assert.equal(ctx.ramps.at(-1)[0], 0.15);
  ctx.breakGain = true;
  f.m.play("gain-failure");
  const native = f.audios.find((a) => a.loop && a !== bg);
  assert(native && native.paused && bg.paused);
  assert.equal(native.currentTime, 42);
  f.audios
    .filter((a) => !a.loop)
    .at(-1)
    .onended();
  await flush();
  assert(!native.paused);
  assert.equal(f.audios.filter((a) => !a.paused && a.loop).length, 1);
  f.m.dispose();
  assert(f.audios.every((a) => a.paused));
  assert.equal(f.timers.size, 0);
  for (const listeners of [
    ...f.document.listeners.values(),
    ...f.window.listeners.values(),
  ])
    assert.equal(listeners.size, 0);
  assert.equal(ctx.state, "closed");
  const n = fixture(false);
  n.m.toggleMusic();
  await flush();
  const nb = n.audios[0];
  nb.currentTime = 71;
  n.m.play("a");
  const staleFallback = n.audios.at(-1).onended;
  n.m.play("b");
  staleFallback();
  assert(nb.paused);
  n.audios.at(-1).onended();
  await flush();
  assert(!nb.paused);
  assert.equal(nb.currentTime, 71);
  n.m.play("c");
  n.m.toggleMusic();
  n.audios.at(-1).onended();
  await flush();
  assert(nb.paused);
  n.m.dispose();
  console.log(
    "PASS manager: lazy unlock, one music/context, ramps and voice tokens, toggles preserve position, hidden/visible, suspended resume only on gesture, rejected play no retry loop, stalled/canplay, voice error/pause/stall, broken GainNode native fallback, no WebAudio fallback, listener and timer cleanup.",
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
