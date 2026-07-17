import { createFileRoute, Outlet, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useAuth, canAccess, homeFor, type NavKey } from "@/lib/auth";
import {
  LayoutDashboard, ShieldCheck, ClipboardCheck, Thermometer, Sparkles,
  Wheat, Truck, Users, Gavel, Settings, ArrowLeft, Bell, Search, LogOut,
  ChevronDown, ChevronRight, AlertTriangle, CheckCircle2, Clock, Command,
  BellRing, CalendarClock, FileArchive, History,
  ListChecks, UtensilsCrossed, CalendarDays, Trash2, Boxes,
} from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppShell,
});

type NavItem = { to: string; icon: typeof LayoutDashboard; key: string; nav: NavKey; exact?: boolean };
type NavGroup = { labelKey: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    labelKey: "nav.group.overview",
    items: [
      { to: "/app",             icon: LayoutDashboard, key: "menu.dashboard",   nav: "dashboard", exact: true },
    ],
  },
  {
    labelKey: "nav.group.compliance",
    items: [
      { to: "/app/haccp",       icon: ShieldCheck,     key: "menu.haccp",       nav: "haccp" },
      { to: "/app/checks",      icon: ClipboardCheck,  key: "menu.checks",      nav: "checks" },
      { to: "/app/temperature", icon: Thermometer,     key: "menu.temperature", nav: "temperature" },
      { to: "/app/cleaning",    icon: Sparkles,        key: "menu.cleaning",    nav: "cleaning" },
    ],
  },
  {
    labelKey: "nav.group.kitchen",
    items: [
      { to: "/app/recipes",     icon: Wheat,           key: "menu.recipes",     nav: "recipes" },
      { to: "/app/suppliers",   icon: Truck,           key: "menu.suppliers",   nav: "suppliers" },
    ],
  },
  {
    labelKey: "nav.group.people",
    items: [
      { to: "/app/training",    icon: Users,           key: "menu.training",    nav: "training" },
    ],
  },
  {
    labelKey: "nav.group.records",
    items: [
      { to: "/app/alerts",      icon: BellRing,        key: "menu.alerts",      nav: "alerts" },
      { to: "/app/expiry",      icon: CalendarClock,   key: "menu.expiry",      nav: "expiry" },
      { to: "/app/documents",   icon: FileArchive,     key: "menu.documents",   nav: "documents" },
      { to: "/app/logs",        icon: History,         key: "menu.logs",        nav: "logs" },
    ],
  },
  {
    labelKey: "nav.group.audit",
    items: [
      { to: "/app/inspection",  icon: Gavel,           key: "menu.audit",       nav: "audit" },
    ],
  },
];

const ALL_ITEMS: NavItem[] = GROUPS.flatMap((g) => g.items);

