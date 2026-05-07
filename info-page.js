const gameUrl = new URL("index.html", window.location.href);

function cameFromGame() {
  if (!document.referrer) return false;

  try {
    const referrer = new URL(document.referrer);
    const gamePath = new URL("index.html", window.location.href).pathname;
    const rootPath = gamePath.replace(/index\.html$/, "");

    return (
      referrer.origin === window.location.origin &&
      (referrer.pathname === gamePath || referrer.pathname === rootPath)
    );
  } catch {
    return false;
  }
}

if (!cameFromGame() && !history.state?.gameBackReady) {
  history.replaceState({ gameBackReady: true }, "", window.location.href);
  history.pushState({ infoPage: true }, "", window.location.href);
}

window.addEventListener("popstate", () => {
  window.location.replace(gameUrl);
});
