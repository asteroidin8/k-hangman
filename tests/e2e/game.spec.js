import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("loads the game board and accepts a jamo guess", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "도움말" })).toBeVisible();
  await expect(page.getByLabel("자모 키보드")).toBeVisible();

  await page.getByRole("button", { name: "ㅎ" }).click();
  await page.getByRole("button", { name: "입력" }).click();

  await expect(page.locator("#answerSlots")).toBeVisible();
});

test("keeps the first keyboard row on one line at 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const tops = await page.locator(".jamo-key-row").first().locator(".jamo-key").evaluateAll((keys) =>
    keys.map((key) => Math.round(key.getBoundingClientRect().top))
  );

  expect(new Set(tops).size).toBe(1);
});

test("keeps the board within the viewport at 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const boardBox = await page.locator("#board").boundingBox();

  expect(boardBox.y).toBeGreaterThanOrEqual(0);
  expect(boardBox.y + boardBox.height).toBeLessThanOrEqual(812);
});

test("accepts a desktop physical keyboard jamo", async ({ page }) => {
  await page.goto("/");

  await page.dispatchEvent("body", "keydown", { key: "ㅎ" });
  await page.dispatchEvent("body", "keydown", { key: "Enter" });

  await expect(page.locator("#answerSlots")).toBeVisible();
});

test("opens and closes settings", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "설정" }).click();
  await expect(page.getByRole("dialog", { name: "설정" })).toBeVisible();

  await page.getByLabel("틀린 자모 보기").check();
  await page.getByRole("button", { name: "닫기" }).click();

  await expect(page.locator("#settingsModal")).toHaveAttribute("aria-hidden", "true");
});

test("hides wrong jamo labels but keeps the area until the setting is enabled", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("#wrongJamoList")).not.toContainText("자");
  await expect(page.locator("#wrongJamoList")).not.toContainText("모");
  await expect(page.locator("#wrongJamoList")).not.toContainText("undefined");

  const hiddenBox = await page.locator("#wrongJamoList").boundingBox();
  expect(hiddenBox.height).toBeGreaterThan(0);

  await page.getByRole("button", { name: "설정" }).click();
  await page.getByLabel("틀린 자모 보기").check();
  await page.getByRole("button", { name: "닫기" }).click();

  await expect(page.locator("#wrongJamoList")).toContainText("자");
  await expect(page.locator("#wrongJamoList")).toContainText("모");
});

test("returns from a direct info page entry with browser back", async ({ page }) => {
  await page.goto("/privacy.html");

  await expect(page.getByRole("heading", { name: "개인정보처리방침" })).toBeVisible();

  await page.goBack();

  await expect(page).toHaveURL(/\/index\.html$/);
  await expect(page.getByRole("button", { name: "도움말" })).toBeVisible();
});
