import { generateStableSelector } from "../utils/domUtils.js";

type SelectionCallback = (selector: string, element: HTMLElement) => void;

let active = false;
let overlay: HTMLDivElement | null = null;
let highlightBox: HTMLDivElement | null = null;
let currentTarget: HTMLElement | null = null;
let onSelectCallback: SelectionCallback | null = null;

function createOverlay(): HTMLDivElement {
  const el = document.createElement("div");
  el.id = "focusmask-overlay";
  el.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    z-index: 2147483646; cursor: crosshair; background: transparent;
  `;
  return el;
}

function createHighlightBox(): HTMLDivElement {
  const el = document.createElement("div");
  el.id = "focusmask-highlight";
  el.style.cssText = `
    position: fixed; pointer-events: none; z-index: 2147483647;
    border: 2px solid #4A90D9; background: rgba(74, 144, 217, 0.15);
    transition: all 0.1s ease; display: none;
  `;
  return el;
}

function handleMouseMove(e: MouseEvent): void {
  if (!overlay || !highlightBox) return;

  overlay.style.pointerEvents = "none";
  const target = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
  overlay.style.pointerEvents = "auto";

  if (
    !target ||
    target === overlay ||
    target === highlightBox ||
    target.id?.startsWith("focusmask")
  ) {
    highlightBox.style.display = "none";
    currentTarget = null;
    return;
  }

  currentTarget = target;
  const rect = target.getBoundingClientRect();
  highlightBox.style.display = "block";
  highlightBox.style.top = `${rect.top}px`;
  highlightBox.style.left = `${rect.left}px`;
  highlightBox.style.width = `${rect.width}px`;
  highlightBox.style.height = `${rect.height}px`;
}

function handleClick(e: MouseEvent): void {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  if (!currentTarget) return;

  const selector = generateStableSelector(currentTarget);
  const element = currentTarget;
  const callback = onSelectCallback;

  deactivate();

  if (callback) {
    callback(selector, element);
  }
}

function handleKeyDown(e: KeyboardEvent): void {
  if (e.key === "Escape") {
    deactivate();
  }
}

export function activate(callback: SelectionCallback): void {
  if (active) return;
  active = true;
  onSelectCallback = callback;

  overlay = createOverlay();
  highlightBox = createHighlightBox();

  document.body.appendChild(overlay);
  document.body.appendChild(highlightBox);

  overlay.addEventListener("mousemove", handleMouseMove);
  overlay.addEventListener("click", handleClick, true);
  document.addEventListener("keydown", handleKeyDown);
}

export function deactivate(): void {
  if (!active) return;
  active = false;
  currentTarget = null;
  onSelectCallback = null;

  if (overlay) {
    overlay.removeEventListener("mousemove", handleMouseMove);
    overlay.removeEventListener("click", handleClick, true);
    overlay.remove();
    overlay = null;
  }

  if (highlightBox) {
    highlightBox.remove();
    highlightBox = null;
  }

  document.removeEventListener("keydown", handleKeyDown);
}

export function isActive(): boolean {
  return active;
}
