import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  ShieldCheck, ClipboardCheck, Thermometer, Wheat, Users, Scale,
  ArrowRight, CheckCircle2, FileCheck2, Sparkles, Building2, PhoneCall,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <Hero />
      <TrustBar />
      <Pillars />
      <InspectorSection />
      <ModuleShowcase />
      <Pricing />
      <Guarantee />
      <CtaFooter />
      <SiteFooter />
    </div>
  );
}

/* -------------------------------------------------- nav */
function SiteNav() {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-lg font-medium tracking-tight">GastroSafe</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#pillars" className="hover:text-foreground">{t("nav.modules")}</a>
          <a href="#inspector" className="hover:text-foreground">Inspector Mode</a>
          <a href="#pricing" className="hover:text-foreground">{t("nav.pricing")}</a>
          <a href="#regulation" className="hover:text-foreground">{t("nav.regulation")}</a>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link to="/app" className="hidden sm:inline-flex btn-outline text-sm py-2 px-4">
            {t("nav.demo")}
          </Link>
          <Link to="/app" className="btn-primary text-sm py-2 px-4">
            {t("nav.tryFree")}
          </Link>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
      <ShieldCheck size={18} strokeWidth={2.2} />
    </span>
  );
}

/* -------------------------------------------------- hero */
function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.97_0.03_155)] via-background to-[oklch(0.96_0.04_88)]" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[oklch(0.78_0.14_65_/_0.15)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[oklch(0.38_0.08_155_/_0.12)] blur-3xl" />
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
            <Sparkles size={12} /> {t("hero.eyebrow")}
          </div>
          <h1 className="mt-6 text-5xl md:text-7xl leading-[1.02] font-medium">
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/app" className="btn-primary">
              {t("hero.cta.primary")} <ArrowRight size={16} />
            </Link>
            <a href="#pricing" className="btn-outline">
              {t("hero.cta.secondary")}
            </a>
          </div>
          <p className="mt-8 text-sm text-muted-foreground max-w-lg">{t("hero.trust")}</p>
        </div>

        <HeroCard />
      </div>
    </section>
  );
}

