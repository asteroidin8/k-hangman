import { STORAGE_PROGRESS, STORAGE_SETTINGS, STORAGE_STATS } from "./config.js";
import { loadJSON, saveJSON } from "./utils.js";

function createDefaultProgress(today, puzzleNumber) {
  return {
    date: today,
    puzzleNumber,
    guessedCorrect: [],
    guessedWrong: [],
    guessedAll: [],
    wrongCount: 0,
    hintUsed: false,
    bonusHintUsed: false,
    status: "playing",
    attempts: 0
  };
}

export function createState(today, puzzleNumber) {
  const stats = loadJSON(STORAGE_STATS, {
    alive: 0,
    dead: 0,
    lastFinishedDate: null
  });

  const settings = loadJSON(STORAGE_SETTINGS, {
    showWrongJamo: false
  });

  let progress = loadJSON(STORAGE_PROGRESS, null);

  if (!progress || progress.date !== today) {
    progress = createDefaultProgress(today, puzzleNumber);
    saveJSON(STORAGE_PROGRESS, progress);
  } else if (typeof progress.bonusHintUsed !== "boolean") {
    progress.bonusHintUsed = false;
    saveJSON(STORAGE_PROGRESS, progress);
  }

  return {
    progress,
    stats,
    settings,
    saveProgress() {
      saveJSON(STORAGE_PROGRESS, progress);
    },
    saveStats() {
      saveJSON(STORAGE_STATS, stats);
    },
    saveSettings() {
      saveJSON(STORAGE_SETTINGS, settings);
    }
  };
}