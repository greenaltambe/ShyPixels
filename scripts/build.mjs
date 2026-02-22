import * as esbuild from "esbuild";
import { cpSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = dirname(__dirname);

const targets = ["chrome", "firefox"];

// Bundle shared JS once into a temp location, then copy per-target
const shared = `${root}/dist/_shared`;
mkdirSync(shared, { recursive: true });

await Promise.all([
  esbuild.build({
    entryPoints: [`${root}/src/content/content.ts`],
    bundle: true,
    outfile: `${shared}/content/content.js`,
    format: "iife",
    target: "es2020",
    minify: false,
  }),
  esbuild.build({
    entryPoints: [`${root}/src/background/background.ts`],
    bundle: true,
    outfile: `${shared}/background/background.js`,
    format: "esm",
    target: "es2020",
    minify: false,
  }),
  esbuild.build({
    entryPoints: [`${root}/src/popup/popup.ts`],
    bundle: true,
    outfile: `${shared}/popup/popup.js`,
    format: "iife",
    target: "es2020",
    minify: false,
  }),
]);

// Read base manifest
const baseManifest = JSON.parse(
  readFileSync(`${root}/src/manifest.json`, "utf-8")
);

// Per-target manifest transforms
function makeManifest(target) {
  const manifest = structuredClone(baseManifest);

  if (target === "firefox") {
    // Firefox uses background.scripts, not service_worker
    manifest.background = {
      scripts: ["background/background.js"],
      type: "module",
    };
    // Firefox needs browser_specific_settings for add-on ID
    manifest.browser_specific_settings = {
      gecko: { id: "whatsblur@extension", strict_min_version: "109.0" },
    };
  }
  // Chrome/Edge/Brave: base manifest already has service_worker — no changes needed

  return manifest;
}

// Copy shared assets + per-target manifest into dist/chrome and dist/firefox
const staticAssets = [
  "popup/popup.html",
  "popup/popup.css",
];

for (const target of targets) {
  const out = join(root, "dist", target);

  // Copy bundled JS
  cpSync(shared, out, { recursive: true });

  // Copy static assets from src
  for (const asset of staticAssets) {
    const destPath = join(out, asset);
    mkdirSync(dirname(destPath), { recursive: true });
    cpSync(join(root, "src", asset), destPath);
  }

  // Write target-specific manifest
  writeFileSync(
    join(out, "manifest.json"),
    JSON.stringify(makeManifest(target), null, 2)
  );

  // Placeholder icons
  const iconDir = join(out, "icons");
  mkdirSync(iconDir, { recursive: true });
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
  ]);
  for (const size of [16, 48, 128]) {
    writeFileSync(join(iconDir, `icon${size}.png`), pngHeader);
  }
}

// Clean up shared temp
import { rmSync } from "fs";
rmSync(shared, { recursive: true });

console.log("Build complete → dist/chrome, dist/firefox");
