import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth, canAccess, ROLES, type Role } from "@/lib/auth";
import { ACTION_GROUPS, ACTION_LABEL_DE, ACTION_LABEL_EN, ROLE_ACTIONS, type Action } from "@/lib/permissions";
import { Settings as SettingsIcon, Bell, Globe2, Shield, LogOut, RefreshCw, Mail, KeyRound, Check, X } from "lucide-react";


export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — GastroSafe" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t, lang, setLang } = useI18n();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [digest, setDigest] = useState(false);

  useEffect(() => {
    if (user && !canAccess(user.role, "settings")) {
      navigate({ to: "/app", replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const resetDemo = () => {
    try {
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith("gs-") && k !== "gs-auth" && k !== "gs-lang") localStorage.removeItem(k);
      });
    } catch { /* noop */ }
    window.location.reload();
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-4xl">
      <div>
        <div className="eyebrow">{t("app.tag")}</div>
        <h1 className="mt-1 text-3xl md:text-4xl flex items-center gap-3">
          <SettingsIcon size={28} /> {t("settings.title")}
        </h1>
        <p className="text-muted-foreground mt-1">{t("settings.sub")}</p>
      </div>

      {/* Profile */}
      <section className="surface p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield size={18} className="text-primary" />
          <h2 className="font-display text-lg">{t("settings.profile")}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label={t("settings.name")} value={user.name} />
          <Field label={t("settings.email")} value={user.email} />
          <Field label={t("settings.role")} value={t(`role.${user.role}`)} />
          <Field label={t("settings.location")} value={user.location} />
        </div>
      </section>

      {/* Language */}
      <section className="surface p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe2 size={18} className="text-primary" />
          <h2 className="font-display text-lg">{t("settings.language")}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{t("settings.language.hint")}</p>
        <div className="flex gap-2">
          {(["de","en"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition ${
                lang === l
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/70"
              }`}
            >
              {l === "de" ? "Deutsch" : "English"}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="surface p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={18} className="text-primary" />
          <h2 className="font-display text-lg">{t("settings.notifications")}</h2>
        </div>
        <div className="divide-y divide-border">
          <Toggle
            icon={<Mail size={16} />}
            label={t("settings.n.email")}
            hint={t("settings.n.email.hint")}
            checked={emailAlerts}
            onChange={setEmailAlerts}
          />
          <Toggle
            icon={<Bell size={16} />}
            label={t("settings.n.push")}
            hint={t("settings.n.push.hint")}
            checked={pushAlerts}
            onChange={setPushAlerts}
          />
          <Toggle
            icon={<RefreshCw size={16} />}
            label={t("settings.n.digest")}
            hint={t("settings.n.digest.hint")}
            checked={digest}
            onChange={setDigest}
          />
        </div>
      </section>

      {/* Danger */}
      <section className="surface p-6 border border-destructive/30">
        <h2 className="font-display text-lg text-destructive">{t("settings.danger")}</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-4">{t("settings.danger.body")}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={resetDemo}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary transition"
          >
            <RefreshCw size={14} /> {t("settings.reset")}
          </button>
          <button
            onClick={() => { signOut(); navigate({ to: "/login" }); }}
            className="inline-flex items-center gap-2 rounded-full bg-destructive text-destructive-foreground px-4 py-2 text-sm font-semibold hover:brightness-110 transition"
          >
            <LogOut size={14} /> {t("auth.signout")}
          </button>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary transition"
          >
            {t("auth.switch")}
          </Link>
        </div>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

function Toggle({ icon, label, hint, checked, onChange }: {
  icon: React.ReactNode; label: string; hint: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-4 py-3 cursor-pointer">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-6 rounded-full transition ${checked ? "bg-primary" : "bg-secondary"}`}
        role="switch"
        aria-checked={checked}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${checked ? "translate-x-4" : ""}`} />
      </button>
    </label>
  );
}
