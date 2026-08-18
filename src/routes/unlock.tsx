import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { KeyRound, ArrowLeft, Loader2 } from "lucide-react";

import { unlockSite } from "@/lib/gate.functions";
import { useI18n } from "@/lib/i18n";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageToggle } from "@/components/LanguageToggle";

export const Route = createFileRoute("/unlock")({
  head: () => ({
    meta: [
      { title: "Zugang — Haccora" },
      {
        name: "description",
        content: "Geschützter Zugang zur Haccora Plattform während der Promo-Phase.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Zugang — Haccora" },
      { property: "og:description", content: "Geschützter Zugang zur Haccora Plattform." },
    ],
  }),
  component: UnlockPage,
});

const COPY = {
  de: {
    title: "Geschützter Bereich",
    body: "Die vollständige Haccora Plattform ist während der Promo-Phase mit einem Zugangswort geschützt.",
    label: "Zugangswort",
    submit: "Freischalten",
    error: "Zugangswort nicht korrekt.",
    back: "Zurück zur Startseite",
  },
  en: {
    title: "Protected area",
    body: "The full Haccora platform is protected with an access word during the promo phase.",
    label: "Access word",
    submit: "Unlock",
    error: "That access word is not correct.",
    back: "Back to the home page",
  },
} as const;

function UnlockPage() {
  const { lang } = useI18n();
  const c = COPY[lang];
  const router = useRouter();
  const unlock = useServerFn(unlockSite);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(false);
    try {
      const result = await unlock({ data: { password } });
      if (result.ok) {
        await router.invalidate();
        await router.navigate({ to: "/platform" });
        return;
      }
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="mx-auto w-full max-w-[1400px] px-4 md:px-8 h-24 flex items-center justify-between">
        <BrandLogo to="/" onDark imgClassName="h-14 md:h-16 w-auto" />
        <LanguageToggle />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_40px_90px_-50px_rgba(0,0,0,0.9)]">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[color:var(--color-alert-red)] text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.3)]">
            <KeyRound size={24} strokeWidth={2.2} />
          </span>
          <h1 className="mt-6 display-black text-3xl">{c.title}</h1>
          <p className="mt-3 text-sm text-white/65 leading-relaxed">{c.body}</p>
          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="site-password" className="text-xs font-black uppercase tracking-widest text-white/60">
                {c.label}
              </label>
              <input
                id="site-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-white outline-none focus:border-[color:var(--color-alert-red-on-dark)]"
                required
              />
            </div>
            {error ? (
              <p className="text-sm font-bold text-[color:var(--color-alert-red-on-dark)]">
                {c.error}
              </p>
            ) : null}
            <button type="submit" disabled={busy} className="btn-red w-full justify-center">
              {busy ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
              {c.submit}
            </button>
          </form>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <ArrowLeft size={15} /> {c.back}
          </Link>
        </div>
      </main>
    </div>
  );
}
