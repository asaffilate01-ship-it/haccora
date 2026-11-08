import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";

const page = readFileSync(new URL("../src/routes/app.alerts.tsx", import.meta.url), "utf8");

test("German alert centre parses as TSX", () => {
  const output = ts.transpileModule(page, {
    fileName: "app.alerts.tsx",
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
  });
  const errors = (output.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  assert.equal(errors.length, 0);
});

test("Germany alert failures never become a false all-clear", () => {
  assert.match(page, /readState === "unavailable"/);
  assert.match(page, /readState === "loading"/);
  assert.match(page, /error \|\| !Array\.isArray\(data\)/);
  assert.match(page, /requestVersion\.current/);
  assert.match(page, /Keine Entwarnung möglich/);
  assert.match(page, /No safety clearance can be inferred/);
  assert.match(page, /limit\(100\)/);
  assert.doesNotMatch(page, /Keine Alerts\. Perfekt\.|No alerts\. All clear\./);
});

test("acknowledgement failure remains visible and must be verified", () => {
  assert.match(page, /\.select\("id"\)/);
  assert.match(page, /\.maybeSingle\(\)/);
  assert.match(page, /if \(error \|\| !data\?\.id\)/);
  assert.match(page, /writeError &&/);
  assert.match(page, /Lesestatus nicht bestätigt/);
  assert.match(page, /readState === "ready" && unread > 0/);
});
