import assert from "node:assert/strict";
import test from "node:test";

import { createMessageUI } from "../ui/message.js";

function createElementStub(initialHidden = false) {
  const classes = new Set(initialHidden ? ["hidden"] : []);

  return {
    textContent: "",
    classList: {
      add(name) {
        classes.add(name);
      },
      remove(name) {
        classes.delete(name);
      },
      contains(name) {
        return classes.has(name);
      },
    },
  };
}

test("단어 뜻을 큰따옴표로 감싸서 표시한다", () => {
  const el = {
    message: createElementStub(true),
    messageText: createElementStub(),
    wordMeaningText: createElementStub(),
  };
  const messageUI = createMessageUI(el);

  messageUI.syncMeaning("뜻풀이", true);

  assert.equal(el.wordMeaningText.textContent, "\"뜻풀이\"");
});
