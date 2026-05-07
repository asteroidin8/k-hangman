import { daysFromBase, splitHangulWord } from "./utils.js";

export function createDailyPuzzle(words, baseDate, today) {
  const puzzleNumber = daysFromBase(baseDate, today) + 1;
  const answerEntry = words[((puzzleNumber - 1) % words.length + words.length) % words.length];
  const answerWord = typeof answerEntry === "string" ? answerEntry : answerEntry.word;
  const answerMeaning = typeof answerEntry === "string" ? "" : answerEntry.meaning;

  return {
    today,
    puzzleNumber,
    answerWord,
    answerMeaning,
    answerJamo: splitHangulWord(answerWord),
  };
}
