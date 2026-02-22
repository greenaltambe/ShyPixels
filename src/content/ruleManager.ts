import { getRulesForDomain, isDisabled, getSettings, type BlurRule } from "../utils/storage.js";
import { applyBlurToSelector, removeAllBlurs, setBlurIntensity } from "./blurEngine.js";

let observer: MutationObserver | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 200;

let cachedRules: BlurRule[] = [];
let currentlyDisabled = false;

async function applyAllRules(): Promise<void> {
  currentlyDisabled = await isDisabled();
  if (currentlyDisabled) {
    removeAllBlurs();
    return;
  }

  const settings = await getSettings();
  setBlurIntensity(settings.blurIntensity);

  for (const rule of cachedRules) {
    applyBlurToSelector(rule.selector, rule.mode);
  }
}

function handleMutations(): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => { applyAllRules(); }, DEBOUNCE_MS);
}

export async function initRuleManager(): Promise<void> {
  cachedRules = await getRulesForDomain();
  await applyAllRules();

  observer = new MutationObserver(handleMutations);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

export async function refreshRules(): Promise<void> {
  cachedRules = await getRulesForDomain();
  await applyAllRules();
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
