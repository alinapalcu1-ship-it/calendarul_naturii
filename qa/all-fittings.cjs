const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  try {
    const p = await b.newPage({
      viewport: { width: 1920, height: 1080 },
      reducedMotion: "reduce",
    });
    await p.goto("http://127.0.0.1:5173");
    await p.getByRole("button", { name: /Cum ne îmbrăcăm/ }).click();
    for (const [name, prefix] of [
      ["Fetiță", "fata"],
      ["Băiat", "baiat"],
    ]) {
      await p.getByRole("button", { name, exact: true }).click();
      for (const category of [
        "Partea de sus",
        "Partea de jos",
        "Încălțăminte",
        "Exterior / Accesorii",
      ]) {
        await p.getByRole("button", { name: category, exact: true }).click();
        const ids = await p
          .locator("[data-garment]")
          .evaluateAll((es) => es.map((e) => e.dataset.garment));
        for (const id of ids) {
          await p
            .getByRole("button", { name: "Încep din nou", exact: true })
            .click();
          await p.locator(`[data-garment="${id}"]`).click();
          await p
            .locator(".fitted-mannequin")
            .screenshot({ path: `qa/fit-${id}.png` });
        }
      }
    }
    console.log("Captured all 52 fittings");
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
