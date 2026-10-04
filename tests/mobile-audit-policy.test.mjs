import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

import { evaluateAudit } from "../mobile/scripts/audit-production.mjs";

const beforeExpiry = new Date("2026-10-04T00:00:00Z");
const policy = JSON.parse(
  await readFile(
    new URL("../mobile/security/dependency-audit-exceptions.json", import.meta.url),
    "utf8",
  ),
);

const allowedImageSize = {
  severity: "high",
  via: [
    {
      name: "image-size",
      severity: "high",
      url: "https://github.com/advisories/GHSA-w3rx-r6r6-pgpr",
    },
    {
      name: "image-size",
      severity: "high",
      url: "https://github.com/advisories/GHSA-5p2g-fcmc-qvqq",
    },
  ],
};

test("mobile audit temporarily accepts only exact documented Metro advisories", () => {
  const result = evaluateAudit(
    {
      vulnerabilities: {
        "image-size": allowedImageSize,
        metro: { severity: "high", via: ["image-size"] },
      },
    },
    policy,
    beforeExpiry,
  );

  assert.equal(result.passed, true);
  assert.equal(result.exceptions.length, 2);
  assert.deepEqual(result.uncoveredDirect, []);
  assert.deepEqual(result.unexplainedChains, []);
  assert.deepEqual(result.expired, []);
});

test("mobile audit ignores moderate findings but fails closed for unknown high or critical", () => {
  const result = evaluateAudit(
    {
      vulnerabilities: {
        "image-size": allowedImageSize,
        moderatePackage: {
          severity: "moderate",
          via: [
            {
              name: "moderatePackage",
              severity: "moderate",
              url: "https://github.com/advisories/GHSA-MMMM-NNNN-OOOO",
            },
          ],
        },
        unexpected: {
          severity: "high",
          via: [
            {
              name: "unexpected",
              severity: "high",
              url: "https://github.com/advisories/GHSA-AAAA-BBBB-CCCC",
            },
          ],
        },
        criticalPackage: {
          severity: "critical",
          via: [
            {
              name: "criticalPackage",
              severity: "critical",
              url: "https://github.com/advisories/GHSA-DDDD-EEEE-FFFF",
            },
          ],
        },
      },
    },
    policy,
    beforeExpiry,
  );

  assert.equal(result.passed, false);
  assert.equal(result.uncoveredDirect.length, 2);
  assert(result.uncoveredDirect.some((entry) => entry.package === "unexpected"));
  assert(result.uncoveredDirect.some((entry) => entry.severity === "critical"));
  assert.equal(
    result.uncoveredDirect.some((entry) => entry.severity === "moderate"),
    false,
  );
});

test("mobile audit exceptions expire automatically", () => {
  const result = evaluateAudit(
    { vulnerabilities: { "image-size": allowedImageSize } },
    policy,
    new Date("2026-10-19T00:00:00Z"),
  );

  assert.equal(result.passed, false);
  assert.equal(result.expired.length, 2);
  assert(result.expired.every((entry) => entry.expiresOn === "2026-10-18"));
});
