import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { RELEASE_SHA, RELEASE_VERIFIED } from "./lib/release";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

function withSecurityHeaders(response: Response, request: Request): Response {
  const headers = new Headers(response.headers);
  const requestUrl = new URL(request.url);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(self), geolocation=(self), microphone=(), payment=(), usb=()",
  );
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Resource-Policy", "same-site");
  if (RELEASE_VERIFIED) headers.set("X-Haccora-Release", RELEASE_SHA);
  headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "object-src 'none'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "worker-src 'self' blob:",
      "manifest-src 'self'",
      "upgrade-insecure-requests",
    ].join("; "),
  );
  if (requestUrl.protocol === "https:") {
    headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  if (
    requestUrl.pathname.startsWith("/app") ||
    requestUrl.pathname.startsWith("/login") ||
    requestUrl.pathname.startsWith("/onboarding")
  ) {
    headers.set("Cache-Control", "no-store, private");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

async function handleFetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
  try {
    const handler = await getServerEntry();
    const response = await handler.fetch(request, env, ctx);
    return withSecurityHeaders(await normalizeCatastrophicSsrResponse(response), request);
  } catch (error) {
    console.error(error);
    return withSecurityHeaders(
      new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      }),
      request,
    );
  }
}

// Some hosts (and h3) invoke the server entry as a plain function rather than
// reading `.fetch`, so the default export must be callable AND expose `fetch`.
const serverEntry = Object.assign(
  async function serverHandler(...args: unknown[]): Promise<unknown> {
    const [first, second, third] = args;
    if (first instanceof Request) return handleFetch(first, second, third);

    const entry = (await getServerEntry()) as unknown;
    if (typeof entry === "function") return (entry as (...a: unknown[]) => unknown)(...args);
    return (entry as ServerEntry).fetch(first as Request, second, third);
  },
  { fetch: handleFetch },
);

export default serverEntry;

