const BLUR_CLASS = "focusmask-blur";
const HOVER_CLASS = "focusmask-hover";

const processedElements = new WeakSet<Element>();
let styleInjected = false;
let styleEl: HTMLStyleElement | null = null;

function injectStyles(): void {
  if (styleInjected) return;
  styleInjected = true;

  styleEl = document.createElement("style");
  styleEl.id = "focusmask-styles";
  updateStyleContent(20);
  document.head.appendChild(styleEl);
}

function updateStyleContent(intensity: number): void {
  if (!styleEl) return;
  styleEl.textContent = `
    .${BLUR_CLASS} {
      filter: blur(${intensity}px) !important;
      transition: filter 0.2s ease !important;
    }
    .${BLUR_CLASS}.${HOVER_CLASS}:hover {
      filter: none !important;
    }
  `;
}

export function setBlurIntensity(intensity: number): void {
  injectStyles();
  updateStyleContent(intensity);
}

export function applyBlur(
  element: Element,
  mode: "permanent" | "hover"
): void {
  if (processedElements.has(element)) return;

  injectStyles();

  element.classList.add(BLUR_CLASS);
  if (mode === "hover") {
    element.classList.add(HOVER_CLASS);
  }

  processedElements.add(element);
}

export function removeBlur(element: Element): void {
  element.classList.remove(BLUR_CLASS, HOVER_CLASS);
  // WeakSet doesn't have delete but we can re-process if needed
}

export function applyBlurToSelector(
  selector: string,
  mode: "permanent" | "hover"
): void {
  injectStyles();

  try {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      if (!processedElements.has(el)) {
        el.classList.add(BLUR_CLASS);
        if (mode === "hover") {
          el.classList.add(HOVER_CLASS);
        }
        processedElements.add(el);
      }
    });
  } catch {
    // Invalid selector – silently ignore
  }
}

export function removeBlurFromSelector(selector: string): void {
  try {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el) => {
      el.classList.remove(BLUR_CLASS, HOVER_CLASS);
    });
  } catch {
    // Invalid selector
  }
}

export function removeAllBlurs(): void {
  document.querySelectorAll(`.${BLUR_CLASS}`).forEach((el) => {
    el.classList.remove(BLUR_CLASS, HOVER_CLASS);
  });
  // WeakSet has no clear(), but old refs will be GC'd. New elements will be re-tracked on re-enable.
}
