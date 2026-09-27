const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const browser = await chromium.launch({ headless: true, channel: "msedge" });
  try {
    const p = await browser.newPage();
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("http://127.0.0.1:5173");
    await p.evaluate(() => document.fonts.ready);
    for (const [width, height] of [
      [1920, 1080],
      [1280, 800],
      [768, 1024],
      [390, 844],
      [320, 740],
    ]) {
      await p.setViewportSize({ width, height });
      await p.reload();
      await p.evaluate(() => document.fonts.ready);
      assert(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `home overflow ${width}`,
      );
      for (const name of [
        "Astăzi este",
        "Anotimpul",
        "Cum este vremea",
        "Cum ne îmbrăcăm",
        "Cine este la grădiniță",
        "Cum ne simțim",
        "Responsabilul zilei",
        "Ziua noastră",
      ]) {
        await p.getByRole("button", { name: new RegExp(name) }).click();
        assert(
          await p.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${name} overflow ${width}`,
        );
        await p.getByRole("button", { name: "Acasă", exact: true }).click();
      }
      if (width === 1920 || width === 390)
        await p.screenshot({ path: `qa/board-${width}.png`, fullPage: true });
    }
    await p.setViewportSize({ width: 1920, height: 1080 });
    await p.getByRole("button", { name: "Luni", exact: true }).click();
    await p.getByRole("button", { name: "Vesel", exact: true }).click();
    await p
      .getByRole("button", { name: "Bluză roz cu floricele", exact: true })
      .click();
    await p.getByRole("button", { name: "Băiat", exact: true }).click();
    assert.equal(await p.locator(".fitted-mannequin [data-item]").count(), 0);
    await p
      .getByRole("button", { name: "Bluză crem cu mașinuță", exact: true })
      .click();
    await p.getByRole("button", { name: "Fetiță", exact: true }).click();
    assert.equal(
      await p.locator('.fitted-mannequin [data-item="fata_top_01"]').count(),
      0,
    );
    await p
      .getByRole("button", { name: "Copil 1: absent", exact: true })
      .click();
    await p
      .getByRole("button", { name: "Alege emoția pentru Copil 1", exact: true })
      .click();
    await p
      .getByRole("dialog")
      .getByRole("button", { name: "Liniștit", exact: true })
      .click();
    await p.reload();
    const s = await p.evaluate(() =>
      JSON.parse(localStorage.getItem("calendarul-naturii-v1")),
    );
    assert.equal(s.childEmotions[1], "Liniștit");
    assert.equal(s.emotion, "Vesel");
    assert.deepEqual(s.outfits, { girl: [], boy: [] });
    assert.equal(await p.locator(".home-grid button").count(), 7);
    assert(
      await p.evaluate(
        () =>
          document.fonts.check("700 20px Nunito") &&
          document.fonts.check('700 32px "Playfair Display"'),
      ),
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS live dashboard controls, shared persistence, local fonts, all pages at 1920/1280/768/390/320, no horizontal overflow",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
