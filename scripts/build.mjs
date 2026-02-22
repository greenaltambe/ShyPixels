import * as esbuild from "esbuild";
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

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
    minify: true,
  }),
  esbuild.build({
    entryPoints: [`${root}/src/background/background.ts`],
    bundle: true,
    outfile: `${shared}/background/background.js`,
    format: "esm",
    target: "es2020",
    minify: true,
  }),
  esbuild.build({
    entryPoints: [`${root}/src/popup/popup.ts`],
    bundle: true,
    outfile: `${shared}/popup/popup.js`,
    format: "iife",
    target: "es2020",
    minify: true,
  }),
  esbuild.build({
    entryPoints: [`${root}/src/pages/import.ts`],
    bundle: true,
    outfile: `${shared}/pages/import.js`,
    format: "iife",
    target: "es2020",
    minify: true,
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
      gecko: { id: "shypixels@extension", strict_min_version: "112.0", data_collection_permissions: { required: [], optional: [] } },
    };
  }
  // Chrome/Edge/Brave: base manifest already has service_worker — no changes needed

  return manifest;
}

// Copy shared assets + per-target manifest into dist/chrome and dist/firefox
const staticAssets = [
  "popup/popup.html",
  "popup/popup.css",
  "pages/import.html",
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

  // Generate icons from icon.png
  const iconDir = join(out, "icons");
  mkdirSync(iconDir, { recursive: true });
  const iconSrc = join(root, "icon.png");
  if (existsSync(iconSrc)) {
    for (const size of [16, 48, 128]) {
      await sharp(iconSrc).resize(size, size).png().toFile(join(iconDir, `icon${size}.png`));
    }
  }
}

// Clean up shared temp
rmSync(shared, { recursive: true });

console.log("Build complete → dist/chrome, dist/firefox");
