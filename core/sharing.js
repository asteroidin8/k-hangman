import { TEXT } from "./config.js";

export function createSharing(ui, game) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(game.buildShareText());
      ui.setCopyButtonCopied(true);
    } catch {
      ui.showMessage(TEXT.denied);
    }
  }

  async function shareNative() {
    const text = game.buildShareText();

    try {
      if (navigator.share) {
        await navigator.share({
          title: "행맨",
          text
        });
      } else {
        await navigator.clipboard.writeText(text);
        ui.showMessage(TEXT.copied);
      }
    } catch {
      // noop
    }
  }

  return {
    copy,
    shareNative
  };
}