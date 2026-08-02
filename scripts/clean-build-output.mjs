import { rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputDirectory = path.resolve(root, ".output");

if (path.relative(root, outputDirectory) !== ".output") {
  console.error("Refusing to clean an unexpected build output path");
  process.exit(1);
}

await rm(outputDirectory, { recursive: true, force: true });
console.log("Removed stale production build output.");
