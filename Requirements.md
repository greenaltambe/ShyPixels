# Project: WhatsBlur – Universal Element Blur Extension

Build a cross-browser WebExtension (Manifest V3) that allows users to select ANY element on ANY website and apply blur behavior.

This must work on:

- Chrome
- Edge
- Brave
- Firefox

Use:

- TypeScript
- Manifest V3
- No frameworks
- Modular architecture
- chrome.storage.local for persistence

---

## Core Feature

User can:

1. Click "Select Element" from popup
2. Hover over webpage → element under cursor is highlighted
3. Click element → selection confirmed
4. Choose blur mode:
   - Permanent blur
   - Blur on hover
5. Rule persists per domain
6. Rules automatically reapply on page load
7. Works on dynamic content (YouTube, Twitter, etc.)

---

## Project Structure

/src
/background
background.ts
/content
content.ts
selectorEngine.ts
blurEngine.ts
ruleManager.ts
/popup
popup.html
popup.ts
popup.css
/utils
storage.ts
domUtils.ts
manifest.json
tsconfig.json

---

## Selection Mode Requirements

- Inject a transparent overlay
- On mousemove:
  - Use document.elementFromPoint
  - Highlight hovered element with outline
- On click:
  - Prevent default
  - Stop propagation
  - Capture element
  - Generate stable CSS selector
- Show confirmation UI (small floating modal)

---

## Selector Generation Strategy

Generate the most stable selector possible:

Priority:

1. #id
2. [data-* attributes]
3. Unique class combinations
4. Fallback to DOM path

Avoid:

- Excessive nth-child
- Overly deep selectors

Create utility:
generateStableSelector(element: HTMLElement): string

---

## Blur Engine

Blur class:

.focusmask-blur {
filter: blur(20px);
transition: filter 0.2s ease;
}

For hover mode:

.focusmask-hover:hover {
filter: none;
}

Track already processed elements using WeakSet.

---

## Storage Structure

interface BlurRule {
selector: string
mode: "permanent" | "hover"
}

Stored as:

{
"example.com": [
{ selector: "...", mode: "permanent" },
{ selector: "...", mode: "hover" }
]
}

Use chrome.storage.local.

---

## Rule Application

On:

- DOMContentLoaded
- MutationObserver

Apply rules efficiently:

- Only query needed selectors
- Avoid full DOM rescans
- Debounce observer

---

## Popup UI

Popup must:

- Show current domain
- Button: "Select Element"
- List existing rules
- Allow removing rules
- Clear all rules for domain

---

## Edge Cases

- Shadow DOM (handle if possible)
- Dynamic SPA navigation
- Lazy-loaded content
- Iframes (ignore cross-origin)

---

## Code Quality Rules

- Strict TypeScript
- Modular
- No global variables
- Clean interfaces
- Minimal permissions
- Production-ready

Generate:

- manifest.json
- basic working scaffold
- selection engine
- blur engine
- storage utility
- popup UI
- mutation observer integration
