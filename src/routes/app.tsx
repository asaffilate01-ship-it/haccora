import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useAuth, canAccess, type NavKey } from "@/lib/auth";
import {
  LayoutDashboard, ShieldCheck, ClipboardCheck, Thermometer, Sparkles,
  Wheat, Truck, Users, Gavel, Settings, ArrowLeft, Bell, Search, LogOut, ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

type NavItem = { to: string; icon: typeof LayoutDashboard; key: string; nav: NavKey; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/app",             icon: LayoutDashboard, key: "menu.dashboard",   nav: "dashboard", exact: true },
  { to: "/app/haccp",       icon: ShieldCheck,     key: "menu.haccp",       nav: "haccp" },
  { to: "/app/checks",      icon: ClipboardCheck,  key: "menu.checks",      nav: "checks" },
  { to: "/app/temperature", icon: Thermometer,     key: "menu.temperature", nav: "temperature" },
  { to: "/app/cleaning",    icon: Sparkles,        key: "menu.cleaning",    nav: "cleaning" },
  { to: "/app/recipes",     icon: Wheat,           key: "menu.recipes",     nav: "recipes" },
  { to: "/app/suppliers",   icon: Truck,           key: "menu.suppliers",   nav: "suppliers" },
  { to: "/app/training",    icon: Users,           key: "menu.training",    nav: "training" },
  { to: "/app/inspection",  icon: Gavel,           key: "menu.audit",       nav: "audit" },
];

function AppShell() {
  const { t } = useI18n();
  const { user, signOut, hydrated } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (hydrated && !user) {
      navigate({ to: "/login", search: { redirect: pathname } as never });
    }
  }, [hydrated, user, navigate, pathname]);

  if (!hydrated || !user) {
    return <div className="min-h-screen grid place-items-center bg-secondary/40 text-sm text-muted-foreground">…</div>;
  }

  const visible = NAV.filter((n) => canAccess(user.role, n.nav));
  const doSignOut = () => { signOut(); navigate({ to: "/login" }); };

  return (
    <div className="min-h-screen bg-secondary/40 flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="px-5 h-16 flex items-center gap-2 border-b border-border">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck size={18} />
          </span>
          <div className="leading-tight min-w-0">
            <div className="font-display text-base">GastroSafe</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground truncate">{t(`role.${user.role}`)}</div>
          </div>
        </div>
        <nav className="p-3 flex-1 overflow-y-auto">
          {visible.map(({ to, icon: Icon, key, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to as never}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm mb-0.5 transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon size={16} /> {t(key)}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-1">
          {user.role !== "staff" && user.role !== "inspector" && (
            <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
              <Settings size={16} /> {t("menu.settings")}
            </button>
          )}
          <button
            onClick={doSignOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary"
          >
            <LogOut size={16} /> {t("auth.signout")}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur px-4 md:px-6 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground shrink-0">
            <ArrowLeft size={16} /> <span className="hidden sm:inline">{t("nav.about")}</span>
          </Link>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
            <div className="flex items-center gap-2 w-full rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground">
              <Search size={14} /> <span>Suchen · Search</span>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <LanguageToggle />
            <button className="relative hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-border bg-card pl-1 pr-3 py-1 hover:bg-secondary transition"
              >
                <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-bold">
                  {user.initials}
                </span>
                <span className="hidden sm:block text-left leading-tight">
                  <span className="block text-xs font-bold">{user.name}</span>
                  <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">{t(`role.${user.role}`)}</span>
                </span>
                <ChevronDown size={14} className="text-muted-foreground" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("auth.signedInAs")}</div>
                      <div className="mt-1 text-sm font-semibold">{user.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                      <div className="mt-1.5 inline-flex items-center rounded-full bg-[color:var(--color-alert-red)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[color:var(--color-alert-red)]">
                        {t(`role.${user.role}`)}
                      </div>
                    </div>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary"
                    >
                      <Users size={14} /> {t("auth.switch")}
                    </Link>
                    <button
                      onClick={doSignOut}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[color:var(--color-alert-red)] hover:bg-secondary"
                    >
                      <LogOut size={14} /> {t("auth.signout")}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

        <nav className="md:hidden sticky bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card">
          {visible.slice(0, 5).map(({ to, icon: Icon, key, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link key={to} to={to as never} className={`py-2.5 flex flex-col items-center gap-0.5 text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon size={18} /> {t(key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
