import test from "node:test";
import assert from "node:assert/strict";

import { daysFromBase, splitHangulWord, VALID_JAMO } from "../core/utils.js";

test("splitHangulWord decomposes Hangul syllables into jamo", () => {
  assert.deepEqual(splitHangulWord("행맨"), ["ㅎ", "ㅐ", "ㅇ", "ㅁ", "ㅐ", "ㄴ"]);
  assert.deepEqual(splitHangulWord("자전거"), ["ㅈ", "ㅏ", "ㅈ", "ㅓ", "ㄴ", "ㄱ", "ㅓ"]);
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
  assert.equal(VALID_JAMO.has("A"), false);
});
