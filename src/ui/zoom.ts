/**
 * Scales the 2D UI layer only (`#ui`) — the WebGL canvas is a sibling and
 * keeps rendering at its native resolution untouched. Uses the CSS `zoom`
 * property rather than `transform: scale` because `zoom` also rescales
 * hit-testing, so clicks still land where the (rescaled) UI is drawn.
 */
export function applyUiZoom(zoom: number): void {
  const ui = document.getElementById('ui');
  if (ui) (ui.style as CSSStyleDeclaration & { zoom?: string }).zoom = String(zoom);
}
