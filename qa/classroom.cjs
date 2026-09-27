const { chromium, devices } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const URL = process.env.TEST_URL || "http://127.0.0.1:5176/calendarul_naturii/";
const KEY = "calendarul-naturii-v1";
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const page = await browser.newPage({
      viewport: { width: 1366, height: 900 },
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    const read = () =>
      page.evaluate((key) => JSON.parse(localStorage.getItem(key)), KEY);
    const saved = async (test) => {
      await page.waitForFunction(
        ({ key, source }) =>
          new Function("s", `return (${source})(s)`)(
            JSON.parse(localStorage.getItem(key)),
          ),
        { key: KEY, source: test.toString() },
      );
    };
    const settings = async () => {
      await page
        .getByRole("button", { name: "Setări educatoare", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Deblochează setările", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Sunt educatoare, continuă" })
        .click();
    };
    await page.goto(URL);
    await saved((s) => s?.children.length === 30);
    assert.equal((await read()).group, "");
    assert((await read()).children.every((c) => c.name === ""));
    await page
      .getByRole("button", { name: "Setări educatoare", exact: true })
      .click();
    assert(
      await page.getByLabel("Numele grupei", { exact: true }).isDisabled(),
    );
    await page.getByRole("button", { name: "Deblochează setările" }).click();
    await page.getByRole("button", { name: "Anulează", exact: true }).click();
    assert(
      await page.getByLabel("Numele grupei", { exact: true }).isDisabled(),
    );
    await settings();
    await page
      .getByLabel("Numele grupei", { exact: true })
      .fill("Grupa Exploratorilor");
    await page.getByLabel("Nume copil 30", { exact: true }).fill("Ana");
    await page
      .getByLabel("Aniversare copil 30", { exact: true })
      .fill("2021-05-12");
    await page
      .getByLabel("Fotografie copil 30", { exact: true })
      .setInputFiles("public/assets/dress-ready/girl/thumbs/girl-top-01.png");
    await saved((s) => s.children[29].photo?.startsWith("idb:"));
    assert(
      !(await page.evaluate((k) => localStorage.getItem(k), KEY)).includes(
        "data:image",
      ),
    );
    const config = await read();
    await page.reload();
    await settings();
    assert.equal(
      await page.getByLabel("Nume copil 30", { exact: true }).inputValue(),
      "Ana",
    );
    assert(
      await page
        .locator(".child-editor")
        .last()
        .locator("img")
        .evaluate((i) => i.complete && i.naturalWidth === 256),
    );
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Exportă configurația" }).click();
    const download = await downloadPromise;
    const backup = await fs.readFile(await download.path(), "utf8");
    const parsed = JSON.parse(backup);
    assert(parsed.children[29].photo.startsWith("data:image/jpeg"));
    assert.equal(parsed.group, config.group);
    assert(!("weather" in parsed));
    await page
      .getByRole("button", { name: "Elimină fotografia", exact: true })
      .click();
    await page.getByRole("button", { name: "Anulează", exact: true }).click();
    assert((await read()).children[29].photo);
    await page.evaluate(
      ({ key, state }) =>
        localStorage.setItem(
          key,
          JSON.stringify({
            ...state,
            present: [30],
            helper: 30,
            weather: ["Ploaie"],
            temperature: "Frig",
            season: "Iarna",
            childEmotions: { 30: "Vesel" },
            emotion: "Vesel",
            date: "2026-01-01",
          }),
        ),
      { key: KEY, state: await read() },
    );
    await page.reload();
    await settings();
    await page
      .getByRole("button", { name: "Începe o zi nouă", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Da, resetează", exact: true })
      .click();
    await saved(
      (s) =>
        s.present.length === 0 &&
        s.weather.length === 0 &&
        s.season === "" &&
        s.temperature === "" &&
        Object.keys(s.childEmotions).length === 0,
    );
    const daily = await read();
    assert.deepEqual(daily.children, config.children);
    assert.equal(daily.group, config.group);
    assert.equal(daily.helper, null);
    await page
      .getByRole("button", { name: "Elimină copilul", exact: true })
      .click();
    await page.getByRole("button", { name: "Da, elimină" }).click();
    await saved((s) => s.children[29].name === "");
    assert.equal((await read()).children.length, 30);
    await page
      .getByLabel("Importă configurația", { exact: true })
      .setInputFiles({
        name: "backup.json",
        mimeType: "application/json",
        buffer: Buffer.from(backup),
      });
    await page.getByRole("button", { name: "Anulează", exact: true }).click();
    assert.equal((await read()).children[29].name, "");
    await page
      .getByLabel("Importă configurația", { exact: true })
      .setInputFiles({
        name: "backup.json",
        mimeType: "application/json",
        buffer: Buffer.from(backup),
      });
    await page
      .getByRole("button", { name: "Da, înlocuiește configurația" })
      .click();
    await saved(
      (s) =>
        s.children[29].name === "Ana" &&
        s.children[29].photo?.startsWith("idb:"),
    );
    await page.reload();
    await settings();
    assert(
      await page
        .locator(".child-editor")
        .last()
        .locator("img")
        .evaluate((i) => i.complete && i.naturalWidth === 256),
    );
    await page
      .getByLabel("Importă configurația", { exact: true })
      .setInputFiles({
        name: "bad.json",
        mimeType: "application/json",
        buffer: Buffer.from('{"bad":true}'),
      });
    await page.getByRole("alert").waitFor();
    assert.equal((await read()).children[29].name, "Ana");
    assert.equal(await page.getByRole("alertdialog").count(), 0);
    await page.screenshot({ path: "qa/classroom-laptop.png" });
    // Legacy inline photos migrate without loss; a new calendar day resets only daily fields.
    const legacy = {
      ...(await read()),
      dayKey: "2020-01-01",
      children: parsed.children.slice(0, 22),
      present: [1],
      weather: ["Ploaie"],
      season: "Vara",
      group: "Grupa Mămăruțelor",
    };
    legacy.children[0] = { ...parsed.children[29], id: 1 };
    await page.evaluate(
      ({ key, state }) => localStorage.setItem(key, JSON.stringify(state)),
      { key: KEY, state: legacy },
    );
    await page.reload();
    await saved(
      (s) =>
        s.children.length === 30 &&
        s.children[0].photo?.startsWith("idb:") &&
        s.dayKey !== "2020-01-01",
    );
    assert.equal((await read()).children[0].name, "Ana");
    assert.equal((await read()).group, "");
    assert.equal((await read()).season, "");
    assert.deepEqual((await read()).present, []);
    await settings();
    await page
      .getByRole("button", { name: "Resetează complet aplicația" })
      .click();
    await page.getByRole("button", { name: "Da, șterge tot" }).click();
    await saved((s) => s.children.every((c) => !c.name && !c.photo));
    await page.waitForFunction(
      () =>
        new Promise((resolve) => {
          const r = indexedDB.open("calendarul-naturii-photos", 1);
          r.onsuccess = () => {
            const db = r.result;
            const count = db
              .transaction("photos")
              .objectStore("photos")
              .count();
            count.onsuccess = () => {
              resolve(count.result === 0);
              db.close();
            };
          };
        }),
    );
    for (const [name, options] of [
      ["iphone", devices["iPhone 13"]],
      ["android", devices["Pixel 7"]],
      ["board", { viewport: { width: 1920, height: 1080 }, hasTouch: true }],
    ]) {
      const context = await browser.newContext(options);
      const p = await context.newPage();
      await p.goto(URL);
      await p
        .getByRole("button", { name: "Setări educatoare", exact: true })
        .click();
      await p.getByRole("button", { name: "Deblochează setările" }).click();
      await p
        .getByRole("button", { name: "Sunt educatoare, continuă" })
        .click();
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${name} settings overflow`,
      );
      await p.screenshot({ path: `qa/classroom-${name}.png` });
      await p.locator(".child-editor").first().scrollIntoViewIfNeeded();
      await p.screenshot({ path: `qa/classroom-${name}-children.png` });
      await p
        .getByRole("button", { name: "Începe o zi nouă", exact: true })
        .click();
      await p.screenshot({ path: `qa/classroom-${name}-dialog.png` });
      await p.getByRole("button", { name: "Anulează", exact: true }).click();
      await p.getByRole("button", { name: "Acasă", exact: true }).click();
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${name} home overflow`,
      );
      await p.screenshot({ path: `qa/classroom-${name}-home.png` });
      await context.close();
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS: 30 blank slots, settings lock, IndexedDB photos, reload, backup with photos, cancelled/confirmed import, invalid import, daily reset and rollover, legacy migration, child removal, full reset/photo cleanup, mobile and board layouts. No JS errors.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
