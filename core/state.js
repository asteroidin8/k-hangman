import { STORAGE_PROGRESS, STORAGE_SETTINGS, STORAGE_STATS } from "./config.js";
import { loadJSON, saveJSON } from "./storage.js";

function createDefaultStats() {
  return {
    alive: 0,
    dead: 0,
    lastFinishedDate: null,
    totalAttempts: 0,
    bestAttempts: null,
    currentStreak: 0,
    maxStreak: 0
  };
}

function migrateStats(stats) {
  const defaults = createDefaultStats();
  let changed = false;

  for (const [key, value] of Object.entries(defaults)) {
    if (!(key in stats)) {
      stats[key] = value;
      changed = true;
    }
  }

  return changed;
}

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
  const stats = loadJSON(STORAGE_STATS, createDefaultStats());

  const settings = loadJSON(STORAGE_SETTINGS, {
    showWrongJamo: false,
    showWordMeaning: false
  });

  let progress = loadJSON(STORAGE_PROGRESS, null);

  if (!progress || progress.date !== today) {
    progress = createDefaultProgress(today, puzzleNumber);
    saveJSON(STORAGE_PROGRESS, progress);
  } else if (typeof progress.bonusHintUsed !== "boolean") {
    progress.bonusHintUsed = false;
    saveJSON(STORAGE_PROGRESS, progress);
  }

  if (typeof settings.showWordMeaning !== "boolean") {
    settings.showWordMeaning = false;
    saveJSON(STORAGE_SETTINGS, settings);
  }

  if (migrateStats(stats)) {
    saveJSON(STORAGE_STATS, stats);
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
