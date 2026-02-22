# WhatsBlur – Universal Element Blur Extension

A cross-browser WebExtension (Manifest V3) that lets you select **any element** on **any website** and blur it — permanently or with hover-to-reveal.

## Features

- **Point-and-click element selection** — hover to highlight, click to select
- **Two blur modes** — permanent blur or hover-to-reveal
- **Per-domain rules** — rules are saved and reapply automatically on page load
- **Dynamic content support** — MutationObserver detects new elements (YouTube, Twitter, etc.)
- **Cross-browser** — works on Chrome, Edge, Brave, and Firefox

---

## How to Use

1. Click the **WhatsBlur** icon in your browser toolbar to open the popup.
2. Click **"Select Element"** — the popup closes and selection mode activates.
3. **Hover** over the page — the element under your cursor is highlighted in blue.
4. **Click** the element you want to blur.
5. A confirmation dialog appears in the top-right corner. Choose:
   - **Blur Always** — element stays blurred permanently
   - **Blur (Hover)** — element is blurred but reveals on mouse hover
6. The rule is saved and will automatically reapply every time you visit that domain.

### Managing Rules

- Open the popup to see all active blur rules for the current domain.
- Click **✕** next to a rule to remove it.
- Click **Clear All** to remove all rules for the current domain.
- Press **Escape** during selection mode to cancel.

---

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm

### Setup

```bash
git clone <repo-url>
cd WhatsBlur
npm install
```

### Build

```bash
npm run build
```

This compiles TypeScript and bundles everything into the `dist/` directory.

### Clean

```bash
npm run clean
```

### Project Structure

```
src/
├── background/
│   └── background.ts        # Service worker — message routing
├── content/
│   ├── content.ts            # Main content script — selection UI, messaging
│   ├── selectorEngine.ts     # Element selection overlay and highlighting
│   ├── blurEngine.ts         # Applies blur CSS classes, tracks processed elements
│   └── ruleManager.ts        # Loads rules, MutationObserver for dynamic content
├── popup/
│   ├── popup.html            # Popup UI markup
│   ├── popup.ts              # Popup logic — rule display, controls
│   └── popup.css             # Popup styles
├── utils/
│   ├── storage.ts            # chrome.storage.local wrapper for blur rules
│   └── domUtils.ts           # Stable CSS selector generation
└── manifest.json             # Manifest V3 configuration
```

---

## Loading the Extension

### Chrome / Edge / Brave

1. Run `npm run build` to generate the `dist/` folder.
2. Open your browser and navigate to:
   - **Chrome**: `chrome://extensions`
   - **Edge**: `edge://extensions`
   - **Brave**: `brave://extensions`
3. Enable **Developer mode** (toggle in the top-right corner).
4. Click **"Load unpacked"**.
5. Select the `dist/chrome` folder inside the project.
6. The WhatsBlur icon should appear in your toolbar.

> **Tip:** After making code changes, run `npm run build` again, then click the reload (↻) button on the extension card.

### Firefox

1. Run `npm run build` to generate the `dist/` folder.
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
3. Click **"Load Temporary Add-on…"**.
4. Select the `dist/firefox/manifest.json` file.
5. The WhatsBlur icon should appear in your toolbar.

> **Note:** Temporary add-ons in Firefox are removed when the browser closes. For persistent installation, package the extension as a `.xpi` file and submit to [addons.mozilla.org](https://addons.mozilla.org).

---

## License

MIT
