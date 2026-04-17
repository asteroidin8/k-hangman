export function createSettingsUI(el) {
  function setVisible(visible) {
    el.settingsPanel.classList.toggle("hidden", !visible);
  }

  function sync(showWrongJamo) {
    el.wrongJamoToggle.checked = showWrongJamo;
  }

  return {
    setVisible,
    sync
  };
}