function HeroCard() {
  const { t } = useI18n();
  return (
    <div className="mt-16 grid md:grid-cols-5 gap-6 items-stretch">
      <div className="md:col-span-3 surface p-6 md:p-8 grain">
        <div className="flex items-center justify-between">
          <div>
            <div className="eyebrow">GastroSafe · Dashboard</div>
            <h3 className="font-display text-2xl mt-1">Kreuzberg Kitchen — Berlin</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 text-success px-2.5 py-1 text-xs font-semibold">
            <CheckCircle2 size={14} /> Inspector-ready
          </span>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { v: "94%", l: t("dash.metric.score") },
            { v: "8", l: t("dash.metric.pending") },
            { v: "1", l: t("dash.metric.overdue") },
          ].map((m) => (
            <div key={m.l} className="rounded-lg border border-border bg-secondary/50 p-4">
              <div className="text-2xl font-display font-medium">{m.v}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.l}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2.5">
          {[
            { ok: true,  title: "Kühltemperaturen — Kühlhaus 1",  meta: "3,8 °C · Aylin" },
            { ok: false, title: "Kühlhaus 2 — Grenzwert überschritten", meta: "6,4 °C · Maßnahme offen" },
            { ok: true,  title: "Lieferkontrolle Metro",           meta: "Charge #A-2181 · Omar" },
            { ok: true,  title: "Reinigungsplan Küche",            meta: "Fotobeleg · Marta" },
          ].map((r) => (
            <div key={r.title} className="flex items-center gap-3 rounded-lg bg-background border border-border/70 px-3 py-2.5">
              <span className={`h-2 w-2 rounded-full ${r.ok ? "bg-success" : "bg-destructive"}`} />
              <div className="flex-1">
                <div className="text-sm font-medium">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.meta}</div>
              </div>
              <span className="text-xs text-muted-foreground">{r.ok ? "✓" : "!"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 flex flex-col gap-6">
        <div className="surface p-6">
          <div className="eyebrow">Inspector Mode</div>
          <p className="mt-3 text-sm">
            {t("inspector.body")}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <FileCheck2 size={14} className="text-primary" /> HACCP · Temperatur · Reinigung · Allergene · IfSG
          </div>
        </div>
        <div className="surface p-6 bg-primary text-primary-foreground border-primary">
          <div className="eyebrow !text-primary-foreground/70">Complete</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-5xl">€69</span>
            <span className="text-sm opacity-80">{t("pricing.perMonth")} · {t("pricing.perLocation")}</span>
          </div>
          <p className="mt-3 text-sm opacity-90">{t("pricing.plan.complete.desc")}</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- trust bar */
function TrustBar() {
  const { t } = useI18n();
  const stats = [
    { v: "1.200+", l: t("stats.locations") },
    { v: "3,8 M",  l: t("stats.checks") },
    { v: "7",      l: t("stats.languages") },
    { v: "< 1 h",  l: t("stats.inspection") },
  ];
  return (
    <section className="border-y border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="font-display text-3xl md:text-4xl">{s.v}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------- pillars */
function Pillars() {
  const { t } = useI18n();
  const items = [
    { icon: ShieldCheck,    k: "haccp" },
    { icon: ClipboardCheck, k: "ops" },
    { icon: Wheat,          k: "recipes" },
    { icon: Users,          k: "team" },
    { icon: Scale,          k: "regulation" },
  ] as const;
  return (
    <section id="pillars" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <div className="eyebrow">Modules</div>
        <h2 className="mt-3 text-4xl md:text-5xl">{t("pillars.title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("pillars.subtitle")}</p>
      </div>
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map(({ icon: Icon, k }) => (
          <div key={k} className="group surface p-7 transition hover:shadow-[var(--shadow-elevated)] hover:-translate-y-0.5">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon size={22} />
            </div>
            <h3 className="mt-5 text-xl font-display">{t(`pillar.${k}.title`)}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(`pillar.${k}.body`)}</p>
          </div>
        ))}
        <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-7 flex flex-col justify-between">
          <div>
            <div className="eyebrow">+ AI Assistant</div>
            <p className="mt-3 text-sm text-foreground/80">
              „Welche Kontrollen sind heute fällig?", „Welche Gerichte enthalten Sesam?" —
              mit Zitat der zutreffenden Regel und ohne Auto-Änderung freigegebener HACCP-Pläne.
            </p>
          </div>
          <div className="mt-6 text-xs text-muted-foreground">Guardrails included by design.</div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- inspector */
function InspectorSection() {
  const { t } = useI18n();
  const items = ["plan","temp","clean","allergen","training","traceability"] as const;
  return (
    <section id="inspector" className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="eyebrow text-accent-foreground">{t("inspector.eyebrow")}</div>
            <h2 className="mt-3 text-4xl md:text-5xl">{t("inspector.title")}</h2>
            <p className="mt-5 text-muted-foreground max-w-xl">{t("inspector.body")}</p>
            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {items.map((k) => (
                <li key={k} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                  <span>{t(`inspector.item.${k}`)}</span>
                </li>
              ))}
            </ul>
            <Link to="/app/inspection" className="btn-primary mt-8">
              {t("inspector.cta")} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="surface p-6 md:p-8 bg-forest-deep text-primary-foreground border-transparent">
            <div className="flex items-center justify-between">
              <div className="eyebrow !text-primary-foreground/70">Read-only · Behördenansicht</div>
              <span className="text-xs opacity-70">DE</span>
            </div>
            <h3 className="mt-3 font-display text-2xl">Nachweispaket — Juli 2026</h3>
            <p className="mt-1 text-sm opacity-80">Kreuzberg Kitchen · Bezirksamt Friedrichshain-Kreuzberg</p>

            <div className="mt-6 divide-y divide-white/10">
              {[
                ["HACCP-Plan v3", "Freigegeben 12.06.2026 · A. Yılmaz"],
                ["Temperaturhistorie", "218 Messungen · 1 Abweichung behoben"],
                ["Reinigungsnachweise", "94 Einträge · Fotobelege"],
                ["Allergenmatrix", "42 Rezepte · 14 Allergene"],
                ["IfSG §§42–43", "12/12 Mitarbeitende · gültig"],
                ["Rückverfolgbarkeit", "Lieferant → Charge → Portion"],
              ].map(([a, b]) => (
                <div key={a} className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-sm font-medium">{a}</div>
                    <div className="text-xs opacity-70">{b}</div>
                  </div>
                  <CheckCircle2 size={18} className="text-accent" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- module showcase */
function ModuleShowcase() {
  return (
    <section id="regulation" className="bg-secondary/50 border-y border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-24 md:py-32 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="eyebrow">German regulatory layer</div>
          <h2 className="mt-3 text-4xl">Built for the German inspector.</h2>
          <p className="mt-4 text-muted-foreground">
            Behördenfinder für Berlin und NRW, EU 852/2004, 178/2002, 1169/2011,
            IfSG-Tracker, LMHV-Matrix, LFGB-Bezug — alles versioniert und mit
            Handlungscheckliste bei Rechtsänderungen.
          </p>
        </div>
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
          {[
            { title: "Berlin Bezirksämter", body: "12 Bezirke · Kontakte, Formulare, Zuständigkeit." },
            { title: "NRW Kreise/Städte",   body: "396 Kommunen · Registrierung und Änderungsmeldung." },
            { title: "EU 852/2004",         body: "HACCP-Rahmen mit Übersetzung in Ihre Prozesse." },
            { title: "EU 1169/2011",        body: "14 Allergene automatisch aus Rezeptdaten." },
            { title: "IfSG §§42–43",        body: "Fristen, Belehrungen, Wiederholungen." },
            { title: "LMHV",                body: "Schulungsmatrix je Rolle und Standort." },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                <h4 className="font-medium">{c.title}</h4>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------- pricing */
function Pricing() {
  const { t } = useI18n();
  const plans = [
    { k: "solo",         price: "€39",  featured: false },
    { k: "complete",     price: "€69",  featured: true },
    { k: "completePlus", price: "€99",  featured: false },
    { k: "group",        price: "€179", featured: false },
    { k: "growing",      price: "€349", featured: false },
    { k: "enterprise",   price: "€699+", featured: false },
  ] as const;
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <div className="eyebrow">{t("pricing.eyebrow")}</div>
        <h2 className="mt-3 text-4xl md:text-5xl">{t("pricing.title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("pricing.subtitle")}</p>
      </div>
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {plans.map((p) => (
          <div
            key={p.k}
            className={`rounded-2xl border p-7 relative ${
              p.featured
                ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-elevated)]"
                : "bg-card border-border"
            }`}
          >
            {p.featured && (
              <span className="absolute -top-3 left-6 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
                {t("pricing.featured")}
              </span>
            )}
            <h3 className={`font-display text-2xl ${p.featured ? "" : ""}`}>
              {t(`pricing.plan.${p.k}`)}
            </h3>
            <p className={`text-sm mt-1 ${p.featured ? "opacity-80" : "text-muted-foreground"}`}>
              {t(`pricing.plan.${p.k}.desc`)}
            </p>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-5xl">{p.price}</span>
              <span className={`text-sm ${p.featured ? "opacity-80" : "text-muted-foreground"}`}>
                {t("pricing.perMonth")}
              </span>
            </div>
            <Link
              to="/app"
              className={`mt-6 inline-flex w-full items-center justify-center rounded-full py-2.5 text-sm font-medium transition ${
                p.featured
                  ? "bg-accent text-accent-foreground hover:brightness-95"
                  : "bg-primary text-primary-foreground hover:brightness-110"
              }`}
            >
              {t("pricing.cta")}
            </Link>
          </div>
        ))}
      </div>
      <p className="mt-10 max-w-3xl text-sm text-muted-foreground">
        {t("pricing.promise")}
      </p>
    </section>
  );
}

/* -------------------------------------------------- guarantee */
function Guarantee() {
  const { t } = useI18n();
  return (
    <section className="bg-forest-deep text-primary-foreground">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="eyebrow !text-primary-foreground/70">Compliance Promise</div>
        <h2 className="mt-3 text-3xl md:text-4xl">{t("guarantee.title")}</h2>
        <p className="mt-4 opacity-80 max-w-2xl mx-auto">{t("guarantee.body")}</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------- cta */
function CtaFooter() {
  const { t } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 md:py-32">
      <div className="surface p-10 md:p-14 flex flex-col md:flex-row md:items-center gap-8 justify-between">
        <div className="max-w-xl">
          <h2 className="text-4xl">{t("cta.title")}</h2>
          <p className="mt-3 text-muted-foreground">{t("cta.body")}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/app" className="btn-primary">{t("cta.primary")} <ArrowRight size={16} /></Link>
          <a href="mailto:sales@gastrosafe.de" className="btn-outline"><PhoneCall size={16} /> {t("cta.secondary")}</a>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-base text-foreground">GastroSafe</span>
          <span className="mx-2 hidden md:inline">·</span>
          <span className="hidden md:inline">{t("brand.tag")}</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">{t("footer.imprint")}</a>
          <a href="#" className="hover:text-foreground">{t("footer.privacy")}</a>
          <a href="#" className="hover:text-foreground">{t("footer.terms")}</a>
        </div>
        <div>{t("footer.rights")}</div>
      </div>
    </footer>
  );
}
