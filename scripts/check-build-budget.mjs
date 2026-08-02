import { readdir, stat } from "node:fs/promises";
import path from "node:path";

const assetsDirectory = path.resolve(
  process.env.HACCORA_BUILD_ASSETS_DIR || ".output/public/assets",
);
const maximumJavaScriptBytes = 500 * 1024;
const failures = [];

for (const file of await readdir(assetsDirectory)) {
  if (!/\.(?:js|mjs)$/.test(file)) continue;
  const size = (await stat(path.join(assetsDirectory, file))).size;
  if (size > maximumJavaScriptBytes) {
    failures.push(`${file}: ${(size / 1024).toFixed(1)} KiB exceeds 500 KiB`);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Production JavaScript bundle budget passed (maximum 500 KiB per chunk).");
