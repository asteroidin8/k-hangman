export function createMessageUI(el) {
  let timer = null;

  function show(text, autoHide = true) {
    clearTimeout(timer);
    el.messageText.textContent = text;
    el.message.classList.remove("hidden");

    if (autoHide) {
      timer = window.setTimeout(() => {
        el.message.classList.add("hidden");
      }, 1200);
    }
  }

  function hide() {
    clearTimeout(timer);
    el.message.classList.add("hidden");
  }

  return { show, hide };
}