import { CHO, JONG, JUNG, KEYBOARD_JAMO_ROWS } from "../core/utils.js";

const CONSONANT_ORDER = [...new Set([...CHO, ...JONG.filter(Boolean)])];

export function createBoardUI(el) {
  let parts = [];
  let deadFace = [];

  function renderWrongJamoGroup(label = "", values = "") {
    return `
      <div class="wrong-jamo-group">
        <span class="wrong-jamo-label">${label}</span>
        <span class="wrong-jamo-values">${values}</span>
      </div>
    `;
  }

  function bindInjectedParts() {
    parts = [
      document.getElementById("part-head"),
      document.getElementById("part-body"),
      document.getElementById("part-arm-left"),
      document.getElementById("part-arm-right"),
      document.getElementById("part-leg-left"),
      document.getElementById("part-leg-right")
    ].filter(Boolean);

    deadFace = [
      document.getElementById("dead-eye-l1"),
      document.getElementById("dead-eye-l2"),
      document.getElementById("dead-eye-r1"),
      document.getElementById("dead-eye-r2"),
      document.getElementById("dead-mouth")
    ].filter(Boolean);
  }

  function renderJamoKeyboard({ liveDisplayChar, invalidChar, isEnded }) {
    el.jamoKeyboard.innerHTML = "";

    KEYBOARD_JAMO_ROWS.forEach((row, rowIndex) => {
      const rowEl = document.createElement("div");
      rowEl.className = "jamo-key-row";
      rowEl.dataset.row = String(rowIndex + 1);

      if (rowIndex === 2) {
        const deleteButton = document.createElement("button");
        deleteButton.className = "jamo-action jamo-action-delete";
        deleteButton.type = "button";
        deleteButton.dataset.action = "delete";
        deleteButton.textContent = "삭제";
        deleteButton.disabled = isEnded;
        rowEl.appendChild(deleteButton);
      }

      row.forEach((jamo, keyIndex) => {
        const button = document.createElement("button");
        button.className = "jamo-key";
        button.type = "button";
        button.dataset.jamo = jamo;
        button.dataset.row = String(rowIndex + 1);
        button.textContent = jamo;
        button.disabled = isEnded;
        button.classList.toggle("is-invalid", invalidChar === jamo);
        rowEl.appendChild(button);
      });

      if (rowIndex === 1) {
        const submitButton = document.createElement("button");
        submitButton.className = "jamo-action jamo-action-submit";
        submitButton.type = "button";
        submitButton.dataset.action = "submit";
        submitButton.textContent = "입력";
        submitButton.disabled = isEnded;
        rowEl.appendChild(submitButton);
      }

      el.jamoKeyboard.appendChild(rowEl);
    });

    const controlRow = document.createElement("div");
    controlRow.className = "jamo-control-row";
    controlRow.innerHTML = `
      <div class="selected-jamo" aria-live="polite">${invalidChar || liveDisplayChar || ""}</div>
    `;
    controlRow.querySelector(".selected-jamo").classList.toggle("is-invalid", Boolean(invalidChar));
    el.jamoKeyboard.appendChild(controlRow);
  }

  function shakeKeyboard() {
    el.jamoKeyboard.classList.remove("shake");
    requestAnimationFrame(() => {
      el.jamoKeyboard.classList.add("shake");
    });
  }

  function renderAnswerSlots(answerJamo, guessedCorrect) {
    el.answerSlots.innerHTML = "";

    answerJamo.forEach((jamo) => {
      const slot = document.createElement("div");
      slot.className = "answer-slot";

      if (guessedCorrect.includes(jamo)) {
        slot.textContent = jamo;
        slot.classList.add("filled");
      }

      el.answerSlots.appendChild(slot);
    });
  }

  function renderWrongJamo(show, guessedWrong) {
    if (!show) {
      el.wrongJamoList.innerHTML = `${renderWrongJamoGroup()}${renderWrongJamoGroup()}`;
      return;
    }

    if (guessedWrong.length === 0) {
      el.wrongJamoList.innerHTML = `${renderWrongJamoGroup("자")}${renderWrongJamoGroup("모")}`;
      return;
    }

    const consonants = guessedWrong
      .filter((jamo) => !JUNG.includes(jamo))
      .sort((a, b) => CONSONANT_ORDER.indexOf(a) - CONSONANT_ORDER.indexOf(b));
    const vowels = guessedWrong
      .filter((jamo) => JUNG.includes(jamo))
      .sort((a, b) => JUNG.indexOf(a) - JUNG.indexOf(b));

    el.wrongJamoList.innerHTML = [
      renderWrongJamoGroup("자", consonants.join(" ")),
      renderWrongJamoGroup("모", vowels.join(" "))
    ].join("");
  }

  function renderHangman(wrongCount, isDead) {
    parts.forEach((part, index) => {
      part.classList.toggle("on", index < wrongCount);
    });

    deadFace.forEach((node) => node.classList.toggle("on", isDead));
  }

  function setRestMode(label, visible) {
    el.adSign.textContent = label;

    if (visible) {
      el.restmanWrap.classList.remove("is-hidden");
      el.adSign.classList.add("is-hidden");
    } else {
      el.restmanWrap.classList.add("is-hidden");
      el.adSign.classList.remove("is-hidden");
    }
  }

  return {
    bindInjectedParts,
    renderJamoKeyboard,
    shakeKeyboard,
    renderAnswerSlots,
    renderWrongJamo,
    renderHangman,
    setRestMode
  };
}
