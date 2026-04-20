# ShyPixels – Blur Any Element on Any Website

ShyPixels is a cross-browser privacy extension that lets users blur any element on any website and automatically reapply it every time they visit.

It helps protect sensitive information in shared or public environments.

Repository:  
https://github.com/greenaltambe/ShyPixels

---

## Privacy & Data Collection

ShyPixels:

- Does NOT collect personal data
- Does NOT transmit any data externally
- Does NOT use remote servers
- Does NOT use analytics
- Stores all rules locally using the browser’s `storage` API

All blur rules are saved locally on the user's device and never leave the browser.

## Features

- Blur any element on any website
- Per-domain rule storage
- Blur permanently
- Blur until hover (reveals on mouse over)
- Adjustable blur intensity
- Import / export rules (JSON)

---

## Example Use Cases

- Blur messaging sidebars in shared environments
- Hide AI chat history during screen sharing
- Protect dashboard data in public spaces
- Prevent shoulder surfing in offices or labs

---

## How It Works

1. Click the ShyPixels icon.
2. Click **Select Element**.
3. Hover over the page — the element under the cursor highlights.
4. Click the element to blur.
5. Choose a mode:
   - **Blur Always**
   - **Blur (Hover)**
6. The rule is saved automatically.
7. It reapplies every time you visit that domain.

Press **Escape** during selection to cancel.

---

## Rule Management

From the popup you can:

- View rules for the current domain
- Remove individual rules
- Clear all rules
- Adjust blur intensity
- Import or export rules

Rules are domain-scoped and automatically applied on page load.

---

## Import / Export

### Export

Exports all blur rules as a JSON file.

### Import

Imports JSON rules and merges them with existing rules.

Useful for:

- Backup
- Device migration
- Sharing configurations

---

## Browser Compatibility

- Firefox
- Chrome
- Edge
- Brave

Built using WebExtension APIs and Manifest V3.

## Requirements

- Node.js
- npm

## Install Dependencies

```bash
npm install
```

## Build

```bash
npm run build
```

Build output:

```
dist/chrome
dist/firefox
```

The build system generates browser-specific manifests automatically.

---

## Firefox Local Testing

1. Open:

```
about:debugging#/runtime/this-firefox
```

2. Click **Load Temporary Add-on**
3. Select:

```
dist/firefox/manifest.json
```

---

## Chrome Local Testing

1. Open:

```
chrome://extensions
```

2. Enable Developer Mode
3. Click **Load unpacked**
4. Select:

```
dist/chrome
```
