export function getDOM() {
  return {
    app: document.querySelector(".app"),
    toolbar: document.getElementById("toolbar"),
    board: document.getElementById("board"),

    gallowsMount: document.getElementById("gallowsMount"),
    hangmanMount: document.getElementById("hangmanMount"),
    restmanMount: document.getElementById("restmanMount"),
    restmanWrap: document.getElementById("restmanWrap"),
    adSign: document.getElementById("adSign"),

    helpBtn: document.getElementById("helpBtn"),
    hintBtn: document.getElementById("hintBtn"),
    statsBtn: document.getElementById("statsBtn"),
    settingsBtn: document.getElementById("settingsBtn"),

    settingsModal: document.getElementById("settingsModal"),
    closeSettingsBtn: document.getElementById("closeSettingsBtn"),
    message: document.getElementById("message"),
    messageText: document.getElementById("messageText"),
    wordMeaning: document.getElementById("wordMeaning"),
    wordMeaningText: document.getElementById("wordMeaningText"),

    settingsPanel: document.getElementById("settingsPanel"),
    wrongJamoToggle: document.getElementById("wrongJamoToggle"),
    wordMeaningToggle: document.getElementById("wordMeaningToggle"),

    answerSlots: document.getElementById("answerSlots"),
    wrongJamoList: document.getElementById("wrongJamoList"),
    jamoKeyboard: document.getElementById("jamoKeyboard"),

    statsModal: document.getElementById("statsModal"),
    modalTitle: document.getElementById("modalTitle"),
    aliveCount: document.getElementById("aliveCount"),
    deadCount: document.getElementById("deadCount"),
    winRate: document.getElementById("winRate"),
    averageAttempts: document.getElementById("averageAttempts"),
    bestAttempts: document.getElementById("bestAttempts"),
    currentStreak: document.getElementById("currentStreak"),
    howToPlay: document.getElementById("howToPlay"),
    shareCard: document.getElementById("shareCard"),
    sharePuzzle: document.getElementById("sharePuzzle"),
    shareStatus: document.getElementById("shareStatus"),
    shareSquares: document.getElementById("shareSquares"),
    shareAttempts: document.getElementById("shareAttempts"),
    copyBtn: document.getElementById("copyBtn"),
    shareModalBtn: document.getElementById("shareModalBtn"),
    closeModalBtn: document.getElementById("closeModalBtn")
  };
}
