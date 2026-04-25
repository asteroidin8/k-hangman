import test from "node:test";
import assert from "node:assert/strict";

import { STORAGE_PROGRESS, STORAGE_SETTINGS, STORAGE_STATS } from "../core/config.js";
import { createState } from "../core/state.js";

function installLocalStorage(initial = {}) {
  const store = new Map(Object.entries(initial));

  globalThis.localStorage = {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    }
  };

  return store;
}

test("createState creates fresh progress for a new day", () => {
  const store = installLocalStorage();
  const state = createState("2026-04-25", 115);

  assert.deepEqual(state.progress, {
    date: "2026-04-25",
    puzzleNumber: 115,
    guessedCorrect: [],
    guessedWrong: [],
    guessedAll: [],
    wrongCount: 0,
    hintUsed: false,
    bonusHintUsed: false,
    status: "playing",
    attempts: 0
  });

  assert.deepEqual(JSON.parse(store.get(STORAGE_PROGRESS)), state.progress);
});

test("createState keeps saved progress for the same day", () => {
  const savedProgress = {
    date: "2026-04-25",
    puzzleNumber: 115,
    guessedCorrect: ["ㅎ"],
    guessedWrong: ["ㄱ"],
    guessedAll: ["ㅎ", "ㄱ"],
    wrongCount: 1,
    hintUsed: true,
    bonusHintUsed: false,
    status: "playing",
    attempts: 2
  };

  installLocalStorage({
    [STORAGE_PROGRESS]: JSON.stringify(savedProgress)
  });

  const state = createState("2026-04-25", 115);

  assert.deepEqual(state.progress, savedProgress);
});

test("createState migrates missing settings and bonus hint fields", () => {
  const savedProgress = {
    date: "2026-04-25",
    puzzleNumber: 115,
    guessedCorrect: [],
    guessedWrong: [],
    guessedAll: [],
    wrongCount: 0,
    hintUsed: false,
    status: "playing",
    attempts: 0
  };

  const store = installLocalStorage({
    [STORAGE_PROGRESS]: JSON.stringify(savedProgress),
    [STORAGE_SETTINGS]: JSON.stringify({ showWrongJamo: true }),
    [STORAGE_STATS]: JSON.stringify({ alive: 1, dead: 2, lastFinishedDate: "2026-04-24" })
  });

  const state = createState("2026-04-25", 115);

  assert.equal(state.progress.bonusHintUsed, false);
  assert.deepEqual(state.settings, {
    showWrongJamo: true,
    showWordMeaning: false
  });
  assert.equal(JSON.parse(store.get(STORAGE_PROGRESS)).bonusHintUsed, false);
  assert.equal(JSON.parse(store.get(STORAGE_SETTINGS)).showWordMeaning, false);
});
