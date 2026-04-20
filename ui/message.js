export function createMessageUI(el) {
  let timer = null;
  let meaningText = "";
  let meaningEnabled = false;
  let meaningSuppressed = false;

  function syncMeaningVisibility() {
    const shouldShow =
      meaningEnabled &&
      !meaningSuppressed &&
      Boolean(meaningText) &&
      el.message.classList.contains("hidden");

    el.wordMeaningText.textContent = meaningText;
    el.wordMeaning.classList.toggle("hidden", !shouldShow);
  }

  function show(text, autoHide = true) {
    clearTimeout(timer);
    meaningSuppressed = true;
    el.messageText.textContent = text;
    el.message.classList.remove("hidden");
    syncMeaningVisibility();

    if (autoHide) {
      timer = window.setTimeout(() => {
        el.message.classList.add("hidden");
        meaningSuppressed = false;
        syncMeaningVisibility();
      }, 1200);
    }
  }

  function hide() {
    clearTimeout(timer);
    el.message.classList.add("hidden");
    meaningSuppressed = false;
    syncMeaningVisibility();
  }

  function syncMeaning(text, visible) {
    meaningText = text;
    meaningEnabled = visible;
    syncMeaningVisibility();
  }

  return { show, hide, syncMeaning };
}
