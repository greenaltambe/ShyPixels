import { getRulesForDomain, type BlurRule } from "../utils/storage.js";
import { applyBlurToSelector } from "./blurEngine.js";

let observer: MutationObserver | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 200;

let cachedRules: BlurRule[] = [];

function applyAllRules(): void {
  for (const rule of cachedRules) {
    applyBlurToSelector(rule.selector, rule.mode);
  }
}

function handleMutations(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(applyAllRules, DEBOUNCE_MS);
}

export async function initRuleManager(): Promise<void> {
  cachedRules = await getRulesForDomain();
  applyAllRules();

  observer = new MutationObserver(handleMutations);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export async function refreshRules(): Promise<void> {
  cachedRules = await getRulesForDomain();
  applyAllRules();
}

export function destroyRuleManager(): void {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
}
