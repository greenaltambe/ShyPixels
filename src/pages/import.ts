interface BlurRule {
  selector: string;
  mode: "permanent" | "hover";
}

const dropZone = document.getElementById("dropZone") as HTMLDivElement;
const fileInput = document.getElementById("fileInput") as HTMLInputElement;
const statusEl = document.getElementById("status") as HTMLDivElement;

function showStatus(message: string, type: "success" | "error"): void {
  statusEl.textContent = message;
  statusEl.className = type;
}

async function processFile(file: File): Promise<void> {
  try {
    const text = await file.text();
    const imported = JSON.parse(text) as Record<string, BlurRule[]>;
    let totalAdded = 0;

    for (const [domain, newRules] of Object.entries(imported)) {
      if (!Array.isArray(newRules)) continue;

      const valid = newRules.filter(
        (r) =>
          typeof r.selector === "string" &&
          (r.mode === "permanent" || r.mode === "hover")
      );
      if (valid.length === 0) continue;

      const result = await chrome.storage.local.get(domain);
      const existing: BlurRule[] = (result[domain] as BlurRule[]) ?? [];

      for (const rule of valid) {
        const duplicate = existing.some(
          (e) => e.selector === rule.selector && e.mode === rule.mode
        );
        if (!duplicate) {
          existing.push(rule);
          totalAdded++;
        }
      }

      await chrome.storage.local.set({ [domain]: existing });
    }

    showStatus(`Imported ${totalAdded} new rule${totalAdded !== 1 ? "s" : ""}.`, "success");
  } catch {
    showStatus("Invalid file. Please select a valid ShyPixels JSON export.", "error");
  }
}

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  const file = e.dataTransfer?.files[0];
  if (file) processFile(file);
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0];
  if (file) processFile(file);
  fileInput.value = "";
});
