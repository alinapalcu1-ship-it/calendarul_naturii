const { chromium, devices } = require("playwright");
const assert = require("node:assert/strict");
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  try {
    for (const [name, options] of [
      ["iphone", devices["iPhone 13"]],
      ["android", devices["Pixel 7"]],
      ["small", { viewport: { width: 320, height: 640 }, hasTouch: true }],
      ["laptop", { viewport: { width: 1366, height: 768 } }],
      ["board", { viewport: { width: 1920, height: 1080 }, hasTouch: true }],
    ]) {
      const c = await b.newContext(options),
        p = await c.newPage();
      await p.goto(process.env.TEST_URL || "http://127.0.0.1:5176/calendarul_naturii/");
      for (const name of [
        "Astăzi este…",
        "Anotimpul",
        "Cum este vremea?",
        "Cum ne îmbrăcăm?",
        "Cine este la grădiniță?",
        "Cum ne simțim?",
        "Responsabilul zilei",
        "Ziua noastră",
      ]) {
        await p
          .getByRole("button", {
            name: new RegExp(name.replace(/[?]/g, "\\?")),
          })
          .first()
          .click();
        const overflow = await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        );
        assert(
          !overflow,
          `${name} overflow ${JSON.stringify(options.viewport)}`,
        );
        const small = await p.locator("button:visible").evaluateAll((bs) =>
          bs
            .filter((b) => {
              const r = b.getBoundingClientRect();
              return r.width < 44 || r.height < 44;
            })
            .map((b) => ({
              text: b.innerText,
              label: b.getAttribute("aria-label"),
              width: b.getBoundingClientRect().width,
              height: b.getBoundingClientRect().height,
            })),
        );
        assert.deepEqual(small, [], `${name}: touch targets smaller than 44px`);
        if (name === "Cine este la grădiniță?")
          assert.equal(await p.locator(".child-card").count(), 30);
        await p.getByRole("button", { name: "Acasă", exact: true }).click();
      }
      await c.close();
      console.log("PASS pages", name);
    }
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
