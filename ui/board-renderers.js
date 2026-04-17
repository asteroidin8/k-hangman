import { CHO, JONG, JUNG } from "../core/utils.js";

export function createBoardRenderers(el, getParts, getDeadFace) {
  const consonantOrder = [...new Set([...CHO, ...JONG.filter(Boolean)])];
  const consonantOrderMap = new Map(consonantOrder.map((jamo, index) => [jamo, index]));
  const vowelOrderMap = new Map(JUNG.map((jamo, index) => [jamo, index]));

  function sortByOrder(items, orderMap) {
    return [...items].sort(
      (left, right) =>
        (orderMap.get(left) ?? Number.MAX_SAFE_INTEGER) -
        (orderMap.get(right) ?? Number.MAX_SAFE_INTEGER)
    );
  }

  function renderInputSlot({ liveDisplayChar, invalidChar, isEnded }) {
    el.inputSlot.classList.toggle("is-disabled", isEnded);
    el.sendBtn.disabled = isEnded;
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
      el.wrongJamoList.classList.add("hidden");
      el.wrongJamoList.textContent = "";
      return;
    }

    const consonants = sortByOrder(
      guessedWrong.filter((jamo) => !vowelOrderMap.has(jamo)),
      consonantOrderMap
    );
    const vowels = sortByOrder(
      guessedWrong.filter((jamo) => vowelOrderMap.has(jamo)),
      vowelOrderMap
    );
    const groups = [consonants.join(" "), vowels.join(" ")].filter(Boolean);

    el.wrongJamoList.textContent = groups.join("   ");
    el.wrongJamoList.classList.remove("hidden");
  }

  function renderHangman(wrongCount, isDead) {
    getParts().forEach((part, index) => {
      part.classList.toggle("on", index < wrongCount);
    });

    getDeadFace().forEach((node) => node.classList.toggle("on", isDead));
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
    renderInputSlot,
    renderAnswerSlots,
    renderWrongJamo,
    renderHangman,
    setRestMode
  };
}
