import { createBoardRenderers } from "./board-renderers.js";

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

  const renderers = createBoardRenderers(
    el,
    () => parts,
    () => deadFace
  );

  return {
    bindInjectedParts,
    ...renderers
  };
}
