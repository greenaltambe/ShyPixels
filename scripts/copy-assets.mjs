import { cpSync, mkdirSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);

// Copy static assets to dist
const assets = [
  ["src/manifest.json", "dist/manifest.json"],
  ["src/popup/popup.html", "dist/popup/popup.html"],
  ["src/popup/popup.css", "dist/popup/popup.css"],
];

for (const [src, dest] of assets) {
  mkdirSync(dirname(`${root}/${dest}`), { recursive: true });
  cpSync(`${root}/${src}`, `${root}/${dest}`);
}

// Create placeholder icons
const iconDir = `${root}/dist/icons`;
mkdirSync(iconDir, { recursive: true });

// Generate simple SVG icons as PNG placeholders
import { writeFileSync } from "fs";
for (const size of [16, 48, 128]) {
  // Create a minimal 1x1 PNG as placeholder
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  writeFileSync(`${iconDir}/icon${size}.png`, pngHeader);
}

console.log("Assets copied to dist/");
