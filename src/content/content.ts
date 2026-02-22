import { activate } from "./selectorEngine.js";
import { initRuleManager, refreshRules } from "./ruleManager.js";
import { addRule } from "../utils/storage.js";

let confirmationUI: HTMLDivElement | null = null;

function showConfirmation(
  selector: string,
  element: HTMLElement
): void {
  removeConfirmation();

  const modal = document.createElement("div");
  modal.id = "focusmask-confirm";
  modal.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 2147483647;
    background: #1a1a2e; color: #e0e0e0; padding: 16px 20px;
    border-radius: 12px; font-family: system-ui, sans-serif;
    font-size: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    min-width: 260px; max-width: 340px;
    border: 1px solid rgba(255,255,255,0.1);
  `;

  const title = document.createElement("div");
  title.textContent = "WhatsBlur";
  title.style.cssText = "font-weight: 700; font-size: 15px; margin-bottom: 8px; color: #4A90D9;";

  const info = document.createElement("div");
  info.textContent = `Selected: ${element.tagName.toLowerCase()}`;
  info.style.cssText = "margin-bottom: 4px; opacity: 0.7; font-size: 12px;";

  const selectorInfo = document.createElement("div");
  selectorInfo.textContent = selector.length > 50 ? selector.slice(0, 50) + "…" : selector;
  selectorInfo.style.cssText = "margin-bottom: 12px; opacity: 0.5; font-size: 11px; word-break: break-all;";

  const btnContainer = document.createElement("div");
  btnContainer.style.cssText = "display: flex; gap: 8px;";

  const btnStyle = `
    flex: 1; padding: 8px 12px; border: none; border-radius: 8px;
    cursor: pointer; font-size: 13px; font-weight: 600;
    font-family: system-ui, sans-serif; transition: opacity 0.15s;
  `;

  const permanentBtn = document.createElement("button");
  permanentBtn.textContent = "Blur Always";
  permanentBtn.style.cssText = btnStyle + "background: #4A90D9; color: white;";
  permanentBtn.addEventListener("click", () => handleBlurChoice(selector, "permanent"));

  const hoverBtn = document.createElement("button");
  hoverBtn.textContent = "Blur (Hover)";
  hoverBtn.style.cssText = btnStyle + "background: #2d2d44; color: #e0e0e0; border: 1px solid rgba(255,255,255,0.15);";
  hoverBtn.addEventListener("click", () => handleBlurChoice(selector, "hover"));

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "✕";
  cancelBtn.style.cssText = `
    position: absolute; top: 8px; right: 10px; background: none;
    border: none; color: #888; cursor: pointer; font-size: 16px;
    font-family: system-ui, sans-serif; padding: 2px 6px;
  `;
  cancelBtn.addEventListener("click", removeConfirmation);

  modal.style.position = "fixed";
  modal.appendChild(cancelBtn);
  modal.appendChild(title);
  modal.appendChild(info);
  modal.appendChild(selectorInfo);
  btnContainer.appendChild(permanentBtn);
  btnContainer.appendChild(hoverBtn);
  modal.appendChild(btnContainer);

  document.body.appendChild(modal);
  confirmationUI = modal;
}

function removeConfirmation(): void {
  if (confirmationUI) {
    confirmationUI.remove();
    confirmationUI = null;
  }
}

async function handleBlurChoice(
  selector: string,
  mode: "permanent" | "hover"
): Promise<void> {
  removeConfirmation();
  await addRule({ selector, mode });
  await refreshRules();
}

function startSelection(): void {
  activate((selector, element) => {
    showConfirmation(selector, element);
  });
}

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener(
  (message: { action: string }, _sender, sendResponse) => {
    if (message.action === "startSelection") {
      startSelection();
      sendResponse({ status: "ok" });
    } else if (message.action === "refreshRules") {
      refreshRules().then(() => sendResponse({ status: "ok" }));
      return true; // async response
    }
    return false;
  }
);

// Initialize on load
initRuleManager();
