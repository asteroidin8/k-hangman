import { WORDS } from "./core/words.js";
import { BASE_DATE, TEXT } from "./core/config.js";
import { VALID_JAMO, getTodayString, daysFromBase, splitHangulWord } from "./core/utils.js";
import { createState } from "./core/state.js";
import { loadGameSVGs } from "./core/svg-loader.js";
import { createGame } from "./core/game.js";
import { createSharing } from "./core/sharing.js";

import { getDOM } from "./ui/dom.js";
import { createMessageUI } from "./ui/message.js";
import { createBoardUI } from "./ui/board.js";
import { createModalUI } from "./ui/modal.js";
import { createSettingsUI } from "./ui/settings.js";

const el = getDOM();
const messageUI = createMessageUI(el);
const boardUI = createBoardUI(el);
const modalUI = createModalUI(el);
const settingsUI = createSettingsUI(el);

const ui = {
  el,
  bindInjectedParts: boardUI.bindInjectedParts,
  showMessage: messageUI.show,
  hideMessage: messageUI.hide,
  syncMeaning: messageUI.syncMeaning,
  renderInputSlot: boardUI.renderInputSlot,
  renderAnswerSlots: boardUI.renderAnswerSlots,
  renderWrongJamo: boardUI.renderWrongJamo,
  renderHangman: boardUI.renderHangman,
  setRestMode: boardUI.setRestMode,
  updateModal: modalUI.update,
  openModal: modalUI.open,
  closeModal: modalUI.close,
  setCopyButtonCopied: modalUI.setCopyButtonCopied
};

const today = getTodayString();
const puzzleNumber = daysFromBase(BASE_DATE, today) + 1;
const answerEntry = WORDS[((puzzleNumber - 1) % WORDS.length + WORDS.length) % WORDS.length];
const answerWord = typeof answerEntry === "string" ? answerEntry : answerEntry.word;
const answerMeaning = typeof answerEntry === "string" ? "" : answerEntry.meaning;
const answerJamo = splitHangulWord(answerWord);

const state = createState(today, puzzleNumber);
const game = createGame(state, ui, answerJamo, answerMeaning);
const sharing = createSharing(ui, game);

let isComposing = false;
let hintRapidClickCount = 0;
let hintRapidClickTimer = null;

function renderInputPreview(liveDisplayChar = "") {
  boardUI.renderInputSlot({
    liveDisplayChar,
    invalidChar: "",
    isEnded: state.progress.status !== "playing"
  });
}

function focusInput() {
  if (state.progress.status !== "playing") return;
  el.jamoInput.focus();
}

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

function handleCompositionUpdate(event) {
  const value = event.data || el.jamoInput.value || "";
  const chars = Array.from(value);
  const liveDisplayChar = chars.length ? chars[chars.length - 1] : "";

  renderInputPreview(liveDisplayChar);
}

function handleDocumentClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) return;

  if (
    target.closest(".message") ||
    target.closest(".icon-btn") ||
    target.closest(".modal") ||
    target.closest(".settings-modal")
  ) {
    return;
  }

  ui.hideMessage();
}

function bindEvents() {
  settingsUI.sync(state.settings.showWrongJamo, state.settings.showWordMeaning);

  el.inputSlot.addEventListener("click", focusInput);

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

  el.jamoInput.addEventListener("focus", () => {
    el.inputSlot.classList.add("is-focused");
  });

  el.jamoInput.addEventListener("blur", () => {
    el.inputSlot.classList.remove("is-focused");
  });

  el.jamoInput.addEventListener("compositionstart", () => {
    isComposing = true;
  });

  el.jamoInput.addEventListener("compositionupdate", handleCompositionUpdate);

  el.jamoInput.addEventListener("compositionend", (event) => {
    isComposing = false;
    game.handleCompositionEnd(event.target.value, el.inputSlot, el.jamoInput, VALID_JAMO);
  });

  el.jamoInput.addEventListener("input", (event) => {
    if (state.progress.status !== "playing" || isComposing) return;
    game.acceptLastChar(event.target.value.trim(), el.inputSlot, el.jamoInput, VALID_JAMO);
  });

  el.jamoInput.addEventListener("keydown", (event) => {
    if (state.progress.status !== "playing") return;

    if (event.key === "Enter") {
      event.preventDefault();
      game.submitGuess(el.jamoInput);
      return;
    }

    if (event.key === "Backspace" && !isComposing) {
      renderInputPreview();
    }
  });

  document.addEventListener("click", handleDocumentClick);
  window.addEventListener("load", focusInput);
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
