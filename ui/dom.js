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
    shareBtn: document.getElementById("shareBtn"),
    settingsBtn: document.getElementById("settingsBtn"),

    message: document.getElementById("message"),
    messageText: document.getElementById("messageText"),

    settingsPanel: document.getElementById("settingsPanel"),
    wrongJamoToggle: document.getElementById("wrongJamoToggle"),

    answerSlots: document.getElementById("answerSlots"),
    wrongJamoList: document.getElementById("wrongJamoList"),

    inputSlot: document.getElementById("inputSlot"),
    inputDisplay: document.getElementById("inputDisplay"),
    jamoInput: document.getElementById("jamoInput"),
    sendBtn: document.getElementById("sendBtn"),

    statsModal: document.getElementById("statsModal"),
    modalTitle: document.getElementById("modalTitle"),
    aliveCount: document.getElementById("aliveCount"),
    deadCount: document.getElementById("deadCount"),
    shareStatus: document.getElementById("shareStatus"),
    shareSquares: document.getElementById("shareSquares"),
    shareAttempts: document.getElementById("shareAttempts"),
    copyBtn: document.getElementById("copyBtn"),
    shareModalBtn: document.getElementById("shareModalBtn"),
    closeModalBtn: document.getElementById("closeModalBtn")
  };
}