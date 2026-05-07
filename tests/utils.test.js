import test from "node:test";
import assert from "node:assert/strict";

import { daysFromBase, splitHangulWord, VALID_JAMO } from "../core/utils.js";

test("splitHangulWord decomposes Hangul syllables into jamo", () => {
  assert.deepEqual(splitHangulWord("행맨"), ["ㅎ", "ㅐ", "ㅇ", "ㅁ", "ㅐ", "ㄴ"]);
  assert.deepEqual(splitHangulWord("자전거"), ["ㅈ", "ㅏ", "ㅈ", "ㅓ", "ㄴ", "ㄱ", "ㅓ"]);
  assert.deepEqual(splitHangulWord("의사"), ["ㅇ", "ㅡ", "ㅣ", "ㅅ", "ㅏ"]);
  assert.deepEqual(splitHangulWord("앵두"), ["ㅇ", "ㅐ", "ㅇ", "ㄷ", "ㅜ"]);
  assert.deepEqual(splitHangulWord("외투"), ["ㅇ", "ㅗ", "ㅣ", "ㅌ", "ㅜ"]);
  assert.deepEqual(splitHangulWord("과일"), ["ㄱ", "ㅗ", "ㅏ", "ㅇ", "ㅣ", "ㄹ"]);
});

test("splitHangulWord keeps non-Hangul characters as-is", () => {
  assert.deepEqual(splitHangulWord("A행!"), ["A", "ㅎ", "ㅐ", "ㅇ", "!"]);
});

test("daysFromBase returns the puzzle offset from the base date", () => {
  assert.equal(daysFromBase("2026-01-01", "2026-01-01"), 0);
  assert.equal(daysFromBase("2026-01-01", "2026-01-02"), 1);
  assert.equal(daysFromBase("2026-01-01", "2025-12-31"), -1);
});

test("VALID_JAMO accepts Korean consonant and vowel jamo", () => {
  assert.equal(VALID_JAMO.has("ㅎ"), true);
  assert.equal(VALID_JAMO.has("ㅐ"), true);
  assert.equal(VALID_JAMO.has("ㅚ"), false);
  assert.equal(VALID_JAMO.has("ㄲ"), false);
  assert.equal(VALID_JAMO.has("ㅘ"), false);
  assert.equal(VALID_JAMO.has("A"), false);
});
