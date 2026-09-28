const { chromium, devices } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    channel: "msedge",
    headless: true,
    args: ["--autoplay-policy=document-user-activation-required"],
  });
  try {
    for (const [name, options, fallback] of [
      ["desktop", {}, false],
      ["touch", devices["Pixel 7"], false],
      ["fallback", devices["iPhone 13"], true],
    ]) {
      const c = await b.newContext({
        ...options,
        viewport: options.viewport || { width: 1600, height: 1100 },
      });
      const p = await c.newPage();
      const errors = [],
        network = [];
      p.on("pageerror", (e) => errors.push(e.message));
      p.on("response", (r) => {
        if (r.url().includes("/audio/")) network.push(r);
      });
      await p.addInitScript((fallback) => {
        window.audios = [];
        window.contexts = [];
        window.gains = [];
        const Original = window.Audio;
        window.Audio = function (src) {
          const a = new Original(src);
          window.audios.push(a);
          return a;
        };
        const Context = window.AudioContext;
        if (fallback) {
          window.AudioContext = undefined;
          window.webkitAudioContext = undefined;
        } else {
          window.AudioContext = class extends Context {
            constructor() {
              super();
              window.contexts.push(this);
            }
            createGain() {
              const g = super.createGain();
              window.gains.push(g);
              return g;
            }
          };
        }
      }, fallback);
      await p.goto(
        process.env.TEST_URL || "http://127.0.0.1:5176/calendarul_naturii/",
      );
      await p
        .getByRole("button", { name: "Pornește muzica", exact: true })
        .waitFor();
      assert.equal(await p.evaluate(() => audios.length), 0);
      await p
        .getByRole("button", { name: "Pornește muzica", exact: true })
        .click();
      await p.waitForFunction(
        () => audios[0].currentTime > 0.1 && !audios[0].paused,
      );
      assert.equal(
        await p.evaluate(() => audios.filter((a) => a.loop).length),
        1,
      );
      const before = await p.evaluate(() => audios[0].currentTime);
      await p.getByRole("button", { name: /Anotimpul/ }).click();
      assert(await p.evaluate(() => !audios[0].paused));
      await p.getByRole("button", { name: "Primăvara", exact: true }).click();
      await p.waitForFunction(
        () => audios.filter((a) => !a.loop).at(-1)?.currentTime > 0.1,
      );
      if (fallback) assert(await p.evaluate(() => audios[0].paused));
      else
        await p.waitForFunction(
          () => Math.abs(gains[0].gain.value - 0.03) < 0.002,
        );
      await p.getByRole("button", { name: "Vara", exact: true }).click();
      await p.getByRole("button", { name: "Toamna", exact: true }).click();
      await p.getByRole("button", { name: "Iarna", exact: true }).click();
      assert(
        await p.evaluate(() =>
          audios
            .filter((a) => !a.loop)
            .slice(0, -1)
            .every((a) => a.paused),
        ),
      );
      await p.waitForFunction(
        () => audios.filter((a) => !a.loop).at(-1).paused,
      );
      if (fallback) await p.waitForFunction(() => !audios[0].paused);
      else
        await p.waitForFunction(
          () => Math.abs(gains[0].gain.value - 0.15) < 0.002,
        );
      assert(
        await p.evaluate((before) => audios[0].currentTime >= before, before),
      );
      if (!fallback) {
        await p.evaluate(() => contexts[0].suspend());
        assert(await p.evaluate(() => audios[0].paused));
        await p.evaluate(() => {
          window.dispatchEvent(new Event("focus"));
          window.dispatchEvent(new Event("pageshow"));
        });
        assert.equal(await p.evaluate(() => contexts[0].state), "suspended");
        await p.getByRole("button", { name: "Acasă", exact: true }).click();
        await p.waitForFunction(
          () => contexts[0].state === "running" && !audios[0].paused,
        );
        assert.equal(await p.evaluate(() => contexts.length), 1);
      } else
        await p.getByRole("button", { name: "Acasă", exact: true }).click();
      if (name === "desktop") {
        for (const label of [
          "Luni",
          "Marți",
          "Miercuri",
          "Joi",
          "Vineri",
          "Vesel",
          "Trist",
          "Supărat",
          "Speriat",
          "Obosit",
          "Liniștit",
        ]) {
          await p.getByRole("button", { name: label, exact: true }).click();
          await p.waitForFunction(
            () => audios.filter((a) => !a.loop).at(-1).currentTime > 0.1,
          );
          await p.waitForFunction(
            () => Math.abs(gains[0].gain.value - 0.03) < 0.002,
          );
        }
        await p.waitForFunction(
          () => audios.filter((a) => !a.loop).at(-1).paused,
        );
        await p.waitForFunction(
          () => Math.abs(gains[0].gain.value - 0.15) < 0.002,
        );
      }
      await p
        .getByRole("button", { name: "Oprește muzica", exact: true })
        .click();
      const position = await p.evaluate(() => audios[0].currentTime);
      await p
        .getByRole("button", { name: "Pornește muzica", exact: true })
        .click();
      await p.waitForFunction(() => !audios[0].paused);
      assert(
        await p.evaluate(
          (position) => audios[0].currentTime >= position,
          position,
        ),
      );
      assert.equal(
        await p.evaluate(() => audios.filter((a) => a.loop).length),
        1,
      );
      await p
        .getByRole("button", { name: "Oprește muzica", exact: true })
        .click();
      assert(network.every((r) => r.status() === 200 || r.status() === 206));
      assert(
        network.every((r) =>
          new URL(r.url()).pathname.startsWith("/calendarul_naturii/audio/"),
        ),
      );
      assert.deepEqual(errors, []);
      console.log(
        "PASS real MP3 playback, persistent music, rapid voices, duck/restore, suspend/gesture, toggle position, no duplicate background, no 404:",
        name,
      );
      await c.close();
    }
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
