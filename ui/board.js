import { CHO, JONG, JUNG } from "../core/utils.js";

const CONSONANT_ORDER = [...new Set([...CHO, ...JONG.filter(Boolean)])];

export function createBoardUI(el) {
  let parts = [];
  let deadFace = [];

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

  function renderInputSlot({ liveDisplayChar, invalidChar, isEnded }) {
    el.inputSlot.classList.toggle("is-disabled", isEnded);
    el.jamoInput.disabled = isEnded;

    if (invalidChar) {
      el.inputDisplay.innerHTML = `<span class="typed invalid">${invalidChar}</span>`;
      return;
    }

    if (liveDisplayChar) {
      el.inputDisplay.innerHTML = `<span class="typed">${liveDisplayChar}</span>`;
      return;
    }

    el.inputDisplay.innerHTML = "";
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
    if (!show || guessedWrong.length === 0) {
      el.wrongJamoList.innerHTML = `
        <div class="wrong-jamo-group">
          <span class="wrong-jamo-values"></span>
        </div>
        <div class="wrong-jamo-group">
          <span class="wrong-jamo-values"></span>
        </div>
      `;
      return;
    }

    const consonants = guessedWrong
      .filter((jamo) => !JUNG.includes(jamo))
      .sort((a, b) => CONSONANT_ORDER.indexOf(a) - CONSONANT_ORDER.indexOf(b));
    const vowels = guessedWrong
      .filter((jamo) => JUNG.includes(jamo))
      .sort((a, b) => JUNG.indexOf(a) - JUNG.indexOf(b));

    el.wrongJamoList.innerHTML = `
      <div class="wrong-jamo-group">
        <span class="wrong-jamo-values">${consonants.join(" ")}</span>
      </div>
      <div class="wrong-jamo-group">
        <span class="wrong-jamo-values">${vowels.join(" ")}</span>
      </div>
    `;
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
    renderInputSlot,
    renderAnswerSlots,
    renderWrongJamo,
    renderHangman,
    setRestMode
  };
}
