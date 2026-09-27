const { chromium } = require("playwright");
let browser;
const assert = require("node:assert/strict");
(async () => {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_CHANNEL
      ? { channel: process.env.PLAYWRIGHT_CHANNEL }
      : {}),
  });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });
  await page.clock.setFixedTime(new Date("2026-09-26T12:00:00"));
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:5173");
  const key = "calendarul-naturii-v1";
  await page.getByRole("button", { name: /Astăzi este/ }).click();
  await page.getByRole("button", { name: /Luna/ }).click();
  await page.getByRole("button", { name: "Ianuarie", exact: true }).click();
  await page.getByRole("button", { name: /^Data/ }).click();
  await page.getByRole("button", { name: "31", exact: true }).click();
  await page.getByRole("button", { name: /Luna/ }).click();
  await page.getByRole("button", { name: "Februarie", exact: true }).click();
  assert.equal(
    await page.locator(".date-preview").innerText(),
    "Astăzi este sâmbătă, 28 februarie 2026.",
  );
  await page.getByRole("button", { name: /Anul/ }).click();
  await page.getByRole("button", { name: "Anul următor" }).click();
  await page.getByRole("button", { name: "Anul următor" }).click();
  await page.getByRole("button", { name: /^Data/ }).click();
  await page.getByRole("button", { name: "29", exact: true }).click();
  assert.match(
    await page.locator(".date-preview").innerText(),
    /29 februarie 2028/,
  );
  await page.getByRole("button", { name: "Acasă", exact: true }).click();
  await page
    .getByRole("button", { name: "Ecran complet", exact: true })
    .click();
  assert(await page.evaluate(() => !!document.fullscreenElement));
  await page
    .getByRole("button", { name: "Ieși din ecran complet", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Setări educatoare", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Numele grupei", exact: true })
    .fill("Grupa Test");
  await page.getByRole("button", { name: "Mic dejun", exact: false }).click();
  await page.getByRole("button", { name: "Acasă", exact: true }).click();
  assert.equal(await page.locator(".routine-item").count(), 5);
  await page.evaluate((key) => {
    const s = JSON.parse(localStorage.getItem(key));
    s.dayKey = "2000-01-01";
    s.present = [1];
    s.helper = 1;
    s.weather = ["Ploaie"];
    s.season = "Toamna";
    localStorage.setItem(key, JSON.stringify(s));
  }, key);
  await page.reload();
  const s = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  );
  assert.equal(s.present.length, 0);
  assert.equal(s.helper, null);
  assert.equal(s.season, "Toamna");
  assert.equal(s.group, "Grupa Test");
  await page
    .getByRole("button", { name: "Setări educatoare", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Resetează complet aplicația" })
    .click();
  await page.getByRole("button", { name: "Anulează", exact: true }).click();
  assert.equal(
    await page.getByRole("textbox", { name: "Numele grupei" }).inputValue(),
    "Grupa Test",
  );
  await page
    .getByRole("button", { name: "Resetează complet aplicația" })
    .click();
  await page
    .getByRole("button", { name: "Da, șterge tot", exact: true })
    .click();
  assert.equal(
    await page.getByRole("textbox", { name: "Numele grupei" }).inputValue(),
    "Grupa Mămăruțelor",
  );
  await page.getByRole("button", { name: "Acasă", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  const modules = [
    "Astăzi este",
    "Anotimpul",
    "Cum este vremea",
    "Cum ne îmbrăcăm",
    "Cine este la grădiniță",
    "Cum ne simțim",
    "Responsabilul zilei",
    "Ziua noastră",
  ];
  for (const name of modules) {
    await page.getByRole("button", { name: new RegExp(name) }).click();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      name + " overflow",
    );
    await page.getByRole("button", { name: "Acasă", exact: true }).click();
  }
  await page.getByRole("button", { name: "Setări educatoare" }).click();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "settings overflow",
  );
  console.log(
    "PASS date coherence, month clamp, leap year, fullscreen, routines, day rollover, reset cancel/confirm, all mobile modules",
  );
  await browser.close();
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
  });
