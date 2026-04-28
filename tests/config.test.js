import test from "node:test";
import assert from "node:assert/strict";

import { pickText } from "../core/config.js";

test("pickText returns plain text as-is", () => {
  assert.equal(pickText("자모만"), "자모만");
});

test("pickText returns one item from a text list", () => {
  const candidates = ["있다", "맞았다", "좋아"];
  assert.equal(candidates.includes(pickText(candidates)), true);
});
