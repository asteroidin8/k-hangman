import { createBoardUI } from "./board.js";
import { getDOM } from "./dom.js";
import { createMessageUI } from "./message.js";
import { createModalUI } from "./modal.js";
import { createSettingsUI } from "./settings.js";
import { createSoundUI } from "./sound.js";

export function createUI() {
  const el = getDOM();
  const messageUI = createMessageUI(el);
  const boardUI = createBoardUI(el);
  const modalUI = createModalUI(el);
  const settingsUI = createSettingsUI(el);
  const soundUI = createSoundUI();

  return {
    el,
    boardUI,
    settingsUI,
    ui: {
      el,
      bindInjectedParts: boardUI.bindInjectedParts,
      showMessage: messageUI.show,
      hideMessage: messageUI.hide,
      syncMeaning: messageUI.syncMeaning,
      renderJamoKeyboard: boardUI.renderJamoKeyboard,
      shakeKeyboard: boardUI.shakeKeyboard,
      renderAnswerSlots: boardUI.renderAnswerSlots,
      renderWrongJamo: boardUI.renderWrongJamo,
      renderHangman: boardUI.renderHangman,
      playMarkerDraw: soundUI.playMarkerDraw,
      setRestMode: boardUI.setRestMode,
      updateModal: modalUI.update,
      openModal: modalUI.open,
      openStatsModal: modalUI.openStats,
      openHowToPlayModal: modalUI.openHowToPlay,
      closeModal: modalUI.close,
      setCopyButtonCopied: modalUI.setCopyButtonCopied,
    },
  };
}
