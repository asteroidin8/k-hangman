export function createModalUI(el) {
  function formatWinRate(stats) {
    const total = stats.alive + stats.dead;
    if (!total) return "0%";
    return `${Math.round((stats.alive / total) * 100)}%`;
  }

  function formatAverageAttempts(stats) {
    if (!stats.alive) return "-";
    return (stats.totalAttempts / stats.alive).toFixed(1);
  }

  function update({ stats, puzzleNumber, statusTitle, squares, attempts }) {
    el.modalTitle.textContent = statusTitle;
    el.aliveCount.textContent = String(stats.alive);
    el.deadCount.textContent = String(stats.dead);
    el.winRate.textContent = formatWinRate(stats);
    el.averageAttempts.textContent = formatAverageAttempts(stats);
    el.bestAttempts.textContent = stats.bestAttempts === null ? "-" : String(stats.bestAttempts);
    el.currentStreak.textContent = String(stats.currentStreak);
    el.sharePuzzle.textContent = `한글 행맨 #${puzzleNumber}`;
    el.shareStatus.textContent = `[ ${statusTitle} ]`;
    el.shareSquares.textContent = squares;
    el.shareAttempts.textContent = `시도 ${attempts}`;
  }

  function setShareVisible(visible) {
    el.shareCard.classList.toggle("hidden", !visible);
    el.copyBtn.classList.toggle("hidden", !visible);
    el.shareModalBtn.classList.toggle("hidden", !visible);
  }

  function setHowToPlayVisible(visible) {
    el.howToPlay.classList.toggle("hidden", !visible);
  }

  function setStatsVisible(visible) {
    el.statsModal.querySelector(".stats").classList.toggle("hidden", !visible);
  }

  function open() {
    setStatsVisible(true);
    setHowToPlayVisible(false);
    setShareVisible(true);
    el.toolbar.classList.add("hidden");
    el.statsModal.classList.remove("hidden");
    el.statsModal.setAttribute("aria-hidden", "false");
  }

  function openStats() {
    el.modalTitle.textContent = "통계";
    setStatsVisible(true);
    setHowToPlayVisible(false);
    setShareVisible(false);
    el.toolbar.classList.add("hidden");
    el.statsModal.classList.remove("hidden");
    el.statsModal.setAttribute("aria-hidden", "false");
  }

  function openHowToPlay() {
    el.modalTitle.textContent = "도움말";
    setStatsVisible(false);
    setHowToPlayVisible(true);
    setShareVisible(false);
    el.toolbar.classList.add("hidden");
    el.statsModal.classList.remove("hidden");
    el.statsModal.setAttribute("aria-hidden", "false");
  }

  function close() {
    el.statsModal.classList.add("hidden");
    el.statsModal.setAttribute("aria-hidden", "true");
    el.toolbar.classList.remove("hidden");
  }

  function setCopyButtonCopied(copied) {
    el.copyBtn.classList.toggle("is-active", copied);
    el.copyBtn.textContent = copied ? "복사됨" : "복사";
  }

  return {
    update,
    open,
    openStats,
    openHowToPlay,
    close,
    setCopyButtonCopied
  };
}
