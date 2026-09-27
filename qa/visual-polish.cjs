const { chromium } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({
    channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
    headless: true,
  });
  try {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
    const errors = [];
    p.on("pageerror", (e) => errors.push(e.message));
    await p.goto("http://127.0.0.1:5173");
    const home = () =>
      p.getByRole("button", { name: "Acasă", exact: true }).click();
    await p.getByRole("button", { name: /Anotimpul/ }).click();
    await p.waitForFunction(() =>
      [...document.querySelectorAll(".seasons img")].every(
        (image) => image.complete && image.naturalWidth > 0,
      ),
    );
    assert(
      (await p.locator(".season-picture").first().boundingBox()).height >= 350,
    );
    assert(
      await p
        .locator(".seasons .choice")
        .first()
        .evaluate(
          (e) =>
            e.querySelector("img").getBoundingClientRect().bottom <=
            e.lastElementChild.getBoundingClientRect().top,
        ),
      "season artwork must not overlap its label",
    );
    await p.screenshot({ path: "qa/polish-seasons.png" });
    await home();
    await p.getByRole("button", { name: /Cum este vremea/ }).click();
    assert(
      (await p.locator(".weather .choice>.storybook-art").first().boundingBox())
        .width >= 170,
    );
    assert(
      (await p.locator(".temperature .storybook-art").first().boundingBox())
        .width >= 90,
    );
    await p.screenshot({ path: "qa/polish-weather.png" });
    await home();
    await p.getByRole("button", { name: /Ziua noastră/ }).click();
    await p
      .getByRole("button", { name: "Gata! Începem ziua!", exact: true })
      .click();
    assert.equal(await p.locator(".celebration-confetti i").count(), 22);
    assert(
      await p
        .locator(".celebration-confetti i")
        .first()
        .evaluate(
          (e) => getComputedStyle(e).animationIterationCount === "infinite",
        ),
    );
    await p.screenshot({ path: "qa/polish-celebration.png" });
    await p.emulateMedia({ reducedMotion: "reduce" });
    assert(
      await p
        .locator(".celebration-confetti i")
        .first()
        .evaluate((e) => getComputedStyle(e).animationName === "none"),
    );
    for (const width of [1280, 768, 390, 320]) {
      await p.setViewportSize({ width, height: 900 });
      for (const module of [
        "Anotimpul",
        "Cum este vremea",
        "Cum ne îmbrăcăm",
      ]) {
        await home();
        await p.getByRole("button", { name: new RegExp(module) }).click();
        assert(
          await p.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `${module} overflow at ${width}`,
        );
      }
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS enlarged illustrations, gentle decoration, reduced motion, responsive layouts, no runtime errors",
    );
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
