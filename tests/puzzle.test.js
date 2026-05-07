import assert from "node:assert/strict";
import test from "node:test";

import { createDailyPuzzle } from "../core/puzzle.js";

test("기준일에 첫 번째 문제를 선택한다", () => {
  const puzzle = createDailyPuzzle(
    [
      { word: "행복", meaning: "만족과 기쁨" },
      { word: "모순", meaning: "앞뒤가 맞지 않음" },
    ],
    "2025-01-01",
    "2025-01-01"
  );

  assert.equal(puzzle.today, "2025-01-01");
  assert.equal(puzzle.puzzleNumber, 1);
  assert.equal(puzzle.answerWord, "행복");
  assert.equal(puzzle.answerMeaning, "만족과 기쁨");
  assert.deepEqual(puzzle.answerJamo, ["ㅎ", "ㅐ", "ㅇ", "ㅂ", "ㅗ", "ㄱ"]);
});

test("문제 번호가 단어 수를 넘으면 목록을 순환한다", () => {
  const puzzle = createDailyPuzzle(["가", "나"], "2025-01-01", "2025-01-03");

  assert.equal(puzzle.puzzleNumber, 3);
  assert.equal(puzzle.answerWord, "가");
  assert.equal(puzzle.answerMeaning, "");
  assert.deepEqual(puzzle.answerJamo, ["ㄱ", "ㅏ"]);
});
