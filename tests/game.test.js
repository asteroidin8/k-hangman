import test from "node:test";
import assert from "node:assert/strict";

import { createGame } from "../core/game.js";

function installBrowserGlobals() {
  globalThis.window = {
    location: { href: "http://localhost/" },
    setTimeout(callback) {
      callback();
      return 1;
    }
  };
  globalThis.requestAnimationFrame = (callback) => callback();
  globalThis.clearTimeout = () => {};
}

function createHarness(answerJamo = ["ㅎ", "ㅐ", "ㅇ"]) {
  installBrowserGlobals();

  const calls = {
    messages: [],
    modalOpened: 0,
    progressSaved: 0,
    statsSaved: 0,
    keyboardRenders: []
  };

  const state = {
    progress: {
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
    },
    stats: {
      alive: 0,
      dead: 0,
      lastFinishedDate: null,
      totalAttempts: 0,
      bestAttempts: null,
      currentStreak: 0,
      maxStreak: 0
    },
    settings: {
      showWrongJamo: false,
      showWordMeaning: false
    },
    saveProgress() {
      calls.progressSaved += 1;
    },
    saveStats() {
      calls.statsSaved += 1;
    },
    saveSettings() {}
  };

  const ui = {
    renderAnswerSlots() {},
    renderWrongJamo() {},
    renderHangman() {},
    syncMeaning() {},
    renderJamoKeyboard(data) {
      calls.keyboardRenders.push(data);
    },
    shakeKeyboard() {
      calls.keyboardShaken = true;
    },
    setRestMode() {},
    showMessage(message) {
      calls.messages.push(message);
    },
    updateModal(data) {
      calls.modalData = data;
    },
    setCopyButtonCopied() {},
    openModal() {
      calls.modalOpened += 1;
    }
  };

  const game = createGame(state, ui, answerJamo, "생활에서 충분한 만족과 기쁨을 느끼는 상태");

  return { calls, game, state };
}

test("guessJamo records a correct jamo immediately and wins when solved", () => {
  const { calls, game, state } = createHarness(["ㅎ"]);

  game.guessJamo("ㅎ", new Set(["ㅎ"]));

  assert.equal(state.progress.attempts, 1);
  assert.deepEqual(state.progress.guessedCorrect, ["ㅎ"]);
  assert.equal(state.progress.status, "won");
  assert.equal(state.stats.alive, 1);
  assert.equal(state.stats.dead, 0);
  assert.equal(state.stats.totalAttempts, 1);
  assert.equal(state.stats.bestAttempts, 1);
  assert.equal(state.stats.currentStreak, 1);
  assert.equal(state.stats.maxStreak, 1);
  assert.equal(calls.modalOpened, 1);
});

test("guessJamo records a wrong jamo immediately and loses after max wrong guesses", () => {
  const { calls, game, state } = createHarness(["ㅎ"]);
  const validJamo = new Set(["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"]);

  for (const jamo of validJamo) {
    game.guessJamo(jamo, validJamo);
  }

  assert.equal(state.progress.attempts, 6);
  assert.deepEqual(state.progress.guessedWrong, ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ", "ㅂ"]);
  assert.equal(state.progress.wrongCount, 6);
  assert.equal(state.progress.status, "lost");
  assert.equal(state.stats.alive, 0);
  assert.equal(state.stats.dead, 1);
  assert.equal(state.stats.totalAttempts, 0);
  assert.equal(state.stats.currentStreak, 0);
  assert.equal(calls.modalOpened, 1);
});

test("duplicate wrong guesses count as another wrong attempt", () => {
  const { game, state } = createHarness(["ㅎ"]);
  const validJamo = new Set(["ㄱ"]);

  game.guessJamo("ㄱ", validJamo);
  game.guessJamo("ㄱ", validJamo);

  assert.equal(state.progress.attempts, 2);
  assert.deepEqual(state.progress.guessedWrong, ["ㄱ"]);
  assert.equal(state.progress.wrongCount, 2);
});

test("invalid input renders invalid keyboard feedback", () => {
  const { calls, game } = createHarness(["ㅎ"]);

  game.guessJamo("A", new Set(["ㅎ"]));

  assert.equal(calls.keyboardRenders.some((data) => data.invalidChar === "A"), true);
  assert.equal(calls.keyboardShaken, true);
});

test("buildShareText includes status, progress, attempts, and URL", () => {
  const { game, state } = createHarness(["ㅎ", "ㅐ"]);

  state.progress.guessedCorrect.push("ㅎ");
  state.progress.attempts = 3;

  assert.equal(game.buildShareText(), "한글 행맨 #115\n\n[ 죽었다 ]\n\n■□\n\n시도 3\n\nhttp://localhost/");
});
