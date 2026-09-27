const { chromium } = require("playwright");
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
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto(process.env.BASE_URL || "http://127.0.0.1:5173");
  await page.screenshot({ path: "qa/home-desktop.png", fullPage: true });
  console.log(
    "home height",
    await page.evaluate(() => document.documentElement.scrollHeight),
  );
  await page.getByRole("button", { name: /Cine este la grădiniță/ }).click();
  await page
    .getByRole("button", { name: "Copil 1 Absent", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Copil 2 Absent", exact: true })
    .click();
  if ((await page.getByText("Prezenți: 2", { exact: true }).count()) !== 1)
    throw Error("attendance count");
  await page.reload();
  if (
    (await page
      .getByRole("button", { name: /Cine este la grădiniță/ })
      .count()) !== 1
  )
    throw Error("reload home");
  const go = async (name) => {
    await page.getByRole("button", { name: "Acasă", exact: true }).click();
    await page.getByRole("button", { name }).click();
  };
  await page.getByRole("button", { name: /Responsabilul zilei/ }).click();
  await page.getByRole("button", { name: "Copil 1", exact: true }).click();
  await go(/Anotimpul/);
  await page.getByRole("button", { name: "Toamna", exact: true }).click();
  await go(/Cum este vremea/);
  await page.getByRole("button", { name: "Înnorat", exact: true }).click();
  await page.getByRole("button", { name: "Vânt", exact: true }).click();
  await page.getByRole("button", { name: "Ploaie", exact: true }).click();
  if ((await page.locator(".weather [aria-pressed=true]").count()) !== 2)
    throw Error("max weather");
  await page.getByRole("button", { name: "Răcoare", exact: true }).click();
  await go(/Cum ne îmbrăcăm/);
  await page
    .getByRole("button", { name: "Exterior / Accesorii", exact: true })
    .click();
  await page.getByRole("button", { name: "Geacă roz", exact: true }).click();
  await page.getByRole("button", { name: "Încălțăminte", exact: true }).click();
  await page
    .getByRole("button", { name: "Cizme roz îmblănite", exact: true })
    .click();
  await page.screenshot({ path: "qa/clothing-desktop.png", fullPage: true });
  await go(/Cum ne simțim/);
  await page.getByRole("button", { name: "Vesel", exact: true }).click();
  await go(/Ziua noastră/);
  if (
    !(await page
      .getByText("Responsabilul zilei este Copil 1.", { exact: true })
      .count())
  )
    throw Error("summary helper");
  await page
    .getByRole("button", { name: "Gata! Începem ziua!", exact: true })
    .click();
  await page.getByText("O zi plină de bucurie!").waitFor();
  await page
    .getByRole("button", { name: "Setări educatoare", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Nume copil 1", exact: true })
    .fill("Maria");
  await page
    .getByLabel("Fotografie copil 1", { exact: true })
    .setInputFiles("qa/home-desktop.png");
  await page
    .getByRole("button", { name: "Elimină fotografia", exact: true })
    .waitFor();
  await page.reload();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("calendarul-naturii-v1")),
  );
  if (
    saved.children[0].name !== "Maria" ||
    !saved.children[0].photo.startsWith("data:image/jpeg")
  )
    throw Error("settings persistence");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "qa/home-mobile.png", fullPage: true });
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  )
    throw Error("mobile overflow");
  console.log(
    "PASS attendance, persistence, helper, weather max, clothing, emotion, summary, settings, photo, mobile; errors:",
    errors,
  );
  await browser.close();
  if (errors.length) process.exitCode = 1;
})()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await browser?.close();
  });
