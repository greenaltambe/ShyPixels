# ShyPixels

Browser extension that lets you blur any element on any website. Rules are saved per domain and reapply automatically.

Works on Chrome, Edge, Brave, and Firefox.

## Usage

1. Click the ShyPixels icon in the toolbar.
2. Click "Select Element". The popup closes and selection mode starts.
3. Hover over the page. The element under the cursor is highlighted.
4. Click the element you want to blur.
5. Choose a mode:
   - **Blur Always** -- element stays blurred.
   - **Blur (Hover)** -- element is blurred but reveals when you hover over it.
6. The rule is saved. It reapplies on every visit to that domain.

### Managing Rules

- Open the popup to see all rules for the current domain.
- Click the X next to a rule to remove it.
- Click "Clear All" to remove all rules for the current domain.
- Press Escape during selection to cancel.

### Import / Export

- Click "Export Rules" to download all rules (all domains) as a JSON file.
- Click "Import Rules" to load rules from a JSON file. Imported rules are added to existing rules without removing them.

---

## Development

### Build

```
npm run build
```

> Note: magick dependency is required to build

Output goes to `dist/chrome` and `dist/firefox`.

The build script generates browser-specific manifests from the base manifest.

### Load in Chrome / Edge / Brave

1. Go to `chrome://extensions` (or `edge://extensions`, `brave://extensions`).
2. Enable Developer mode.
3. Click "Load unpacked".
4. Select the `dist/chrome` folder.

After code changes, run `npm run build` and click the reload button on the extension card.

### Load in Firefox

1. Go to `about:debugging#/runtime/this-firefox`.
2. Click "Load Temporary Add-on".
3. Select `dist/firefox/manifest.json`.

Temporary add-ons are removed when Firefox closes.
