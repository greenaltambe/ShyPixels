interface BlurRule {
  selector: string;
  mode: "permanent" | "hover";
}

interface ShyPixelsSettings {
  globalDisabled: boolean;
  disabledDomains: string[];
  blurIntensity: number;
}

const DEFAULT_SETTINGS: ShyPixelsSettings = {
  globalDisabled: false,
  disabledDomains: [],
  blurIntensity: 20,
};

const domainEl = document.getElementById("domain") as HTMLParagraphElement;
const selectBtn = document.getElementById("selectBtn") as HTMLButtonElement;
const clearAllBtn = document.getElementById("clearAllBtn") as HTMLButtonElement;
const rulesList = document.getElementById("rulesList") as HTMLUListElement;
const noRules = document.getElementById("noRules") as HTMLParagraphElement;
const exportBtn = document.getElementById("exportBtn") as HTMLButtonElement;
const importBtn = document.getElementById("importBtn") as HTMLButtonElement;
const siteToggle = document.getElementById("siteToggle") as HTMLInputElement;
const globalToggle = document.getElementById("globalToggle") as HTMLInputElement;
const intensitySlider = document.getElementById("intensitySlider") as HTMLInputElement;
const intensityValue = document.getElementById("intensityValue") as HTMLSpanElement;

let currentDomain = "";

async function getCurrentDomain(): Promise<string> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url) {
    try {
      return new URL(tab.url).hostname;
    } catch {
      return "";
    }
  }
  return "";
}

async function getRules(): Promise<BlurRule[]> {
  if (!currentDomain) return [];
  const result = await chrome.storage.local.get(currentDomain);
  return (result[currentDomain] as BlurRule[]) ?? [];
}

function renderRules(rules: BlurRule[]): void {
  rulesList.innerHTML = "";

  if (rules.length === 0) {
    noRules.style.display = "block";
    clearAllBtn.style.display = "none";
    return;
  }

  noRules.style.display = "none";
  clearAllBtn.style.display = "inline-block";

  for (const rule of rules) {
    const li = document.createElement("li");

    const info = document.createElement("div");
    info.className = "rule-info";

    const selectorSpan = document.createElement("span");
    selectorSpan.className = "rule-selector";
    selectorSpan.textContent = rule.selector;
    selectorSpan.title = rule.selector;

    const modeSpan = document.createElement("span");
    modeSpan.className = "rule-mode";
    modeSpan.textContent = rule.mode === "hover" ? "hover reveal" : "permanent";

    info.appendChild(selectorSpan);
    info.appendChild(modeSpan);

    const removeBtn = document.createElement("button");
    removeBtn.className = "rule-remove";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => removeRule(rule.selector));

    li.appendChild(info);
    li.appendChild(removeBtn);
    rulesList.appendChild(li);
  }
}

async function removeRule(selector: string): Promise<void> {
  const rules = await getRules();
  const filtered = rules.filter((r) => r.selector !== selector);
  await chrome.storage.local.set({ [currentDomain]: filtered });
  renderRules(filtered);
  notifyContentScript("refreshRules");
}

async function clearAllRules(): Promise<void> {
  await chrome.storage.local.remove(currentDomain);
  renderRules([]);
  notifyContentScript("refreshRules");
}

function notifyContentScript(action: string): void {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (tabId !== undefined) {
      chrome.tabs.sendMessage(tabId, { action });
    }
  });
}

selectBtn.addEventListener("click", () => {
  notifyContentScript("startSelection");
  window.close();
});

clearAllBtn.addEventListener("click", clearAllRules);

// Export all rules across all domains as JSON
exportBtn.addEventListener("click", async () => {
  const allData = await chrome.storage.local.get(null);
  // Exclude internal settings from export
  delete allData._settings;
  const blob = new Blob([JSON.stringify(allData, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "shypixels-rules.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import rules — open dedicated page in new tab (popup closes on file dialog focus loss)
importBtn.addEventListener("click", () => {
  chrome.tabs.create({ url: chrome.runtime.getURL("pages/import.html") });
});

// Settings helpers
async function loadSettings(): Promise<ShyPixelsSettings> {
  const result = await chrome.storage.local.get("_settings");
  return { ...DEFAULT_SETTINGS, ...(result._settings as Partial<ShyPixelsSettings> ?? {}) };
}

async function saveSettings(settings: ShyPixelsSettings): Promise<void> {
  await chrome.storage.local.set({ _settings: settings });
  notifyContentScript("refreshRules");
}

// Site toggle — disable/enable for current domain
siteToggle.addEventListener("change", async () => {
  const settings = await loadSettings();
  if (siteToggle.checked) {
    settings.disabledDomains = settings.disabledDomains.filter((d) => d !== currentDomain);
  } else {
    if (!settings.disabledDomains.includes(currentDomain)) {
      settings.disabledDomains.push(currentDomain);
    }
  }
  await saveSettings(settings);
});

// Global toggle — disable/enable everywhere
globalToggle.addEventListener("change", async () => {
  const settings = await loadSettings();
  settings.globalDisabled = !globalToggle.checked;
  await saveSettings(settings);
});

// Intensity slider
let intensityDebounce: ReturnType<typeof setTimeout> | null = null;
intensitySlider.addEventListener("input", () => {
  intensityValue.textContent = `${intensitySlider.value}px`;
  if (intensityDebounce) clearTimeout(intensityDebounce);
  intensityDebounce = setTimeout(async () => {
    const settings = await loadSettings();
    settings.blurIntensity = parseInt(intensitySlider.value, 10);
    await saveSettings(settings);
  }, 150);
});

// Initialize popup
(async () => {
  currentDomain = await getCurrentDomain();
  domainEl.textContent = currentDomain || "N/A";

  const settings = await loadSettings();
  globalToggle.checked = !settings.globalDisabled;
  siteToggle.checked = !settings.disabledDomains.includes(currentDomain);
  intensitySlider.value = String(settings.blurIntensity);
  intensityValue.textContent = `${settings.blurIntensity}px`;

  const rules = await getRules();
  renderRules(rules);
})();
