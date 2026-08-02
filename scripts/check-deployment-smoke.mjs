const rawUrl = (process.env.PRODUCTION_URL ?? "").trim();
const timeoutMs = Number.parseInt(process.env.DEPLOYMENT_SMOKE_TIMEOUT_MS ?? "10000", 10);

if (!rawUrl) {
  console.error("- PRODUCTION_URL is missing");
  process.exit(1);
}

let baseUrl;
try {
  baseUrl = new URL(rawUrl);
} catch (error) {
  console.error(`- PRODUCTION_URL is invalid: ${error.message}`);
  process.exit(1);
}

if (baseUrl.protocol !== "https:") {
  console.error("- PRODUCTION_URL must use HTTPS");
  process.exit(1);
}
if (baseUrl.username || baseUrl.password || baseUrl.search || baseUrl.hash) {
  console.error("- PRODUCTION_URL must not contain credentials, a query string or a fragment");
  process.exit(1);
}
if (!Number.isFinite(timeoutMs) || timeoutMs < 1000 || timeoutMs > 60000) {
  console.error("- DEPLOYMENT_SMOKE_TIMEOUT_MS must be between 1000 and 60000");
  process.exit(1);
}

baseUrl.pathname = `${baseUrl.pathname.replace(/\/$/, "")}/`;

const checks = [
  { path: "/", contentType: "text/html" },
  { path: "/login", contentType: "text/html", privateCache: true },
  { path: "/blog", contentType: "text/html" },
  { path: "/legal/privacy", contentType: "text/html" },
  { path: "/health.json", contentType: "application/json", health: true },
];
const failures = [];

for (const check of checks) {
  const target = new URL(check.path.replace(/^\//, ""), baseUrl);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(target, {
      redirect: "error",
      signal: controller.signal,
      headers: { "User-Agent": "Haccora-Deployment-Smoke/1.0" },
    });
    const body = await response.text();
    const contentType = response.headers.get("content-type") ?? "";
    const cacheControl = response.headers.get("cache-control") ?? "";

    if (response.status !== 200) {
      failures.push(`${check.path}: expected 200, received ${response.status}`);
    }
    if (!contentType.toLowerCase().startsWith(check.contentType)) {
      failures.push(
        `${check.path}: expected ${check.contentType}, received ${contentType || "none"}`,
      );
    }
    if (/"message"\s*:\s*"HTTPError"/.test(body)) {
      failures.push(`${check.path}: returned the generic HTTPError payload`);
    }
    if (response.headers.get("x-content-type-options")?.toLowerCase() !== "nosniff") {
      failures.push(`${check.path}: missing X-Content-Type-Options: nosniff`);
    }
    if (check.contentType === "text/html" && !response.headers.has("content-security-policy")) {
      failures.push(`${check.path}: missing Content-Security-Policy`);
    }
    if (check.privateCache && !/\bno-store\b/i.test(cacheControl)) {
      failures.push(`${check.path}: authenticated entry point is missing Cache-Control: no-store`);
    }

    if (check.health) {
      if (!/\bno-store\b/i.test(cacheControl)) {
        failures.push(`${check.path}: missing Cache-Control: no-store`);
      }
      try {
        const payload = JSON.parse(body);
        if (payload.status !== "ok" || payload.service !== "haccora-web") {
          failures.push(`${check.path}: health payload has an unexpected status or service`);
        }
      } catch {
        failures.push(`${check.path}: health payload is not valid JSON`);
      }
    }
  } catch (error) {
    const reason = error?.name === "AbortError" ? `timed out after ${timeoutMs} ms` : error.message;
    failures.push(`${check.path}: request failed (${reason})`);
  } finally {
    clearTimeout(timer);
  }
}

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Production deployment smoke test passed (${checks.length} routes).`);
