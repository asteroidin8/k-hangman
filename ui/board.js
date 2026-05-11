import { CHO, JONG, JUNG, KEYBOARD_JAMO_ROWS } from "../core/utils.js";

const CONSONANT_ORDER = [...new Set([...CHO, ...JONG.filter(Boolean)])];
const HANGMAN_PART_IDS = [
  "part-head",
  "part-body",
  "part-arm-left",
  "part-arm-right",
  "part-leg-left",
  "part-leg-right"
];
const DEAD_FACE_IDS = [
  "dead-eye-l1",
  "dead-eye-l2",
  "dead-eye-r1",
  "dead-eye-r2",
  "dead-mouth"
];

function getExistingElements(ids) {
  return ids.map((id) => document.getElementById(id)).filter(Boolean);
}

export function createBoardUI(el) {
  let parts = [];
  let deadFace = [];

  function renderWrongJamoValues(values = "") {
    return `<span class="wrong-jamo-values">${values}</span>`;
  }

  function sortJamoBy(order, guessedWrong) {
    return guessedWrong
      .filter((jamo) => order.includes(jamo))
      .sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }

  function createJamoButton(jamo, invalidChar, isEnded) {
    const button = document.createElement("button");
    button.className = "jamo-key";
    button.type = "button";
    button.dataset.jamo = jamo;
    button.textContent = jamo;
    button.disabled = isEnded;
    button.classList.toggle("is-invalid", invalidChar === jamo);
    return button;
  }

  function bindInjectedParts() {
    parts = getExistingElements(HANGMAN_PART_IDS);
    deadFace = getExistingElements(DEAD_FACE_IDS);
  }

  function renderJamoKeyboard({ invalidChar, isEnded }) {
    el.jamoKeyboard.innerHTML = "";

    KEYBOARD_JAMO_ROWS.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = "jamo-key-row";

      row.forEach((jamo) => {
        rowEl.appendChild(createJamoButton(jamo, invalidChar, isEnded));
      });

      el.jamoKeyboard.appendChild(rowEl);
    });
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
      el.wrongJamoList.innerHTML = `${renderWrongJamoValues()}${renderWrongJamoValues()}`;
      return;
    }

    if (guessedWrong.length === 0) {
      el.wrongJamoList.innerHTML = `${renderWrongJamoValues()}${renderWrongJamoValues()}`;
      return;
    }

    const consonants = sortJamoBy(CONSONANT_ORDER, guessedWrong);
    const vowels = sortJamoBy(JUNG, guessedWrong);

    el.wrongJamoList.innerHTML = [
      renderWrongJamoValues(consonants.join(" ")),
      renderWrongJamoValues(vowels.join(" "))
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
