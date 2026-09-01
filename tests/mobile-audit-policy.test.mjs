import assert from "node:assert/strict";
import test from "node:test";

import { evaluateAudit } from "../mobile/scripts/audit-production.mjs";

const beforeExpiry = new Date("2026-09-01T00:00:00Z");
const allowedImageSize = {
  severity: "high",
  via: [
    { severity: "high", url: "https://github.com/advisories/GHSA-w3rx-r6r6-pgpr" },
    { severity: "high", url: "https://github.com/advisories/GHSA-5p2g-fcmc-qvqq" },
  ],
};

test("mobile audit temporarily accepts only the documented Metro image parser chain", () => {
  const result = evaluateAudit(
    {
      vulnerabilities: {
        "image-size": allowedImageSize,
        metro: { severity: "high", via: ["image-size"] },
      },
    },
    beforeExpiry,
  );
  assert.deepEqual(result.failures, []);
  assert.deepEqual(result.allowed.sort(), ["image-size", "metro"]);
});

test("mobile audit fails closed for another high or any critical finding", () => {
  const result = evaluateAudit(
    {
      vulnerabilities: {
        "image-size": allowedImageSize,
        unexpected: { severity: "high", via: [] },
        criticalPackage: { severity: "critical", via: [] },
      },
    },
    beforeExpiry,
  );
  assert.equal(result.failures.length, 2);
});

test("mobile audit allowlist expires automatically", () => {
  const result = evaluateAudit(
    { vulnerabilities: { "image-size": allowedImageSize } },
    new Date("2026-10-01T00:00:00Z"),
  );
  assert.match(result.failures.join("\n"), /expired/);
});
