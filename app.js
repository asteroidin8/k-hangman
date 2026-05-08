import { WORDS } from "./core/words.js";
import { BASE_DATE, TEXT } from "./core/config.js";
import { VALID_JAMO, getTodayString } from "./core/utils.js";
import { createDailyPuzzle } from "./core/puzzle.js";
import { createState } from "./core/state.js";
import { loadGameSVGs } from "./core/svg-loader.js";
import { createGame } from "./core/game.js";
import { createSharing } from "./core/sharing.js";
import { createUI } from "./ui/index.js";

const { el, settingsUI, ui } = createUI();

const { today, puzzleNumber, answerMeaning, answerJamo } = createDailyPuzzle(
  WORDS,
  BASE_DATE,
  getTodayString()
);

const state = createState(today, puzzleNumber);
const game = createGame(state, ui, answerJamo, answerMeaning);
const sharing = createSharing(ui, game);

let hintRapidClickCount = 0;
let hintRapidClickTimer = null;

function closeSettings() {
  settingsUI.setVisible(false);
}

function resetHintRapidClicks() {
  hintRapidClickCount = 0;
  clearTimeout(hintRapidClickTimer);
  hintRapidClickTimer = null;
}

function handleHintClick() {
  closeSettings();

  if (!state.progress.hintUsed) {
    resetHintRapidClicks();
    game.useHint();
    return;
  }

  if (state.progress.bonusHintUsed) {
    game.useHint();
    return;
  }

  hintRapidClickCount += 1;

  if (hintRapidClickCount === 1) {
    game.useHint();
  } else if (hintRapidClickCount === 3) {
    game.useBonusHint();
    resetHintRapidClicks();
    return;
  } else {
    game.useHint();
  }

  clearTimeout(hintRapidClickTimer);
  hintRapidClickTimer = window.setTimeout(() => {
    resetHintRapidClicks();
  }, 900);
}

function handleDocumentClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  if (
    target.closest(".message") ||
    target.closest(".icon-btn") ||
    target.closest(".jamo-keyboard") ||
    target.closest(".modal") ||
    target.closest(".settings-modal")
  ) {
    return;
  }

  ui.hideMessage();
}

function handleJamoGuess(jamo) {
  closeSettings();
  game.guessJamo(jamo, VALID_JAMO);
}

function submitJamoGuess() {
  closeSettings();
  game.submitGuess();
}

function deleteJamoGuess() {
  closeSettings();
  game.deleteTypedJamo();
}

function handlePhysicalKeyboard(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target instanceof HTMLElement && event.target.closest("button")) return;

  if (event.key === "Enter") {
    event.preventDefault();
    submitJamoGuess();
    return;
  }

  if (event.key === "Backspace" || event.key === "Delete") {
    event.preventDefault();
    deleteJamoGuess();
    return;
  }

  if (!VALID_JAMO.has(event.key)) return;

  event.preventDefault();
  handleJamoGuess(event.key);
}

function bindEvents() {
  settingsUI.sync(state.settings.showWrongJamo, state.settings.showWordMeaning);

  el.helpBtn.addEventListener("click", () => {
    closeSettings();
    ui.showMessage(TEXT.help);
  });

  el.hintBtn.addEventListener("click", handleHintClick);

  el.shareBtn.addEventListener("click", async () => {
    closeSettings();
    await sharing.shareNative();
  });

  el.settingsBtn.addEventListener("click", () => {
    ui.hideMessage();
    settingsUI.setVisible(true);
  });

  el.wrongJamoToggle.addEventListener("change", (event) => {
    game.setWrongJamoVisible(event.target.checked);
  });

  el.wordMeaningToggle.addEventListener("change", (event) => {
    game.setWordMeaningVisible(event.target.checked);
  });

  el.closeSettingsBtn.addEventListener("click", closeSettings);

  el.settingsModal.addEventListener("click", (event) => {
    if (event.target === el.settingsModal) {
      closeSettings();
    }
  });

  el.copyBtn.addEventListener("click", async () => {
    await sharing.copy();
  });

  el.shareModalBtn.addEventListener("click", async () => {
    await sharing.shareNative();
  });

  el.closeModalBtn.addEventListener("click", () => {
    ui.closeModal();
  });

  el.statsModal.addEventListener("click", (event) => {
    if (event.target === el.statsModal) {
      ui.closeModal();
    }
  });

  el.jamoKeyboard.addEventListener("click", (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    const key = target?.closest(".jamo-key");
    const action = target?.closest(".jamo-action");

    if (action instanceof HTMLButtonElement && !action.disabled) {
      if (action.dataset.action === "submit") submitJamoGuess();
      if (action.dataset.action === "delete") deleteJamoGuess();
      return;
    }

    if (key instanceof HTMLButtonElement && !key.disabled) {
      handleJamoGuess(key.dataset.jamo || "");
    }
  });

  document.addEventListener("click", handleDocumentClick);
  document.addEventListener("keydown", handlePhysicalKeyboard);
}

async function init() {
  await loadGameSVGs(ui);
  game.syncUI();

  if (state.progress.status !== "playing") {
    ui.updateModal(game.getModalData());
    ui.setCopyButtonCopied(false);
    ui.openModal();
  }

  bindEvents();
}

init();
