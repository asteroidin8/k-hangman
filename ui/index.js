import { createBoardUI } from "./board.js";
import { getDOM } from "./dom.js";
import { createMessageUI } from "./message.js";
import { createModalUI } from "./modal.js";
import { createSettingsUI } from "./settings.js";

export function createUI() {
  const el = getDOM();
  const messageUI = createMessageUI(el);
  const boardUI = createBoardUI(el);
  const modalUI = createModalUI(el);
  const settingsUI = createSettingsUI(el);

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
      setRestMode: boardUI.setRestMode,
      updateModal: modalUI.update,
      openModal: modalUI.open,
      openStatsModal: modalUI.openStats,
      closeModal: modalUI.close,
      setCopyButtonCopied: modalUI.setCopyButtonCopied,
    },
  };
}
