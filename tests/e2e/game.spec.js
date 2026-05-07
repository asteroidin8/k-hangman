import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("loads the game board and accepts a jamo guess", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "도움말" })).toBeVisible();
  await expect(page.getByLabel("자모 입력 필드")).toBeEnabled();

  await page.getByLabel("자모 입력 필드").fill("ㅎ");
  await page.keyboard.press("Enter");

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

test("returns from a direct info page entry with browser back", async ({ page }) => {
  await page.goto("/privacy.html");

  await expect(page.getByRole("link", { name: "행맨" })).toBeVisible();

  await page.goBack();

  await expect(page).toHaveURL(/\/index\.html$/);
  await expect(page.getByRole("button", { name: "도움말" })).toBeVisible();
});
