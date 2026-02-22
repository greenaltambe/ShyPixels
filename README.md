# ShyPixels – Blur Any Element on Any Website

ShyPixels is a cross-browser privacy extension that lets you blur any element on any website and automatically reapply it every time you visit.

It is especially useful for:

- Blurring WhatsApp Web recent chats sidebar
- Hiding ChatGPT or Gemini chat history
- Protecting LLM conversations in shared environments
- Preventing shoulder surfing in offices, labs, or cafes
- Hiding sensitive dashboard or admin panel data

Works on Chrome, Edge, Brave, and Firefox.

Repository: https://github.com/greenaltambe/ShyPixels

---

## The Problem

Modern web apps expose personal information directly in sidebars and previews:

- WhatsApp Web shows your recent contacts
- ChatGPT and Gemini display full chat history
- Email clients show subject previews
- Dashboards expose financial or operational data

In shared environments, this creates privacy risks.

ShyPixels gives you fine-grained control by letting you select and blur specific elements — permanently or until hover — with rules saved per domain.

No custom CSS. No DevTools. No hacks.

---

## Features

- Blur any element on any website
- Per-domain rule storage
- Blur permanently
- Blur until hover (reveals on mouse over)
- Adjustable blur intensity
- Import / export rules (JSON)
- Works with dynamic sites (LLMs, SPAs)
- Cross-browser support (Manifest V3 architecture)

---

## Example Use Cases

### 1. Blur WhatsApp Web Sidebar

Hide your recent chats list so others cannot see who you are messaging.

### 2. Hide ChatGPT or Gemini Chat History

Blur your LLM sidebar to prevent others from reading previous conversations.

Ideal for:

- Open offices
- University labs
- Screen sharing
- Recording tutorials
- Working in public spaces

### 3. Hide Sensitive Interface Sections

Blur:

- Finance dashboards
- CRM panels
- Admin tools
- Email previews
- Internal tools

---

## How It Works

1. Click the ShyPixels icon in your browser toolbar.
2. Click **Select Element**.
3. Hover over the page — the element under your cursor highlights.
4. Click the element you want to blur.
5. Choose a mode:
   - **Blur Always** — permanently blurred
   - **Blur (Hover)** — blurred until mouse hover
6. The rule is saved automatically.
7. It reapplies every time you visit that domain.

Press **Escape** during selection to cancel.

---

## Managing Rules

Open the popup to:

- View all rules for the current domain
- Remove individual rules
- Clear all rules for a domain
- Adjust blur intensity

Rules are scoped per domain and applied automatically on page load.

---

## Import / Export Rules

### Export

Download all blur rules (across all domains) as a JSON file.

### Import

Import rules from a JSON file.  
Imported rules are merged with existing rules.

Useful for:

- Backups
- Sharing configurations
- Multi-device setup

---

## Browser Compatibility

- Google Chrome
- Microsoft Edge
- Brave
- Mozilla Firefox

Built using modern WebExtension APIs and Manifest V3.

---

# Installation

## Chrome / Edge / Brave (Developer Mode)

1. Run:

```bash
npm run build
```

2. Open:
   - chrome://extensions
   - edge://extensions
   - brave://extensions

3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select:

```
dist/chrome
```

After code changes:

- Run `npm run build`
- Click reload on the extension card

---

## Firefox (Temporary Add-on)

1. Run:

```bash
npm run build
```

2. Open:

```
about:debugging#/runtime/this-firefox
```

3. Click **Load Temporary Add-on**
4. Select:

```
dist/firefox/manifest.json
```

Temporary add-ons are removed when Firefox closes.

---

## Development

Build:

```bash
npm run build
```

Requirements:

- Node.js
- npm

Output:

- `dist/chrome`
- `dist/firefox`

The build system generates browser-specific manifests automatically.
