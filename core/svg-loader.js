import { SVG_PATHS } from "./config.js";
import { injectSVG } from "./utils.js";

export async function loadGameSVGs(ui) {
  await Promise.all([
    injectSVG(SVG_PATHS.gallows, ui.el.gallowsMount),
    injectSVG(SVG_PATHS.hangman, ui.el.hangmanMount),
    injectSVG(SVG_PATHS.restman, ui.el.restmanMount)
  ]);

  ui.bindInjectedParts();
}