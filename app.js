import { WORDS } from "./core/words.js";
import { BASE_DATE, TEXT } from "./core/config.js";
import { VALID_JAMO, getTodayString } from "./core/utils.js";
import { createDailyPuzzle } from "./core/puzzle.js";
import { createState } from "./core/state.js";
import { loadGameSVGs } from "./core/svg-loader.js";
import { createGame } from "./core/game.js";
import { createSharing } from "./core/sharing.js";
import { createUI } from "./ui/index.js";

const BONUS_HINT_CLICK_TARGET = 3;
const BONUS_HINT_WINDOW_MS = 900;

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

function isBackdropClick(event, backdrop) {
  return event.target === backdrop;
}

function bindClick(node, handler) {
  node.addEventListener("click", handler);
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
  } else if (hintRapidClickCount === BONUS_HINT_CLICK_TARGET) {
    game.useBonusHint();
    resetHintRapidClicks();
    return;
  } else {
    game.useHint();
  }

  clearTimeout(hintRapidClickTimer);
  hintRapidClickTimer = window.setTimeout(() => {
    resetHintRapidClicks();
  }, BONUS_HINT_WINDOW_MS);
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

function handlePhysicalKeyboard(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (event.target instanceof HTMLElement && event.target.closest("button")) return;

  if (!VALID_JAMO.has(event.key)) return;

  event.preventDefault();
  handleJamoGuess(event.key);
}

function bindEvents() {
  settingsUI.sync(state.settings.showWrongJamo, state.settings.showWordMeaning);

  bindClick(el.helpBtn, () => {
    closeSettings();
    ui.showMessage(TEXT.help);
  });

  bindClick(el.hintBtn, handleHintClick);

  bindClick(el.shareBtn, async () => {
    closeSettings();
    await sharing.shareNative();
  });

  bindClick(el.settingsBtn, () => {
    ui.hideMessage();
    settingsUI.setVisible(true);
  });

  el.wrongJamoToggle.addEventListener("change", (event) => {
    game.setWrongJamoVisible(event.target.checked);
  });

  el.wordMeaningToggle.addEventListener("change", (event) => {
    game.setWordMeaningVisible(event.target.checked);
  });

  bindClick(el.closeSettingsBtn, closeSettings);

  el.settingsModal.addEventListener("click", (event) => {
    if (isBackdropClick(event, el.settingsModal)) {
      closeSettings();
    }
  });

  bindClick(el.copyBtn, async () => {
    await sharing.copy();
  });

  bindClick(el.shareModalBtn, async () => {
    await sharing.shareNative();
  });

  bindClick(el.closeModalBtn, () => {
    ui.closeModal();
  });

  el.statsModal.addEventListener("click", (event) => {
    if (isBackdropClick(event, el.statsModal)) {
      ui.closeModal();
    }
  });

  el.jamoKeyboard.addEventListener("click", (event) => {
    const target = event.target instanceof HTMLElement ? event.target : null;
    const key = target?.closest(".jamo-key");

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
