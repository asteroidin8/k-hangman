export function createSettingsUI(el) {
  function setVisible(visible) {
    el.settingsModal.classList.toggle("hidden", !visible);
    el.settingsModal.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  function sync(showWrongJamo, showWordMeaning) {
    el.wrongJamoToggle.checked = showWrongJamo;
    el.wordMeaningToggle.checked = showWordMeaning;
  }

  return {
    setVisible,
    sync
  };
}
