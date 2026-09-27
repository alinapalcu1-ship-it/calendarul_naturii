const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    headless: true,
    channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
  });
  try {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("http://127.0.0.1:5173");
    const home = () =>
      p.getByRole("button", { name: "Acasă", exact: true }).click();
    const saved = () =>
      p.evaluate(() =>
        JSON.parse(localStorage.getItem("calendarul-naturii-v1")),
      );
    await p.getByRole("button", { name: /Cum ne îmbrăcăm/ }).click();
    await p.locator('[data-garment="fata_top_01"]').click();
    await p.getByRole("button", { name: "Băiat", exact: true }).click();
    assert.equal(await p.locator(".fitted-layer").count(), 0);
    await p.locator('[data-garment="baiat_top_01"]').click();
    await p.getByRole("button", { name: "Fetiță", exact: true }).click();
    assert.equal(await p.locator(".fitted-layer").count(), 0);
    for (const [name, count] of [
      ["Partea de sus", 6],
      ["Partea de jos", 4],
      ["Încălțăminte", 6],
      ["Exterior / Accesorii", 10],
    ]) {
      await p.getByRole("button", { name, exact: true }).click();
      assert.equal(await p.locator(".final-garment").count(), count);
    }
    await p.reload();
    assert.deepEqual((await saved()).outfits, { girl: [], boy: [] });

    await p.getByRole("button", { name: /Cine este la grădiniță/ }).click();
    assert(
      await p
        .getByRole("button", { name: "Emoția pentru Copil 1", exact: true })
        .isDisabled(),
    );
    await p
      .getByRole("button", { name: "Copil 1 Absent", exact: true })
      .click();
    await p
      .getByRole("button", { name: "Emoția pentru Copil 1", exact: true })
      .click();
    await p.getByRole("button", { name: "Vesel", exact: true }).click();
    assert.equal((await saved()).childEmotions[1], "Vesel");
    await p
      .getByRole("button", { name: "Copil 2 Absent", exact: true })
      .click();
    await p
      .getByRole("button", { name: "Emoția pentru Copil 2", exact: true })
      .click();
    await p.getByRole("button", { name: "Liniștit", exact: true }).click();
    assert.equal((await saved()).childEmotions[1], "Vesel");
    assert.equal((await saved()).childEmotions[2], "Liniștit");
    await p.screenshot({
      path: "qa/individual-attendance.png",
      fullPage: true,
    });
    await p
      .getByRole("button", { name: "Copil 1 ✓ Prezent", exact: true })
      .click();
    assert(
      await p
        .getByRole("button", { name: "Emoția pentru Copil 1", exact: true })
        .isDisabled(),
    );
    await p.reload();
    await p.getByRole("button", { name: /Cine este la grădiniță/ }).click();
    await p
      .getByRole("button", { name: "Copil 1 Absent", exact: true })
      .click();
    await p
      .getByRole("button", {
        name: "Emoția pentru Copil 1: Vesel",
        exact: true,
      })
      .click();
    await p.keyboard.press("Escape");
    assert.equal(await p.locator("dialog[open]").count(), 0);

    await p.setViewportSize({ width: 390, height: 844 });
    assert(
      await p.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await p.screenshot({ path: "qa/individual-mobile.png", fullPage: true });
    assert.deepEqual(errors, []);
    console.log(
      "PASS reset on mannequin change, 26 items per gender, individual emotions, absence, persistence, mobile",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
