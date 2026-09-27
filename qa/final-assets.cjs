const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const crypto = require("node:crypto");
const hash = (p) =>
  crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
(async () => {
  const b = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
    headless: true,
  });
  try {
    for (const gender of ["fata", "baiat"])
      assert.equal(
        hash(`public/assets/haine/manechin_${gender}.png`),
        JSON.parse(fs.readFileSync("public/assets/haine/sources.json", "utf8"))[`manechin_${gender}.png`],
      );
    const manifest = JSON.parse(
      fs.readFileSync("public/assets/haine/extracted/manifest.json", "utf8"),
    );
    assert.equal(manifest.length, 52);
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.addInitScript(() => {
      window.__audios = [];
      window.__rejectPlay = false;
      const Original = window.Audio;
      window.Audio = function (src) {
        const a = new Original(src);
        window.__audios.push(a);
        a.play = () =>
          window.__rejectPlay
            ? Promise.reject(new Error("blocked"))
            : Promise.resolve();
        return a;
      };
    });
    await p.goto("http://127.0.0.1:5173");
    assert.equal(
      await p.evaluate(() => window.__audios.length),
      0,
      "no audio objects or autoplay before interaction",
    );
    assert.equal(await p.locator(".board-day-grid button").count(), 5);
    await p
      .getByRole("button", { name: "Pornește muzica", exact: true })
      .click();
    assert.equal(await p.evaluate(() => window.__audios[0].volume), 0.18);
    assert.equal(await p.evaluate(() => window.__audios[0].loop), true);
    for (const day of ["Luni", "Marți", "Miercuri", "Joi", "Vineri"])
      await p.getByRole("button", { name: day, exact: true }).click();
    assert.equal(await p.evaluate(() => window.__audios[0].volume), 0.08);
    assert.equal(await p.evaluate(() => window.__audios.at(-2).currentTime), 0);
    await p.evaluate(() =>
      window.__audios.at(-2).dispatchEvent(new Event("ended")),
    );
    assert.equal(
      await p.evaluate(() => window.__audios[0].volume),
      0.08,
      "stale ended event must not unduck new voice",
    );
    await p.evaluate(() =>
      window.__audios.at(-1).dispatchEvent(new Event("ended")),
    );
    assert.equal(await p.evaluate(() => window.__audios[0].volume), 0.18);
    for (const emotion of [
      "Vesel",
      "Trist",
      "Supărat",
      "Speriat",
      "Obosit",
      "Liniștit",
    ])
      await p.getByRole("button", { name: emotion, exact: true }).click();
    await p.getByRole("button", { name: /Anotimpul/ }).click();
    for (const season of ["Primăvara", "Vara", "Toamna", "Iarna"])
      await p.getByRole("button", { name: season, exact: true }).click();
    const files = await p.evaluate(() =>
      window.__audios.map((a) => new URL(a.src).pathname),
    );
    assert.equal(
      new Set(files).size,
      16,
      "all real voice files plus background used",
    );
    await p.evaluate(() => {
      window.__rejectPlay = true;
    });
    await p.getByRole("button", { name: "Iarna", exact: true }).click();
    await p
      .getByRole("status")
      .filter({ hasText: "Sunetul nu a pornit" })
      .waitFor();
    assert.equal(
      await p.evaluate(() => window.__audios[0].volume),
      0.18,
      "restore music after rejected voice",
    );
    await p
      .getByRole("button", { name: "Oprește muzica", exact: true })
      .click();
    assert.equal(
      await p
        .getByRole("button", { name: "Pornește muzica", exact: true })
        .getAttribute("aria-pressed"),
      "false",
    );
    await p.getByRole("button", { name: "Acasă", exact: true }).click();
    await p.getByRole("button", { name: /Cum ne îmbrăcăm/ }).click();
    await p
      .getByRole("button", { name: "Exterior / Accesorii", exact: true })
      .click();
    for (const suffix of ["01", "04", "05", "06", "07"])
      await p.locator(`[data-garment="fata_outer_${suffix}"]`).click();
    assert.equal(await p.locator(".fitted-layer").count(), 5);
    for (const suffix of ["02", "08", "09"])
      await p.locator(`[data-garment="fata_outer_${suffix}"]`).click();
    assert.equal(
      await p.locator(".fitted-layer").count(),
      5,
      "same accessory slot replaces its predecessor",
    );
    assert.equal(await p.locator('[data-item="fata_outer_04"]').count(), 0);
    await p.getByRole("button", { name: "Încep din nou", exact: true }).click();
    await p.getByRole("button", { name: "Partea de sus", exact: true }).click();
    await p.locator('[data-garment="fata_top_01"]').click();
    await p.getByRole("button", { name: "Partea de jos", exact: true }).click();
    await p.locator('[data-garment="fata_bottom_04"]').click();
    assert.equal(
      await p.locator('[data-item="fata_top_01"]').count(),
      0,
      "pinafore must not be covered by a top",
    );
    await p.reload();
    assert.equal(
      await p.locator('[data-item="fata_bottom_04"]').count(),
      1,
      "current outfit survives reload",
    );
    assert.deepEqual(errors, []);
    // Decode every supplied MP3 using the actual browser media engine.
    const real = await b.newPage();
    await real.goto("http://127.0.0.1:5173");
    const decoded = await real.evaluate(
      async (files) =>
        Promise.all(
          files.map(
            (src) =>
              new Promise((resolve, reject) => {
                const audio = new Audio(src);
                audio.preload = "metadata";
                const timer = setTimeout(
                  () => reject(new Error(src + " timed out")),
                  10000,
                );
                audio.onloadedmetadata = () => {
                  clearTimeout(timer);
                  resolve({ src, duration: audio.duration });
                };
                audio.onerror = () => {
                  clearTimeout(timer);
                  reject(new Error(src + " failed decoding"));
                };
              }),
          ),
        ),
      [...new Set(files)],
    );
    assert(
      decoded.every(
        (item) => Number.isFinite(item.duration) && item.duration > 0,
      ),
    );
    fs.writeFileSync("qa/audio-report.json", JSON.stringify(decoded, null, 2));
    console.log(
      "PASS 52 assets, unchanged mannequins, 16 decoded MP3 files, no autoplay, voice replacement, ducking, stale events, play rejection, reset, layering, persistence",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
