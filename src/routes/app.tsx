import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  LayoutDashboard, ShieldCheck, ClipboardCheck, Thermometer, Sparkles,
  Wheat, Truck, Users, Gavel, Settings, ArrowLeft, Bell, Search,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

type NavItem = { to: string; icon: typeof LayoutDashboard; key: string; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/app",             icon: LayoutDashboard, key: "menu.dashboard", exact: true },
  { to: "/app/haccp",       icon: ShieldCheck,     key: "menu.haccp" },
  { to: "/app/checks",      icon: ClipboardCheck,  key: "menu.checks" },
  { to: "/app/temperature", icon: Thermometer,     key: "menu.temperature" },
  { to: "/app/cleaning",    icon: Sparkles,        key: "menu.cleaning" },
  { to: "/app/recipes",     icon: Wheat,           key: "menu.recipes" },
  { to: "/app/suppliers",   icon: Truck,           key: "menu.suppliers" },
  { to: "/app/training",    icon: Users,           key: "menu.training" },
  { to: "/app/inspection",  icon: Gavel,           key: "menu.audit" },
];

function AppShell() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-secondary/40 flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card">
        <div className="px-5 h-16 flex items-center gap-2 border-b border-border">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck size={18} />
          </span>
          <div className="leading-tight">
            <div className="font-display text-base">GastroSafe</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("app.tag")}</div>
          </div>
        </div>
        <nav className="p-3 flex-1 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, key, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
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
        <div className="p-3 border-t border-border">
          <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
            <Settings size={16} /> {t("menu.settings")}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur px-6 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft size={16} /> {t("nav.about")}
          </Link>
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8">
            <div className="flex items-center gap-2 w-full rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground">
              <Search size={14} /> <span>Suchen · Search</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <button className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>
            <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-semibold">AY</div>
          </div>
        </header>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

        {/* mobile bottom nav */}
        <nav className="md:hidden sticky bottom-0 z-30 grid grid-cols-5 border-t border-border bg-card">
          {NAV.slice(0, 5).map(({ to, icon: Icon, key, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link key={to} to={to} className={`py-2.5 flex flex-col items-center gap-0.5 text-[10px] ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon size={18} /> {t(key)}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
