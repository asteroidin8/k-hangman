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

test("keeps board chrome consistent across responsive widths", async ({ page }) => {
  const snapshots = [];

  for (const width of [375, 480, 641]) {
    await page.setViewportSize({ width, height: 812 });
    await page.goto("/");

    snapshots.push(await page.locator("#board").evaluate((board) => {
      const style = window.getComputedStyle(board);
      return {
        borderTopWidth: style.borderTopWidth,
        borderRadius: style.borderRadius,
        paddingTop: style.paddingTop,
        paddingRight: style.paddingRight,
        paddingBottom: style.paddingBottom,
        paddingLeft: style.paddingLeft,
      };
    }));
  }

  expect(new Set(snapshots.map((snapshot) => JSON.stringify(snapshot))).size).toBe(1);
});

test("keeps compact board content inside the board at 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const boxes = await page.evaluate(() => {
    const read = (selector) => {
      const rect = document.querySelector(selector).getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom };
    };

    return {
      board: read("#board"),
      meaning: read("#wordMeaning"),
      hangman: read(".hangman-zone"),
      answer: read(".answer-row"),
      input: read(".input-row"),
    };
  });

  expect(boxes.meaning.top).toBeGreaterThanOrEqual(boxes.board.top);
  expect(boxes.hangman.top).toBeGreaterThanOrEqual(boxes.meaning.bottom);
  expect(boxes.answer.top).toBeGreaterThanOrEqual(boxes.hangman.bottom);
  expect(boxes.input.top).toBeGreaterThanOrEqual(boxes.answer.bottom);
  expect(boxes.input.bottom).toBeLessThanOrEqual(boxes.board.bottom);
});

test("places mirrored l-shaped action keys beside the keyboard rows", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const layout = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".jamo-key-row"));
    const read = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        right: Math.round(rect.right),
      };
    };
    const deleteButton = document.querySelector("[data-action='delete']");
    const submitButton = document.querySelector("[data-action='submit']");

    return {
      row2: read(rows[1]),
      row3: read(rows[2]),
      deleteButton: read(deleteButton),
      submitButton: read(submitButton),
      deleteClipPath: window.getComputedStyle(deleteButton).clipPath,
      submitClipPath: window.getComputedStyle(submitButton).clipPath,
      row2FirstKey: document.elementFromPoint(...center(rows[1].querySelector(".jamo-key"))).textContent,
      row2LastKey: document.elementFromPoint(...center(rows[1].querySelector(".jamo-key:last-child"))).textContent,
      row3FirstKey: document.elementFromPoint(...center(rows[2].querySelector(".jamo-key"))).textContent,
      row3LastKey: document.elementFromPoint(...center(rows[2].querySelector(".jamo-key:last-child"))).textContent,
    };

    function center(element) {
      const rect = element.getBoundingClientRect();
      return [rect.left + rect.width / 2, rect.top + rect.height / 2];
    }
  });

  expect(layout.deleteButton.top).toBe(layout.row2.top);
  expect(layout.submitButton.top).toBe(layout.row2.top);
  expect(layout.deleteButton.bottom).toBe(layout.row3.bottom);
  expect(layout.submitButton.bottom).toBe(layout.row3.bottom);
  expect(layout.deleteClipPath).toContain("polygon");
  expect(layout.submitClipPath).toContain("polygon");
  expect(layout.row2FirstKey).toBe("ㅁ");
  expect(layout.row2LastKey).toBe("ㅣ");
  expect(layout.row3FirstKey).toBe("ㅋ");
  expect(layout.row3LastKey).toBe("ㅡ");
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
