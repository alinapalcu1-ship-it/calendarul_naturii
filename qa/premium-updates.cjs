const { chromium } = require("playwright");
const assert = require("node:assert/strict");
let browser;
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
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:5173");
  const key = "calendarul-naturii-v1";
  const photo =
    "data:image/png;base64," +
    (
      await page.screenshot({ clip: { x: 0, y: 0, width: 4, height: 4 } })
    ).toString("base64");
  const oldChildren = await page.evaluate(
    ({ key, photo }) => {
      const s = JSON.parse(localStorage.getItem(key));
      s.children = s.children.slice(0, 15);
      s.children[0] = {
        ...s.children[0],
        name: "Ana",
        birthday: "2023-04-12",
        photo,
      };
      s.group = "Grupa păstrată";
      s.present = [1, 3];
      s.helper = 1;
      s.message = "Mesaj păstrat";
      s.clothes = ["Bluză", "Cizme"];
      delete s.outfits;
      s.activities = [
        "Bună dimineața",
        "Activitate",
        "Joacă",
        "Masa",
        "Odihnă",
      ];
      delete s.mannequin;
      localStorage.setItem(key, JSON.stringify(s));
      return s.children;
    },
    { key, photo },
  );
  await page.reload();
  let saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  );
  assert.equal(saved.children.length, 22);
  assert.deepEqual(saved.children.slice(0, 15), oldChildren);
  assert.deepEqual(saved.present, [1, 3]);
  assert.equal(saved.helper, 1);
  assert.equal(saved.group, "Grupa păstrată");
  assert.equal(saved.message, "Mesaj păstrat");
  assert.deepEqual(saved.activities, [
    "Bună dimineața",
    "Joacă",
    "Activități",
    "Masa de prânz",
    "Odihnă",
  ]);
  const goHome = () =>
    page.getByRole("button", { name: "Acasă", exact: true }).click();
  await page.getByRole("button", { name: /Cine este la grădiniță/ }).click();
  assert.equal(await page.locator(".child-card").count(), 22);
  await page
    .getByRole("button", { name: "Copil 22 Absent", exact: true })
    .click();
  assert.equal(await page.getByText("Prezenți: 3", { exact: true }).count(), 1);
  await page.screenshot({ path: "qa/premium-attendance.png" });
  assert(
    await page.evaluate(() => document.documentElement.scrollHeight <= 1080),
    "attendance should fit Full HD",
  );
  await goHome();
  await page.getByRole("button", { name: /Cum ne îmbrăcăm/ }).click();
  assert.equal(await page.locator(".final-categories button").count(), 4);
  for (const [variant, prefix] of [
    ["Băiat", "baiat"],
    ["Fetiță", "fata"],
  ]) {
    await page.getByRole("button", { name: variant, exact: true }).click();
    let tested = 0;
    for (const category of [
      "Partea de sus",
      "Partea de jos",
      "Încălțăminte",
      "Exterior / Accesorii",
    ]) {
      await page.getByRole("button", { name: category, exact: true }).click();
      const buttons = page.locator(".final-garment");
      for (let i = 0; i < (await buttons.count()); i++) {
        const button = buttons.nth(i);
        const id = await button.getAttribute("data-garment");
        assert(id.startsWith(prefix));
        await button.click();
        assert.equal(await page.locator(`[data-item="${id}"]`).count(), 1);
        tested++;
      }
    }
    assert.equal(tested, 26);
    await page
      .getByRole("button", { name: "Încep din nou", exact: true })
      .click();
    assert.equal(await page.locator(".fitted-layer").count(), 0);
  }
  await page.reload();
  saved = await page.evaluate(
    (key) => JSON.parse(localStorage.getItem(key)),
    key,
  );
  assert.deepEqual(saved.children.slice(0, 15), oldChildren);
  await page.getByRole("button", { name: /Anotimpul/ }).click();
  await page.locator(".seasons .season-art").first().waitFor();
  await page.waitForFunction(() =>
    [...document.querySelectorAll(".seasons img")].every(
      (img) => img.complete && img.naturalWidth >= 1000,
    ),
  );
  assert.equal(await page.locator(".seasons .season-art").count(), 4);
  await page.getByRole("button", { name: "Iarna", exact: true }).click();
  await page.screenshot({ path: "qa/refined-seasons.png" });
  await goHome();
  await page.getByRole("button", { name: /Astăzi este/ }).click();
  assert.equal(await page.locator(".weekdays .choice").count(), 5);
  assert.equal(await page.locator(".day-number").count(), 0);
  assert.equal(await page.locator(".weekdays .storybook-art").count(), 5);
  assert.equal(await page.locator(".counting-hand").count(), 0);
  const days = page.locator(".weekday-stars");
  assert.equal(await days.count(), 5);
  for (let i = 0; i < 5; i++) {
    assert.equal(await days.nth(i).locator("[data-count-star]").count(), i + 1);
  }
  await page.screenshot({ path: "qa/premium-days.png" });
  await page.getByRole("button", { name: /Luna/ }).click();
  assert.equal(await page.locator(".month-grid .storybook-art").count(), 12);
  const positions = await page
    .locator(".month-grid .storybook-art")
    .evaluateAll((els) => els.map((e) => e.style.backgroundPosition));
  assert.equal(new Set(positions).size, 12);
  await page.screenshot({ path: "qa/premium-months.png" });
  await goHome();
  await page.getByRole("button", { name: /Cum ne simțim/ }).click();
  assert.equal(await page.locator(".emotions .storybook-premium").count(), 6);
  await page.getByRole("button", { name: "Liniștit", exact: true }).click();
  await page.waitForTimeout(350);
  await page.screenshot({ path: "qa/premium-emotions.png" });
  await goHome();
  await page
    .getByRole("button", { name: "Setări educatoare", exact: true })
    .click();
  await page.getByRole("button", { name: "Mic dejun", exact: false }).click();
  await goHome();
  const routine = await page
    .locator(".routine-item>[data-illustration]")
    .evaluateAll((els) => els.map((e) => e.dataset.illustration));
  assert.deepEqual(routine, [
    "Bună dimineața",
    "Mic dejun",
    "Joacă",
    "Activități",
    "Masa de prânz",
    "Odihnă",
  ]);
  const breakfast = await page
    .locator('.routine-item [data-illustration="Mic dejun"]')
    .evaluate((e) => e.style.backgroundPosition);
  const lunch = await page
    .locator('.routine-item [data-illustration="Masa de prânz"]')
    .evaluate((e) => e.style.backgroundPosition);
  assert.notEqual(breakfast, lunch);
  await page.getByRole("button", { name: /Ziua noastră/ }).click();
  assert.equal(await page.locator(".summary-actions button").count(), 1);
  assert.equal(
    await page.getByRole("button", { name: /Ascultăm|citirea/ }).count(),
    0,
  );
  assert.equal(await page.locator(".summary-grid .summary-card").count(), 6);
  await page
    .getByRole("button", { name: "Gata! Începem ziua!", exact: true })
    .click();
  await page.getByText("O zi plină de bucurie!").waitFor();
  await page.waitForTimeout(650);
  await page.screenshot({ path: "qa/refined-celebration.png" });
  await goHome();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: /Cum ne îmbrăcăm/ }).click();
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  await page.waitForTimeout(650);
  await page.screenshot({ path: "qa/premium-mobile.png", fullPage: true });
  assert.deepEqual(errors, []);
  console.log(
    "PASS old-data migration, 22 children, preserved photos/settings, both characters, all 52 garments, 4 categories, countable stars without hands, persistence, calendar art, emoji, ordered distinct meals, Full HD and mobile",
  );
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
  });
