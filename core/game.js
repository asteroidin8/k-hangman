import { MAX_WRONG, TEXT } from "./config.js";

export function createGame(state, ui, answerJamo, answerMeaning) {
  let typedChar = "";
  let liveDisplayChar = "";
  let invalidChar = "";
  let invalidTimer = null;
  let gameOverLocked = false;

  function resetTypedState() {
    typedChar = "";
    liveDisplayChar = "";
  }

  function setTypedState(nextChar) {
    typedChar = nextChar;
    liveDisplayChar = nextChar;
    invalidChar = "";
  }

  function getStatusTitle() {
    return state.progress.status === "won" ? TEXT.aliveTitle : TEXT.deadTitle;
  }

  function isPlaying() {
    return state.progress.status === "playing" && !gameOverLocked;
  }

  function isSolved() {
    return answerJamo.every((jamo) => state.progress.guessedCorrect.includes(jamo));
  }

  function buildProgressSquares() {
    return answerJamo
      .map((jamo) => (state.progress.guessedCorrect.includes(jamo) ? "■" : "□"))
      .join("");
  }

  function buildShareText() {
    return [
      `[ ${getStatusTitle()} ]`,
      "",
      buildProgressSquares(),
      "",
      `시도 ${state.progress.attempts}`,
      "",
      window.location.href
    ].join("\n");
  }

  function getModalData() {
    return {
      stats: state.stats,
      statusTitle: getStatusTitle(),
      squares: buildProgressSquares(),
      attempts: state.progress.attempts
    };
  }

  function syncAdState() {
    const isIdle = state.progress.status === "playing" && state.progress.wrongCount === 0;
    ui.setRestMode(TEXT.adBusy, isIdle);
  }

  function syncInputUI() {
    ui.renderInputSlot({
      liveDisplayChar,
      invalidChar,
      isEnded: !isPlaying()
    });
  }

  function syncUI() {
    ui.renderAnswerSlots(answerJamo, state.progress.guessedCorrect);
    ui.renderWrongJamo(state.settings.showWrongJamo, state.progress.guessedWrong);
    ui.renderHangman(state.progress.wrongCount, state.progress.status === "lost");
    ui.syncMeaning(answerMeaning, state.settings.showWordMeaning);
    syncInputUI();
    syncAdState();
  }

  function saveAndSync() {
    state.saveProgress();
    syncUI();
  }

  function updateStatsOnce(finalStatus) {
    if (state.stats.lastFinishedDate === state.progress.date) return;

    if (finalStatus === "won") state.stats.alive += 1;
    if (finalStatus === "lost") state.stats.dead += 1;

    state.stats.lastFinishedDate = state.progress.date;
    state.saveStats();
  }

  function openResultModal() {
    ui.updateModal(getModalData());
    ui.setCopyButtonCopied(false);
    ui.openModal();
  }

  function solveWithJamo(jamo) {
    if (!state.progress.guessedCorrect.includes(jamo)) {
      state.progress.guessedCorrect.push(jamo);
    }
  }

  function getHintCandidates() {
    return answerJamo.filter((jamo) => !state.progress.guessedCorrect.includes(jamo));
  }

  function revealRandomHintJamo() {
    const candidates = getHintCandidates();
    if (!candidates.length) return false;

    const hintJamo = candidates[Math.floor(Math.random() * candidates.length)];
    state.progress.guessedAll.push(hintJamo);
    solveWithJamo(hintJamo);
    return true;
  }

  function beginGameOverFlow(finalStatus) {
    if (gameOverLocked) return;
    gameOverLocked = true;

    window.setTimeout(() => {
      state.progress.status = finalStatus;
      saveAndSync();
      ui.showMessage(finalStatus === "won" ? TEXT.win : TEXT.lose);

      updateStatsOnce(finalStatus);

      window.setTimeout(() => {
        openResultModal();
      }, 600);
    }, 300);
  }

  function handleCorrect(jamo, isHint = false) {
    solveWithJamo(jamo);

    if (!isHint) {
      ui.showMessage(TEXT.hit);
    }

    if (isSolved()) {
      beginGameOverFlow("won");
    }
  }

  function handleWrong(isRepeatedWrong = false) {
    state.progress.wrongCount += 1;

    if (!isRepeatedWrong) {
      ui.showMessage(TEXT.miss);
    }

    syncUI();

    if (state.progress.wrongCount >= MAX_WRONG) {
      beginGameOverFlow("lost");
    }
  }

  function submitGuess(inputEl) {
    if (!isPlaying() || !typedChar) return;

    const jamo = typedChar;
    resetTypedState();
    inputEl.value = "";
    state.progress.attempts += 1;

    if (state.progress.guessedCorrect.includes(jamo)) {
      ui.showMessage(TEXT.duplicateCorrect);
      saveAndSync();
      return;
    }

    if (state.progress.guessedWrong.includes(jamo)) {
      ui.showMessage(TEXT.duplicateWrong);
      handleWrong(true);
      state.saveProgress();
      return;
    }

    state.progress.guessedAll.push(jamo);

    if (answerJamo.includes(jamo)) {
      handleCorrect(jamo);
    } else {
      state.progress.guessedWrong.push(jamo);
      handleWrong(false);
    }

    saveAndSync();
  }

  function useHint() {
    if (state.progress.status !== "playing") return;
    if (state.progress.hintUsed) {
      ui.showMessage(TEXT.hintBlocked);
      return;
    }

    const revealed = revealRandomHintJamo();
    if (!revealed) return;

    state.progress.hintUsed = true;
    saveAndSync();
    ui.showMessage(TEXT.hint);

    if (isSolved()) {
      beginGameOverFlow("won");
    }
  }

  function useBonusHint() {
    if (state.progress.status !== "playing") return;
    if (!state.progress.hintUsed) return;
    if (state.progress.bonusHintUsed) return;

    const revealed = revealRandomHintJamo();
    if (!revealed) return;

    state.progress.bonusHintUsed = true;
    saveAndSync();
    ui.showMessage(TEXT.bonusHint);

    if (isSolved()) {
      beginGameOverFlow("won");
    }
  }

  function clearInput(inputEl) {
    resetTypedState();
    invalidChar = "";
    inputEl.value = "";
    syncInputUI();
  }

  function clearInvalidFeedbackLater() {
    clearTimeout(invalidTimer);
    invalidTimer = window.setTimeout(() => {
      invalidChar = "";
      syncInputUI();
    }, 420);
  }

  function triggerInvalidFeedback(char, inputSlotEl, inputEl) {
    resetTypedState();
    invalidChar = char || "?";
    inputEl.value = "";
    ui.showMessage(TEXT.invalid);
    syncInputUI();

    inputSlotEl.classList.remove("shake");
    requestAnimationFrame(() => {
      inputSlotEl.classList.add("shake");
    });

    clearInvalidFeedbackLater();
  }

  function acceptLastChar(value, inputSlotEl, inputEl, validJamo) {
    const chars = Array.from(value);

    if (!chars.length) {
      typedChar = "";
      liveDisplayChar = "";
      syncInputUI();
      return;
    }

    const last = chars[chars.length - 1];

    if (validJamo.has(last)) {
      setTypedState(last);
      inputEl.value = last;
      syncInputUI();
      return;
    }

    triggerInvalidFeedback(last, inputSlotEl, inputEl);
  }

  function handleCompositionEnd(value, inputSlotEl, inputEl, validJamo) {
    const chars = Array.from(value.trim());

    if (!chars.length) {
      clearInput(inputEl);
      return;
    }

    const last = chars[chars.length - 1];

    if (validJamo.has(last)) {
      setTypedState(last);
      inputEl.value = last;
      syncInputUI();
      return;
    }

    triggerInvalidFeedback(last, inputSlotEl, inputEl);
  }

  function setSettingVisibility(key, value) {
    state.settings[key] = value;
    state.saveSettings();
    syncUI();
  }

  return {
    syncUI,
    buildShareText,
    getModalData,
    submitGuess,
    useHint,
    useBonusHint,
    acceptLastChar,
    handleCompositionEnd,
    setWrongJamoVisible(value) {
      setSettingVisibility("showWrongJamo", value);
    },
    setWordMeaningVisible(value) {
      setSettingVisibility("showWordMeaning", value);
    }
  };
}
