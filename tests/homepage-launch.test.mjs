import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = await readFile("src/routes/__root.tsx", "utf8");
const home = await readFile("src/routes/index.tsx", "utf8");
const platform = await readFile("src/routes/platform.tsx", "utf8");
const unlock = await readFile("src/routes/unlock.tsx", "utf8");
const login = await readFile("src/routes/login.tsx", "utf8");
const logo = await readFile("src/components/BrandLogo.tsx", "utf8");

test("the full platform landing page is the canonical homepage", () => {
  assert.match(home, /component: PlatformLanding/);
  assert.match(home, /https:\/\/haccora\.de\//);
  assert.match(platform, /export function PlatformLanding/);
  assert.match(platform, /href: "#video"/);
});

test("the revised German video and accessible captions are wired to the homepage", async () => {
  assert.match(platform, /src="\/media\/haccora-teaser-de\.mp4"/);
  assert.match(platform, /poster="\/media\/haccora-teaser-de-poster\.jpg"/);
  assert.match(platform, /kind="captions"/);
  assert.match(platform, /srcLang="de"/);
  await Promise.all([
    access("public/media/haccora-teaser-de.mp4"),
    access("public/media/haccora-teaser-de-poster.jpg"),
    access("public/media/haccora-teaser-de.vtt"),
  ]);
});

test("the promo access-word gate no longer controls the site", async () => {
  assert.doesNotMatch(root, /getGateState|PUBLIC_PREFIXES|to: "\/unlock"/);
  assert.match(unlock, /throw redirect\(\{ to: "\/" \}\)/);
  assert.match(platform, /throw redirect\(\{ to: "\/" \}\)/);
  assert.doesNotMatch(unlock, /password|Zugangswort|unlockSite/);
  await assert.rejects(access("src/lib/gate.functions.ts"));
});

test("the only remaining sign-in is the real account login", () => {
  assert.match(platform, /to="\/login"/);
  assert.match(login, /signInWithEmail\(email, password\)/);
  assert.doesNotMatch(login, /demo@|test@|password\s*[:=]\s*["'][^"']+["']/i);
});

test("the public wordmark does not depend on Lovable-only asset URLs", () => {
  assert.match(logo, /<svg/);
  assert.match(logo, /Sicher\. Sauber\. Nachweisbar\./);
  assert.match(logo, /Safe\. Clean\. Traceable\./);
  assert.doesNotMatch(logo, /__l5e|asset\.json/);
});
