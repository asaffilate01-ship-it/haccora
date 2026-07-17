import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

const KEY = "gs-cookie-consent";

type Consent = { necessary: true; preferences: boolean; statistics: boolean; ts: number };

export function CookieBanner() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [stats, setStats] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) setOpen(true);
    } catch { setOpen(true); }
  }, []);

  const save = (c: Consent) => {
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* noop */ }
    setOpen(false);
  };
  const acceptAll  = () => save({ necessary: true, preferences: true, statistics: true, ts: Date.now() });
  const rejectAll  = () => save({ necessary: true, preferences: false, statistics: false, ts: Date.now() });
  const saveChosen = () => save({ necessary: true, preferences: prefs, statistics: stats, ts: Date.now() });

  if (!open) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 md:px-6 md:pb-6">
      <div className="mx-auto max-w-[1200px] rounded-2xl border border-black/10 bg-white shadow-2xl p-5 md:p-6">
        <div className="grid md:grid-cols-[minmax(0,1fr)_auto] gap-4 items-start">
          <div>
            <h2 className="font-display text-lg md:text-xl">{t("cookie.title")}</h2>
            <p className="mt-1 text-sm text-black/70 leading-relaxed">
              {t("cookie.body")}{" "}
              <Link to="/legal/cookies" className="underline">{t("footer.cookies")}</Link>{" · "}
              <Link to="/legal/privacy" className="underline">{t("footer.privacy")}</Link>
            </p>
            {showDetails && (
              <div className="mt-4 grid gap-2 text-sm">
                <label className="flex items-start gap-2 opacity-60">
                  <input type="checkbox" checked readOnly className="mt-1" />
                  <span><strong>{t("cookie.cat.necessary")}</strong> — {t("cookie.cat.necessary.desc")}</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={prefs} onChange={(e) => setPrefs(e.target.checked)} className="mt-1" />
                  <span><strong>{t("cookie.cat.prefs")}</strong> — {t("cookie.cat.prefs.desc")}</span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" checked={stats} onChange={(e) => setStats(e.target.checked)} className="mt-1" />
                  <span><strong>{t("cookie.cat.stats")}</strong> — {t("cookie.cat.stats.desc")}</span>
                </label>
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
            <button onClick={rejectAll} className="text-xs font-bold px-3 py-2 rounded-full border border-black/15 hover:bg-black/5">
              {t("cookie.reject")}
            </button>
            {showDetails && (
              <button onClick={saveChosen} className="text-xs font-black px-4 py-2 rounded-full bg-black text-white hover:bg-black/85">
                {t("cookie.save")}
              </button>
            )}
            <button onClick={acceptAll} className="text-xs font-black px-4 py-2 rounded-full bg-[color:var(--color-alert-green)] text-white hover:brightness-110">
              {t("cookie.accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
