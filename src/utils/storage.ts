export interface BlurRule {
  selector: string;
  mode: "permanent" | "hover";
}

export interface ShyPixelsSettings {
  globalDisabled: boolean;
  disabledDomains: string[];
  blurIntensity: number;
}

const DEFAULT_SETTINGS: ShyPixelsSettings = {
  globalDisabled: false,
  disabledDomains: [],
  blurIntensity: 20,
};

function getDomain(): string {
  return location.hostname;
}

export async function getSettings(): Promise<ShyPixelsSettings> {
  const result = await chrome.storage.local.get("_settings");
  return { ...DEFAULT_SETTINGS, ...(result._settings as Partial<ShyPixelsSettings> ?? {}) };
}

export async function saveSettings(settings: ShyPixelsSettings): Promise<void> {
  await chrome.storage.local.set({ _settings: settings });
}

export async function isDisabled(domain?: string): Promise<boolean> {
  const settings = await getSettings();
  if (settings.globalDisabled) return true;
  const key = domain ?? getDomain();
  return settings.disabledDomains.includes(key);
}

export async function getRulesForDomain(domain?: string): Promise<BlurRule[]> {
  const key = domain ?? getDomain();
  const result = await chrome.storage.local.get(key);
  return (result[key] as BlurRule[]) ?? [];
}

export async function addRule(rule: BlurRule, domain?: string): Promise<void> {
  const key = domain ?? getDomain();
  const rules = await getRulesForDomain(key);

  const exists = rules.some(
    (r) => r.selector === rule.selector && r.mode === rule.mode
  );
  if (exists) return;

  rules.push(rule);
  await chrome.storage.local.set({ [key]: rules });
}

export async function removeRule(
  selector: string,
  domain?: string
): Promise<void> {
  const key = domain ?? getDomain();
  const rules = await getRulesForDomain(key);
  const filtered = rules.filter((r) => r.selector !== selector);
  await chrome.storage.local.set({ [key]: filtered });
}

export async function clearRulesForDomain(domain?: string): Promise<void> {
  const key = domain ?? getDomain();
  await chrome.storage.local.remove(key);
}
