export const STORAGE_PROGRESS = "hangman_progress_v12";
export const STORAGE_STATS = "hangman_stats_v12";
export const STORAGE_SETTINGS = "hangman_settings_v1";

export const BASE_DATE = "2026-01-01";
export const MAX_WRONG = 6;

export const TEXT = {
  invalid: ["자모만", "그건 안 돼", "자모로 와"],
  duplicateCorrect: ["이미 했어", "그건 했어", "또 그거야"],
  duplicateWrong: ["또 틀렸어", "그건 이미 틀렸어", "또야"],
  hit: ["있다", "맞았다", "좋아"],
  miss: ["없다", "틀렸다", "아니다"],
  hint: ["하나 풀어준다", "살짝 보여준다", "이번만이다"],
  hintBlocked: ["욕심내지 마", "두 번은 안 돼", "이미 줬어"],
  bonusHint: ["진짜 마지막이다", "이번만 더", "몰래 하나 더"],
  win: "끝",
  lose: "끝났어 내일 와",
  help: "맞히면 열려\n틀리면 그려져",
  copied: "복사됨",
  denied: "안 돼",
  aliveTitle: "살았다",
  deadTitle: "죽었다",
  adBusy: "근무 중"
};

export function pickText(value) {
  if (!Array.isArray(value)) return value;
  return value[Math.floor(Math.random() * value.length)];
}

export const SVG_PATHS = {
  gallows: "./assets/svg/gallows.svg",
  hangman: "./assets/svg/hangman.svg",
  restman: "./assets/svg/restman.svg"
};
