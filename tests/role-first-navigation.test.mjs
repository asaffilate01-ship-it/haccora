import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const shell = readFileSync(new URL("../src/routes/app.tsx", import.meta.url), "utf8");

test("German role-first shell parses as TSX", () => {
  const result = ts.transpileModule(shell, {
    fileName: "app.tsx",
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
  });
  const errors = (result.diagnostics ?? []).filter((entry) => entry.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, errors.map((entry) => entry.messageText).join("\n"));
});

test("every role gets task-first shortcuts with existing role permission filtering", () => {
  for (const role of ["owner", "manager", "chef", "staff", "inspector"])
    assert.match(shell, new RegExp(`\\b${role}: \\[`));
  assert.match(shell, /ROLE_QUICK_PATHS\[user\.role\]/);
  assert.match(shell, /visibleFlat\.find\(\(item\) => item\.to === path\)/);
  assert.match(shell, /canAccess\(user\.role, i\.nav, user\.inspectorScopes\)/);
  assert.match(shell, /inspector: \["\/app\/inspection"/);
  assert.doesNotMatch(shell, /inspector: \[[^\]]*"\/app\/checks"/);
});

test("advanced tools remain discoverable without duplicating task shortcuts", () => {
  assert.match(shell, /secondaryGroups/);
  assert.match(shell, /!quickPaths\.has\(item\.to\)/);
  assert.match(shell, /expandedGroups\.includes\(group\.labelKey\) \|\| groupActive/);
  assert.match(shell, /haccora-de-nav-groups-v1/);
  assert.match(shell, /aria-expanded=\{expanded\}/);
  assert.match(shell, /Schnellzugriff/);
  assert.match(shell, /Weitere Funktionen/);
});

test("mobile navigation stays visible with role-specific destinations and escape recovery", () => {
  assert.match(shell, /const PREFERRED = ROLE_QUICK_PATHS\[role\]/);
  assert.match(shell, /gridTemplateColumns: `repeat\(\$\{pinned\.length \+ 1\}/);
  assert.match(shell, /fixed inset-x-0 bottom-0/);
  assert.match(shell, /pb-20 md:pb-0/);
  assert.match(shell, /aria-current=\{active \? "page" : undefined\}/);
  assert.match(shell, /role="dialog"/);
  assert.match(shell, /aria-modal="true"/);
  assert.match(shell, /event\.key === "Escape"/);
});
