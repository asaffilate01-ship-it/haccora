import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/health.json")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(
          { status: "ok", service: "haccora-web" },
          {
            headers: {
              "Cache-Control": "no-store",
              "X-Content-Type-Options": "nosniff",
            },
          },
        ),
    },
  },
});
