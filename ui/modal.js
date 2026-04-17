export function createModalUI(el) {
  function update({ stats, statusTitle, squares, attempts }) {
    el.modalTitle.textContent = statusTitle;
    el.aliveCount.textContent = String(stats.alive);
    el.deadCount.textContent = String(stats.dead);
    el.shareStatus.textContent = `[ ${statusTitle} ]`;
    el.shareSquares.textContent = squares;
    el.shareAttempts.textContent = `시도 ${attempts}`;
  }

  function open() {
    el.toolbar.classList.add("hidden");
    el.board.classList.add("hidden");
    el.statsModal.classList.remove("hidden");
    el.statsModal.setAttribute("aria-hidden", "false");
  }

  function close() {
    el.statsModal.classList.add("hidden");
    el.statsModal.setAttribute("aria-hidden", "true");
    el.toolbar.classList.remove("hidden");
    el.board.classList.remove("hidden");
  }

  function setCopyButtonCopied(copied) {
    el.copyBtn.classList.toggle("is-active", copied);
    el.copyBtn.textContent = copied ? "복사됨" : "복사";
  }

  return {
    update,
    open,
    close,
    setCopyButtonCopied
  };
}