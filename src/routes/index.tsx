import { createFileRoute } from "@tanstack/react-router";

import { PlatformLanding } from "./platform";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Haccora — Digitale Lebensmittelsicherheit für Deutschland" },
      {
        name: "description",
        content:
          "Haccora bündelt HACCP, Temperaturen, Reinigung, Allergene, Schulungen und Prüfungsnachweise für deutsche Lebensmittelbetriebe.",
      },
      { property: "og:title", content: "Haccora — Sicher. Sauber. Nachweisbar." },
      {
        property: "og:description",
        content:
          "Eine Plattform für HACCP, Betrieb, Schulung und Prüfungsnachweise in Deutschland.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://haccora.de/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://haccora.de/" }],
  }),
  component: PlatformLanding,
});
