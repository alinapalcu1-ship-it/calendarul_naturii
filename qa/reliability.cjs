const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const URL = process.env.TEST_URL || "http://127.0.0.1:5176/calendarul_naturii/";
const KEY = "calendarul-naturii-v1";
(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const p = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    const read = () =>
      p.evaluate((k) => JSON.parse(localStorage.getItem(k)), KEY);
    const saved = () =>
      p
        .getByRole("status")
        .filter({ hasText: "Salvat pe acest dispozitiv" })
        .waitFor();
    const settings = async () => {
      await p
        .getByRole("button", { name: "Setări educatoare", exact: true })
        .click();
      await p.getByRole("button", { name: "Deblochează setările" }).click();
      await p
        .getByRole("button", { name: "Sunt educatoare, continuă" })
        .click();
    };
    await p.goto(URL);
    await saved();
    await p.getByRole("button", { name: /Cine este la grădiniță/ }).click();
    assert.equal(await p.locator(".child-card:disabled").count(), 30);
    assert.match(await p.locator(".counts").innerText(), /Absenți:\s*0/);
    const state = await read();
    state.children[0].name = "Ana";
    state.children[1].name = "Luca";
    state.children[2].name = "   ";
    state.present = [1, 3, 3, 99];
    state.helper = 3;
    state.childEmotions = { 1: "Vesel", 3: "Trist" };
    await p.evaluate(
      ({ key, state }) => localStorage.setItem(key, JSON.stringify(state)),
      { key: KEY, state },
    );
    await p.reload();
    await saved();
    assert.deepEqual((await read()).present, [1]);
    assert.equal((await read()).helper, null);
    assert.deepEqual((await read()).childEmotions, { 1: "Vesel" });
    await p.getByRole("button", { name: /Cine este la grădiniță/ }).click();
    assert.match(await p.locator(".counts").innerText(), /Absenți:\s*1/);
    assert.equal(await p.locator(".child-card:disabled").count(), 28);
    await p.screenshot({ path: "qa/reliability-attendance.png" });
    await p.getByRole("button", { name: "Acasă", exact: true }).click();
    await p.getByRole("button", { name: /Responsabilul zilei/ }).click();
    assert.equal(await p.locator(".child-card").count(), 1);
    await p.locator(".child-card").click();
    await saved();
    assert.equal((await read()).helper, 1);
    await settings();
    await p.getByLabel("Nume copil 1", { exact: true }).fill("");
    await saved();
    assert.deepEqual((await read()).present, []);
    assert.equal((await read()).helper, null);
    // Fail localStorage after photo staging, then retry the latest in-memory state.
    await p.evaluate((key) => {
      const original = Storage.prototype.setItem;
      window.failSave = true;
      Storage.prototype.setItem = function (k, v) {
        if (k === key && window.failSave)
          throw new DOMException(
            "Simulated full storage",
            "QuotaExceededError",
          );
        return original.call(this, k, v);
      };
    }, KEY);
    await p
      .getByLabel("Numele grupei", { exact: true })
      .fill("Configurația nesalvată");
    await p.getByRole("button", { name: "Reîncearcă salvarea" }).waitFor();
    assert.notEqual((await read()).group, "Configurația nesalvată");
    await p.screenshot({ path: "qa/reliability-save-error.png" });
    await p
      .getByLabel("Numele grupei", { exact: true })
      .fill("Ultima configurație");
    await p.getByRole("button", { name: "Reîncearcă salvarea" }).waitFor();
    await p.evaluate(() => {
      window.failSave = false;
      const original = navigator.locks.request.bind(navigator.locks);
      navigator.locks.request = (name, callback) =>
        original(name, async (lock) => {
          await new Promise((r) => setTimeout(r, 400));
          return callback(lock);
        });
    });
    await p.getByRole("button", { name: "Reîncearcă salvarea" }).click();
    await p.getByRole("status").filter({ hasText: "Se salvează…" }).waitFor();
    await saved();
    assert.equal((await read()).group, "Ultima configurație");
    const photo = await p.evaluate(() => {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      c.getContext("2d").fillRect(0, 0, 256, 256);
      return c.toDataURL("image/jpeg");
    });
    const backup = {
      format: "calendarul-naturii-config",
      version: 1,
      group: "Grupa restaurată",
      message: "Bună!",
      activities: ["Joacă"],
      children: (await read()).children,
    };
    backup.children[0] = { id: 1, name: "Ana", birthday: "2021-05-12", photo };
    const upload = async (content) =>
      p
        .getByLabel("Importă configurația", { exact: true })
        .setInputFiles({
          name: "backup.json",
          mimeType: "application/json",
          buffer: Buffer.from(content),
        });
    for (const corruption of [
      "{corupt",
      JSON.stringify({
        ...(await read()),
        children: (await read()).children.map((c, i) =>
          i === 0 ? { ...c, photo: "idb:missing" } : c,
        ),
      }),
    ]) {
      await p.evaluate(
        ({ key, corruption }) => localStorage.setItem(key, corruption),
        { key: KEY, corruption },
      );
      await p.reload();
      await p
        .getByRole("heading", { name: "Recuperează configurația grupei" })
        .waitFor();
      await upload("{invalid");
      await p
        .getByText(
          "Backupul nu este valid sau fotografiile nu pot fi citite. Datele existente au fost păstrate.",
        )
        .waitFor();
      assert.equal(
        await p.evaluate((k) => localStorage.getItem(k), KEY),
        corruption,
      );
      await upload(JSON.stringify(backup));
      await p.getByRole("button", { name: "Anulează", exact: true }).click();
      assert.equal(
        await p.evaluate((k) => localStorage.getItem(k), KEY),
        corruption,
      );
      await p.setViewportSize({ width: 390, height: 844 });
      await upload(JSON.stringify(backup));
      await p.getByRole("dialog").waitFor();
      await p.screenshot({ path: "qa/reliability-recovery-mobile.png" });
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await p
        .getByRole("button", { name: "Da, restaurează configurația" })
        .click();
      await saved();
      assert.equal((await read()).group, backup.group);
      assert((await read()).children[0].photo.startsWith("idb:"));
      await p.reload();
      await saved();
      await settings();
      assert(
        await p
          .locator(".child-editor")
          .first()
          .locator("img")
          .evaluate((i) => i.complete && i.naturalWidth === 256),
      );
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS empty/configured counts, stale selections cleaned, helper eligibility, name removal, failed save + latest-state retry, saving indicator, invalid/cancelled recovery preserves original, corrupt JSON + missing IndexedDB photo recovery, restored photo after reload, mobile dialog.",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
