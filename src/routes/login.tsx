import { createFileRoute, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useAuth, ROLES, type Role } from "@/lib/auth";
import {
  Crown, ClipboardList, ChefHat, User, Gavel, ArrowRight, ShieldCheck, ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — GastroSafe" },
      { name: "description", content: "Sign in to GastroSafe. Role-based dashboards for owners, managers, chefs, staff and food safety inspectors." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

const ROLE_ICON: Record<Role, typeof Crown> = {
  owner: Crown,
  manager: ClipboardList,
  chef: ChefHat,
  staff: User,
  inspector: Gavel,
};

function LoginPage() {
  const { t } = useI18n();
  const { user, signIn, hydrated } = useAuth();
  const navigate = useNavigate();
  const search = useRouterState({ select: (s) => s.location.search }) as { redirect?: string };

  useEffect(() => {
    if (hydrated && user) {
      navigate({ to: (search?.redirect as string) || "/app" });
    }
  }, [hydrated, user, navigate, search]);

  const pick = (role: Role) => {
    signIn(role);
    navigate({ to: role === "inspector" ? "/app/inspection" : "/app" });
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="bg-black text-white">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 h-16 md:h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--color-alert-red)] text-white">
              <ShieldCheck size={18} />
            </span>
            <span className="font-display text-2xl md:text-3xl tracking-tight text-white">
              Gastro<span className="text-[color:var(--color-alert-red)]">Safe</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle variant="dark" />
            <Link to="/" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white">
              <ArrowLeft size={14} /> {t("auth.back")}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1100px] px-4 md:px-8 py-12 md:py-20">
        <div className="max-w-2xl">
          <div className="text-xs font-black uppercase tracking-[0.18em] text-[color:var(--color-alert-red)]">
            {t("auth.demo")}
          </div>
          <h1 className="mt-3 font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
            {t("auth.title")}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            {t("auth.sub")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {ROLES.map((role) => {
            const Icon = ROLE_ICON[role];
            return (
              <button
                key={role}
                onClick={() => pick(role)}
                className="group text-left rounded-2xl border border-black/10 bg-white p-6 hover:border-[color:var(--color-alert-red)] hover:shadow-[0_20px_60px_-30px_rgba(228,63,44,0.4)] transition"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[color:var(--color-alert-red)]/10 text-[color:var(--color-alert-red)]">
                    <Icon size={22} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-xl">{t(`role.${role}`)}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{t(`role.${role}.desc`)}</p>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[color:var(--color-alert-red)] group-hover:gap-2 transition-all">
                      {t("auth.continue").replace("{role}", t(`role.${role}`))}
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