function AppShell() {
  const { t } = useI18n();
  const { user, signOut, hydrated } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQ, setPaletteQ] = useState("");

  useEffect(() => {
    if (hydrated && !user) {
      navigate({ to: "/login", search: { redirect: pathname } as never });
    }
  }, [hydrated, user, navigate, pathname]);

  // Inspector-only accounts should never land on the ops dashboard.
  useEffect(() => {
    if (user?.role === "inspector" && pathname === "/app") {
      navigate({ to: "/app/inspection", replace: true });
    }
  }, [user, pathname, navigate]);

  // Enforce role gating on direct URL entry.
  useEffect(() => {
    if (!user) return;
    const PATH_KEY: Array<{ prefix: string; nav: NavKey }> = [
      { prefix: "/app/haccp",       nav: "haccp" },
      { prefix: "/app/checks",      nav: "checks" },
      { prefix: "/app/temperature", nav: "temperature" },
      { prefix: "/app/cleaning",    nav: "cleaning" },
      { prefix: "/app/recipes",     nav: "recipes" },
      { prefix: "/app/suppliers",   nav: "suppliers" },
      { prefix: "/app/training",    nav: "training" },
      { prefix: "/app/alerts",      nav: "alerts" },
      { prefix: "/app/expiry",      nav: "expiry" },
      { prefix: "/app/documents",   nav: "documents" },
      { prefix: "/app/logs",        nav: "logs" },
      { prefix: "/app/inspection",  nav: "audit" },
      { prefix: "/app/settings",    nav: "settings" },
    ];
    const match = PATH_KEY.find((p) => pathname === p.prefix || pathname.startsWith(p.prefix + "/"));
    if (match && !canAccess(user.role, match.nav)) {
      navigate({ to: homeFor(user.role) as never, replace: true });
    }
  }, [user, pathname, navigate]);


  // Global Cmd/Ctrl+K -> command palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") { setPaletteOpen(false); setNotifOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const visibleGroups = useMemo(() => {
    if (!user) return [];
    return GROUPS
      .map((g) => ({ ...g, items: g.items.filter((i) => canAccess(user.role, i.nav)) }))
      .filter((g) => g.items.length > 0);
  }, [user]);

  const visibleFlat = useMemo(
    () => (user ? ALL_ITEMS.filter((i) => canAccess(user.role, i.nav)) : []),
    [user]
  );

  if (!hydrated || !user) {
    return <div className="min-h-screen grid place-items-center bg-secondary/40 text-sm text-muted-foreground">…</div>;
  }

  const doSignOut = () => { signOut(); navigate({ to: "/login" }); };

  const current = ALL_ITEMS.find((i) => (i.exact ? pathname === i.to : pathname.startsWith(i.to) && (i.to !== "/app" || pathname === "/app")))
    ?? ALL_ITEMS.find((i) => !i.exact && pathname.startsWith(i.to));

  // Notifications — role-scoped demo signals.
  type Notif = { id: string; sev: "high" | "medium" | "low"; titleKey: string; metaKey: string; to: string };
  const ALL_NOTIFS: (Notif & { roles: Array<typeof user.role> })[] = [
    { id: "n1", sev: "high",   titleKey: "notif.temp.t",  metaKey: "notif.temp.m",  to: "/app/temperature", roles: ["owner","manager","chef","staff"] },
    { id: "n2", sev: "medium", titleKey: "notif.ifsg.t",  metaKey: "notif.ifsg.m",  to: "/app/training",    roles: ["owner","manager","staff"] },
    { id: "n3", sev: "low",    titleKey: "notif.clean.t", metaKey: "notif.clean.m", to: "/app/cleaning",    roles: ["owner","manager","chef","staff"] },
    { id: "n4", sev: "medium", titleKey: "notif.audit.t", metaKey: "notif.audit.m", to: "/app/inspection",  roles: ["owner","manager","inspector"] },
  ];
  const notifs = ALL_NOTIFS.filter((n) => n.roles.includes(user.role));

  // Command palette matches over role-allowed items.
  const q = paletteQ.trim().toLowerCase();
  const paletteResults = visibleFlat.filter((i) => !q || t(i.key).toLowerCase().includes(q));

  return (
    <div className="min-h-screen bg-secondary/40 flex flex-col">
      {/* Demo mode banner */}
      <div className="sticky top-0 z-40 bg-black text-white text-xs md:text-sm">
        <div className="px-4 md:px-6 h-9 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center rounded-full bg-[color:var(--color-alert-red)] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest shrink-0">
              {t("demo.tag")}
            </span>
            <span className="truncate text-white/80 hidden sm:inline">
              {t("demo.body").replace("{role}", t(`role.${user.role}`))}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              onClick={() => signOut()}
              className="hidden md:inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold hover:bg-white/10 transition"
            >
              {t("demo.switch")}
            </Link>
            <button
              onClick={() => { signOut(); navigate({ to: "/" }); }}
              className="inline-flex items-center gap-1 rounded-full bg-white text-black px-3 py-1 text-[11px] font-bold hover:bg-white/90 transition"
            >
              <LogOut size={12} /> {t("demo.exit")}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
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

        <nav className="p-3 flex-1 overflow-y-auto space-y-4">
          {visibleGroups.map((group) => (
            <div key={group.labelKey}>
              <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {t(group.labelKey)}
              </div>
              {group.items.map(({ to, icon: Icon, key, exact }) => {
                const active = exact ? pathname === to : pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to as never}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm mb-0.5 transition group relative ${
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon size={16} className={active ? "" : "opacity-70 group-hover:opacity-100"} />
                    <span className="flex-1 truncate">{t(key)}</span>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground/80" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-1">
          <button
            onClick={() => setPaletteOpen(true)}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition"
          >
            <Search size={16} /> <span className="flex-1 text-left">{t("nav.search")}</span>
            <kbd className="text-[10px] rounded border border-border bg-secondary px-1.5 py-0.5">⌘K</kbd>
          </button>
          {canAccess(user.role, "settings") && (
            <Link
              to="/app/settings"
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                pathname.startsWith("/app/settings") ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <Settings size={16} /> {t("menu.settings")}
            </Link>
          )}
          <button
            onClick={doSignOut}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition"
          >
            <LogOut size={16} /> {t("auth.signout")}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/85 backdrop-blur px-4 md:px-6 flex items-center justify-between gap-3">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 min-w-0">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground shrink-0">
              <ArrowLeft size={14} />
            </Link>
            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
              <Link to={homeFor(user.role) as never} className="text-muted-foreground hover:text-foreground truncate">
                {t("app.tag")}
              </Link>
              {current && (
                <>
                  <ChevronRight size={14} className="text-muted-foreground/60 shrink-0" />
                  <span className="font-semibold truncate">{t(current.key)}</span>
                </>
              )}
            </nav>
          </div>

          {/* Search trigger */}
          <button
            onClick={() => setPaletteOpen(true)}
            className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-8 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm text-muted-foreground hover:bg-secondary transition"
          >
            <Search size={14} />
            <span className="flex-1 text-left">{t("nav.search")}</span>
            <kbd className="text-[10px] rounded border border-border bg-secondary px-1.5 py-0.5 inline-flex items-center gap-0.5">
              <Command size={10} />K
            </kbd>
          </button>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <LanguageToggle />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => { setNotifOpen((v) => !v); setMenuOpen(false); }}
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card hover:bg-secondary transition"
                aria-label={t("notif.title")}
              >
                <Bell size={16} />
                {notifs.length > 0 && (
                  <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground grid place-items-center">
                    {notifs.length}
                  </span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-[22rem] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-card shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <div className="font-display text-sm">{t("notif.title")}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{notifs.length} {t("notif.new")}</div>
                    </div>
                    <div className="max-h-[26rem] overflow-y-auto divide-y divide-border">
                      {notifs.length === 0 && (
                        <div className="px-4 py-6 text-sm text-muted-foreground text-center">{t("notif.empty")}</div>
                      )}
                      {notifs.map((n) => (
                        <Link
                          key={n.id}
                          to={n.to as never}
                          onClick={() => setNotifOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-secondary transition"
                        >
                          {n.sev === "high"   && <AlertTriangle size={16} className="text-destructive mt-0.5 shrink-0" />}
                          {n.sev === "medium" && <Clock          size={16} className="text-warning-foreground mt-0.5 shrink-0" />}
                          {n.sev === "low"    && <CheckCircle2   size={16} className="text-muted-foreground mt-0.5 shrink-0" />}
                          <div className="min-w-0">
                            <div className="text-sm font-medium truncate">{t(n.titleKey)}</div>
                            <div className="text-xs text-muted-foreground truncate">{t(n.metaKey)}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to="/app/inspection"
                      onClick={() => setNotifOpen(false)}
                      className="block px-4 py-2.5 text-center text-xs font-semibold text-primary hover:bg-secondary border-t border-border"
                    >
                      {t("notif.viewAll")} →
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => { setMenuOpen((v) => !v); setNotifOpen(false); }}
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
                    {canAccess(user.role, "settings") && (
                      <Link
                        to="/app/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-secondary"
                      >
                        <Settings size={14} /> {t("menu.settings")}
                      </Link>
                    )}
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
          {visibleFlat.slice(0, 5).map(({ to, icon: Icon, key, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to);
            return (
              <Link key={to} to={to as never} className={`py-2.5 flex flex-col items-center gap-0.5 text-[10px] transition ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon size={18} /> {t(key)}
              </Link>
            );
          })}
        </nav>
      </div>
      </div>


      {/* Command palette */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm grid place-items-start pt-[10vh] px-4"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 border-b border-border">
              <Search size={16} className="text-muted-foreground" />
              <input
                autoFocus
                value={paletteQ}
                onChange={(e) => setPaletteQ(e.target.value)}
                placeholder={t("palette.placeholder")}
                className="flex-1 py-4 bg-transparent outline-none text-sm"
              />
              <kbd className="text-[10px] rounded border border-border bg-secondary px-1.5 py-0.5">ESC</kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto py-2">
              {paletteResults.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-muted-foreground">{t("palette.empty")}</div>
              )}
              {paletteResults.map(({ to, icon: Icon, key }) => (
                <button
                  key={to}
                  onClick={() => { setPaletteOpen(false); setPaletteQ(""); navigate({ to: to as never }); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition"
                >
                  <Icon size={16} className="text-muted-foreground" />
                  <span className="flex-1 text-left">{t(key)}</span>
                  <ChevronRight size={14} className="text-muted-foreground/60" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
