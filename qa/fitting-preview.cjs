const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch({ channel: "msedge", headless: true });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto("http://127.0.0.1:5173");
  await p.getByRole("button", { name: /Cum ne îmbrăcăm\?/ }).click();
  await p.locator('[data-garment="fata_top_01"]').click();
  await p.getByRole("button", { name: "Partea de jos", exact: true }).click();
  await p.locator('[data-garment="fata_bottom_01"]').click();
  await p.getByRole("button", { name: "Încălțăminte", exact: true }).click();
  await p.locator('[data-garment="fata_shoes_01"]').click();
  await p.waitForTimeout(400);
  await p.screenshot({ path: "qa/final-fitting.png", fullPage: true });
  await b.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
