export function createSettingsUI(el) {
  function setVisible(visible) {
    el.settingsModal.classList.toggle("hidden", !visible);
    el.settingsModal.setAttribute("aria-hidden", visible ? "false" : "true");
  }

  function sync(showWrongJamo) {
    el.wrongJamoToggle.checked = showWrongJamo;
  }

  return {
    setVisible,
    sync
  };
}
