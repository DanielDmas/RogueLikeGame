/** Tiny DOM helpers. */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function clear(node: HTMLElement) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

export const HEART_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 20.5C6.5 16.5 2.5 12.8 2.5 8.9 2.5 6 4.7 3.8 7.5 3.8c1.7 0 3.4.9 4.5 2.4 1.1-1.5 2.8-2.4 4.5-2.4 2.8 0 5 2.2 5 5.1 0 3.9-4 7.6-9.5 11.6z"
    stroke="#b3543f" stroke-width="1.4" fill="rgba(179,84,63,0.28)"/>
</svg>`;
