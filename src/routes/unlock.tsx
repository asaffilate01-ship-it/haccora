import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Legacy promo links now resolve to the public homepage. The former
 * access-word/demo gate is intentionally no longer rendered.
 */
export const Route = createFileRoute("/unlock")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
  component: () => null,
});
