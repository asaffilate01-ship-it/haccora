import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import {
  ACCEPT_ALL,
  NECESSARY_ONLY,
  applyConsent,
  readConsent,
  writeConsent,
  type ConsentCategories,
} from "@/lib/cookie-consent";

export function CookieBanner() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [choice, setChoice] = useState<ConsentCategories>(NECESSARY_ONLY);

  useEffect(() => {
    const stored = readConsent();
    if (stored) {
      applyConsent(stored);
      setChoice({
        necessary: true,
        preferences: stored.preferences,
        statistics: stored.statistics,
      });
    } else {
      setOpen(true);
    }

    const reopen = () => {
      const current = readConsent();
      if (current)
        setChoice({
          necessary: true,
          preferences: current.preferences,
          statistics: current.statistics,
        });
      setShowDetails(true);
      setOpen(true);
    };
    window.addEventListener("haccora-cookie-settings", reopen);
    return () => window.removeEventListener("haccora-cookie-settings", reopen);
  }, []);

  const commit = (categories: ConsentCategories) => {
    writeConsent(categories);
    setChoice(categories);
    setOpen(false);
    setShowDetails(false);
  };

  if (!open) return null;

  const categories = [
    ["necessary", "cookie.cat.necessary", "cookie.cat.necessary.desc", true],
    ["preferences", "cookie.cat.prefs", "cookie.cat.prefs.desc", false],
    ["statistics", "cookie.cat.stats", "cookie.cat.stats.desc", false],
  ] as const;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("cookie.title")}
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 md:px-6 md:pb-6"
    >
      <div className="mx-auto max-w-[1200px] rounded-2xl border border-black/10 bg-white shadow-2xl p-5 md:p-6">
        <div className="grid md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-start">
          <div>
            <h2 className="font-display text-lg md:text-xl">{t("cookie.title")}</h2>
            <p className="mt-1 text-sm text-black/70 leading-relaxed">
              {t("cookie.body")}{" "}
              <Link to="/legal/cookies" className="underline">
                {t("footer.cookies")}
              </Link>
              {" · "}
              <Link to="/legal/privacy" className="underline">
                {t("footer.privacy")}
              </Link>
              {" · "}
              <Link to="/legal/imprint" className="underline">
                {t("footer.imprint")}
              </Link>
            </p>
            {showDetails && (
              <div className="mt-4 grid gap-3 text-sm">
                {categories.map(([key, title, desc, locked]) => (
                  <label
                    key={key}
                    className={`flex items-start gap-2 ${locked ? "opacity-60" : ""}`}
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={locked ? true : choice[key]}
                      readOnly={locked}
                      disabled={locked}
                      onChange={(event) =>
                        !locked && setChoice((c) => ({ ...c, [key]: event.target.checked }))
                      }
                    />
                    <span>
                      <strong>{t(title)}</strong> — {t(desc)}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2 md:justify-end">
            <button
              onClick={() => setShowDetails((s) => !s)}
              className="text-xs font-bold px-3 py-2 rounded-full border border-black/15 hover:bg-black/5"
            >
              {t("cookie.customize")}
            </button>
            <button
              onClick={() => commit(NECESSARY_ONLY)}
              className="text-xs font-bold px-3 py-2 rounded-full border border-black/15 hover:bg-black/5"
            >
              {t("cookie.reject")}
            </button>
            {showDetails && (
              <button
                onClick={() => commit(choice)}
                className="text-xs font-bold px-4 py-2 rounded-full border border-black/60 hover:bg-black/5"
              >
                {t("cookie.save")}
              </button>
            )}
            <button
              onClick={() => commit(ACCEPT_ALL)}
              className="text-xs font-black px-4 py-2 rounded-full bg-[color:var(--color-alert-green)] text-white hover:brightness-110"
            >
              {t("cookie.accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
