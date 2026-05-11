import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
});

test("loads the game board and accepts a jamo guess", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("button", { name: "도움말" })).toBeVisible();
  await expect(page.getByLabel("자모 키보드")).toBeVisible();

  await page.getByRole("button", { name: "ㅎ" }).click();

  await expect(page.locator("#answerSlots")).toBeVisible();
  await expect(page.getByRole("button", { name: "입력" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "삭제" })).toHaveCount(0);
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

test("keeps the hangman zone matched to the svg height at 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const boxes = await page.evaluate(() => {
    const meaning = document.querySelector("#wordMeaning").getBoundingClientRect();
    const hangman = document.querySelector(".hangman-zone").getBoundingClientRect();
    const gallows = document.querySelector("#gallowsMount").getBoundingClientRect();
    const answer = document.querySelector(".answer-row").getBoundingClientRect();

    return {
      meaningHeight: Math.round(meaning.height),
      hangmanHeight: Math.round(hangman.height),
      gallowsHeight: Math.round(gallows.height),
      answerHeight: Math.round(answer.height),
    };
  });

  expect(boxes.hangmanHeight).toBe(boxes.gallowsHeight);
  expect(boxes.meaningHeight).toBeGreaterThanOrEqual(72);
  expect(boxes.answerHeight).toBeGreaterThanOrEqual(150);
});

test("scales board sections together as viewport height grows", async ({ page }) => {
  const readLayout = async (height) => {
    await page.setViewportSize({ width: 375, height });
    await page.goto("/");
    await page.locator(".jamo-key").first().waitFor();

    return page.evaluate(() => {
      const readHeight = (selector) => Math.round(document.querySelector(selector).getBoundingClientRect().height);

      return {
        meaning: readHeight("#wordMeaning"),
        hangman: readHeight(".hangman-zone"),
        answer: readHeight(".answer-row"),
        input: readHeight(".input-row"),
        key: readHeight(".jamo-key"),
      };
    });
  };

  const compact = await readLayout(812);
  const roomy = await readLayout(932);

  expect(roomy.meaning).toBeGreaterThan(compact.meaning);
  expect(roomy.hangman).toBeGreaterThan(compact.hangman);
  expect(roomy.answer).toBeGreaterThan(compact.answer);
  expect(roomy.input).toBeGreaterThan(compact.input);
  expect(roomy.key).toBeGreaterThan(compact.key);
});

test("fills the keyboard height with taller jamo keys at 375px", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const boxes = await page.evaluate(() => {
    const input = document.querySelector(".input-row").getBoundingClientRect();
    const wrongJamo = document.querySelector("#wrongJamoList").getBoundingClientRect();
    const keyboard = document.querySelector("#jamoKeyboard").getBoundingClientRect();
    const lastRow = document.querySelector(".jamo-key-row:last-child").getBoundingClientRect();
    const key = document.querySelector(".jamo-key").getBoundingClientRect();

    return {
      inputBottom: Math.round(input.bottom),
      wrongJamoBottom: Math.round(wrongJamo.bottom),
      keyboardTop: Math.round(keyboard.top),
      keyboardBottom: Math.round(keyboard.bottom),
      lastRowBottom: Math.round(lastRow.bottom),
      keyHeight: Math.round(key.height),
    };
  });

  expect(boxes.lastRowBottom).toBe(boxes.keyboardBottom);
  expect(boxes.keyboardTop - boxes.wrongJamoBottom).toBeGreaterThanOrEqual(20);
  expect(boxes.inputBottom - boxes.keyboardBottom).toBe(14);
  expect(boxes.keyHeight).toBeGreaterThanOrEqual(48);
  expect(boxes.keyHeight).toBeLessThanOrEqual(76);
});

test("keeps answer layout stable after a jamo guess", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const readLayout = async () => page.evaluate(() => {
    const read = (selector) => {
      const rect = document.querySelector(selector).getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        height: Math.round(rect.height),
      };
    };

    return {
      answer: read(".answer-row"),
      slots: read(".answer-slots"),
      input: read(".input-row"),
    };
  });

  const before = await readLayout();
  await page.getByRole("button", { name: "ㅎ" }).click();
  const after = await readLayout();

  expect(after.answer).toEqual(before.answer);
  expect(after.slots.height).toBe(before.slots.height);
  expect(after.input).toEqual(before.input);
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

test("accepts a desktop physical keyboard jamo", async ({ page }) => {
  await page.goto("/");

  await page.dispatchEvent("body", "keydown", { key: "ㅎ" });

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
