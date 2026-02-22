interface BlurRule {
  selector: string;
  mode: "permanent" | "hover";
}

const domainEl = document.getElementById("domain") as HTMLParagraphElement;
const selectBtn = document.getElementById("selectBtn") as HTMLButtonElement;
const clearAllBtn = document.getElementById("clearAllBtn") as HTMLButtonElement;
const rulesList = document.getElementById("rulesList") as HTMLUListElement;
const noRules = document.getElementById("noRules") as HTMLParagraphElement;

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

// Initialize popup
(async () => {
  currentDomain = await getCurrentDomain();
  domainEl.textContent = currentDomain || "N/A";
  const rules = await getRules();
  renderRules(rules);
})();
