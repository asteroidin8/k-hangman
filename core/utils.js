export const CHO = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
export const JUNG = ["ㅏ","ㅐ","ㅑ","ㅒ","ㅓ","ㅔ","ㅕ","ㅖ","ㅗ","ㅘ","ㅙ","ㅚ","ㅛ","ㅜ","ㅝ","ㅞ","ㅟ","ㅠ","ㅡ","ㅢ","ㅣ"];
export const JONG = ["","ㄱ","ㄲ","ㄳ","ㄴ","ㄵ","ㄶ","ㄷ","ㄹ","ㄺ","ㄻ","ㄼ","ㄽ","ㄾ","ㄿ","ㅀ","ㅁ","ㅂ","ㅄ","ㅅ","ㅆ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];

export const VALID_JAMO = new Set([...CHO, ...JUNG, ...JONG.filter(Boolean)]);

export function getTodayString() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function daysFromBase(baseDate, dateString) {
  const oneDay = 24 * 60 * 60 * 1000;
  const base = new Date(`${baseDate}T00:00:00`);
  const target = new Date(`${dateString}T00:00:00`);
  return Math.floor((target - base) / oneDay);
}

export function splitHangulWord(word) {
  const out = [];

  for (const char of word) {
    const code = char.charCodeAt(0);
    if (code < 0xac00 || code > 0xd7a3) {
      out.push(char);
      continue;
    }

    const offset = code - 0xac00;
    const cho = Math.floor(offset / 588);
    const jung = Math.floor((offset % 588) / 28);
    const jong = offset % 28;

    out.push(CHO[cho], JUNG[jung]);
    if (JONG[jong]) out.push(JONG[jong]);
  }

  return out;
}
