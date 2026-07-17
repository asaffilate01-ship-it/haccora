import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "@/components/LanguageToggle";
import {
  Search, Phone, ArrowRight, ChevronRight,
  FileText, Clock, AlertTriangle, ShieldCheck, ClipboardCheck,
  Thermometer, Wheat, Users, Scale, CheckCircle2, Building2,
} from "lucide-react";
import heroChef from "@/assets/hero-chef.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GastroSafe — Food safety software for German gastronomy" },
      {
        name: "description",
        content:
          "Simplify HACCP, temperature, cleaning, allergens, staff compliance and inspection prep — one bilingual platform built for German food businesses.",
      },
      { property: "og:title", content: "GastroSafe — Food safety software for Germany" },
      { property: "og:description", content: "HACCP, IfSG, LMHV and inspector-ready evidence in one platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <TopBar />
      <SubNav />
      <Hero />
      <Support360 />
      <ModulePillars />
      <InspectorBand />
      <Regulation />
      <Pricing />
      <CtaFooter />
      <SiteFooter />
    </div>
  );
}

/* ────────────────────────────────────────────── top bar (black) */
function TopBar() {
  const { t } = useI18n();
  return (
    <div className="bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 h-16 md:h-20 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <span className="font-display text-2xl md:text-3xl tracking-tight text-white">
            Gastro<span className="text-[color:var(--color-alert-red)]">Safe</span>
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="hidden md:flex items-center h-10 rounded-full bg-white/8 border border-white/12 px-4 min-w-[220px]">
            <Search size={14} className="text-white/60" />
            <input
              placeholder={t("nav.search") ?? "Search"}
              className="ml-2 bg-transparent text-sm placeholder:text-white/50 outline-none w-full"
            />
          </div>
          <LanguageToggle variant="dark" />
          <Link to="/app" className="btn-red-outline hidden sm:inline-flex">
            {t("nav.login") ?? "Login"}
          </Link>
          <a href="#contact" className="btn-red">
            {t("nav.contact") ?? "Contact Us"}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── sub nav (white) */
function SubNav() {
  const { t } = useI18n();
  const links = [
    { href: "#pillars", label: t("nav.modules") ?? "Food Safety Software" },
    { href: "#regulation", label: t("nav.regulation") ?? "Regulation" },
    { href: "#inspector", label: "Inspector Mode" },
    { href: "#pricing", label: t("nav.pricing") ?? "Pricing" },
  ];
  return (
    <div className="border-b border-black/10 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 h-14 flex items-center justify-between gap-4 overflow-x-auto">
        <nav className="flex items-center gap-6 md:gap-10 text-[0.95rem] font-bold text-black whitespace-nowrap">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[color:var(--color-alert-red)] transition">
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="tel:+49301234567"
          className="hidden md:inline-flex items-center gap-2 text-black font-black text-lg"
        >
          <Phone size={16} className="text-[color:var(--color-alert-red)]" /> 030 1234 567
        </a>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────── hero (red→orange) */
function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden bg-black">
      {/* photo layer */}
      <div className="absolute inset-0">
        <img
          src={heroChef}
          alt=""
          width={1600}
          height={1200}
          className="w-full h-full object-cover object-[center_30%]"
        />
        {/* red-orange overlay bleeding from bottom-left */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 30%, rgba(255,90,40,0.55) 60%, rgba(255,60,25,0.92) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,60,25,0) 0%, rgba(255,60,25,0.85) 60%, rgba(255,50,15,1) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8 pt-16 md:pt-24 pb-24 md:pb-40">
        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-10 md:gap-16 items-start">
          <div className="text-white">
            <h1 className="display-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.4rem]">
              {t("hero.title")}
            </h1>
            <p className="mt-7 max-w-xl text-base md:text-lg text-white/90 leading-relaxed">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-3 rounded-2xl bg-black/70 backdrop-blur-sm px-4 py-3 text-sm">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  ▶
                </span>
                <span className="leading-tight">
                  <span className="block font-bold">{t("hero.video.title") ?? "Watch how we can support your business"}</span>
                  <span className="block text-[color:var(--color-alert-green)] text-xs font-bold tracking-widest mt-0.5">
                    PLAY NOW
                  </span>
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-black text-xs font-bold">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-black text-white text-[10px]">★</span>
                REVIEWS<span className="text-[color:var(--color-alert-red)]">.io</span>
                <span className="mx-2 h-4 w-px bg-black/15" />
                Read our <span className="text-[color:var(--color-alert-red)]">5 star</span> reviews
              </div>
            </div>
          </div>

          <ContactCard />
        </div>
      </div>
    </section>
  );
}

function ContactCard() {
  const { t } = useI18n();
  return (
    <form
      id="contact"
      onSubmit={(e) => e.preventDefault()}
      className="rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-black/5"
    >
      <h3 className="display-black text-2xl md:text-3xl text-black text-center">
        {t("contact.title") ?? "Get More Information"}
      </h3>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <input placeholder={t("contact.first") ?? "First Name"} className="fld" />
        <input placeholder={t("contact.last") ?? "Last Name"} className="fld" />
      </div>
      <div className="mt-3 grid gap-3">
        <input type="email" placeholder={t("contact.email") ?? "Email Address"} className="fld" />
        <input placeholder={t("contact.phone") ?? "Phone Number"} className="fld" />
        <input placeholder={t("contact.business") ?? "Business Name"} className="fld" />
      </div>
      <button type="submit" className="btn-primary w-full mt-5 uppercase tracking-widest text-sm">
        {t("contact.cta") ?? "Get In Touch"}
      </button>
      <p className="mt-3 text-[11px] text-black/50 text-center">
        {t("contact.legal") ?? "By submitting this form, you agree to our privacy policy."}
      </p>
    </form>
  );
}

/* ────────────────────────────────────────────── 360° support (white cards on gradient) */
function Support360() {
  const { t } = useI18n();
  const items = [
    { icon: FileText, k: "docs", title: t("s360.docs.t") ?? "Digital records", body: t("s360.docs.b") ?? "HACCP, checklists and evidence — all in one place." },
    { icon: Clock, k: "realtime", title: t("s360.time.t") ?? "24/7 monitoring", body: t("s360.time.b") ?? "Temperature and task alerts around the clock." },
    { icon: AlertTriangle, k: "alerts", title: t("s360.alert.t") ?? "Incident response", body: t("s360.alert.b") ?? "Corrective actions with photo evidence and sign-off." },
  ];
  return (
    <section className="relative alert-gradient text-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 pt-16 pb-24 md:pt-20 md:pb-32">
        <h2 className="display-black text-4xl md:text-6xl text-center text-black">
          360° <span className="text-white">{t("s360.title") ?? "food health & safety support"}</span>
        </h2>
        <div className="mt-12 md:mt-16 grid md:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, k, title, body }) => (
            <div key={k} className="card-polished p-8 md:p-10 text-black">
              <span className="icon-3d">
                <Icon size={30} strokeWidth={2.4} />
              </span>
              <h3 className="display-black text-2xl md:text-3xl mt-6">{title}</h3>
              <p className="mt-3 text-black/70 text-sm leading-relaxed">{body}</p>
              <a href="#pillars" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-[color:var(--color-alert-red)]">
                {t("s360.more") ?? "Learn more"} <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────── module pillars */
function ModulePillars() {
  const { t } = useI18n();
  const items = [
    { icon: ShieldCheck, k: "haccp" },
    { icon: ClipboardCheck, k: "ops" },
    { icon: Thermometer, k: "temp" },
    { icon: Wheat, k: "recipes" },
    { icon: Users, k: "team" },
    { icon: Scale, k: "regulation" },
  ] as const;

  return (
    <section id="pillars" className="bg-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="eyebrow">{t("pillars.eyebrow") ?? "The Platform"}</div>
          <h2 className="mt-4 display-black text-4xl md:text-6xl">
            {t("pillars.title")}
          </h2>
          <p className="mt-5 text-black/60 max-w-2xl">{t("pillars.subtitle")}</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(({ icon: Icon, k }) => (
            <div
              key={k}
              className="group relative rounded-2xl border border-black/10 bg-white p-8 hover:border-black transition"
            >
              <div className="flex items-start justify-between">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-alert-red)]/10 text-[color:var(--color-alert-red)]">
                  <Icon size={24} strokeWidth={2.2} />
                </div>
                <ChevronRight size={18} className="text-black/30 group-hover:text-[color:var(--color-alert-red)] transition" />
              </div>
              <h3 className="mt-6 display-black text-xl md:text-2xl">
                {t(`pillar.${k}.title`) ?? k}
              </h3>
              <p className="mt-3 text-sm text-black/60 leading-relaxed">
                {t(`pillar.${k}.body`) ?? ""}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────── inspector band (black) */
function InspectorBand() {
  const { t } = useI18n();
  const items = ["plan", "temp", "clean", "allergen", "training", "traceability"] as const;
  return (
    <section id="inspector" className="bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-24 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
          <div>
            <div className="text-[color:var(--color-alert-red)] uppercase tracking-widest text-xs font-black">
              {t("inspector.eyebrow") ?? "Inspector Mode"}
            </div>
            <h2 className="mt-4 display-black text-4xl md:text-6xl">
              {t("inspector.title")}
            </h2>
            <p className="mt-5 text-white/70 max-w-xl">{t("inspector.body")}</p>
            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {items.map((k) => (
                <li key={k} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 size={18} className="text-[color:var(--color-alert-green)] shrink-0 mt-0.5" />
                  <span>{t(`inspector.item.${k}`)}</span>
                </li>
              ))}
            </ul>
            <Link to="/app/inspection" className="btn-red mt-9">
              {t("inspector.cta")} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="rounded-3xl bg-white text-black p-6 md:p-8 border-4 border-[color:var(--color-alert-red)]/80">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black uppercase tracking-widest text-[color:var(--color-alert-red)]">
                Read-only · Behördenansicht
              </div>
              <span className="text-xs font-bold text-black/60">DE</span>
            </div>
            <h3 className="mt-3 display-black text-2xl md:text-3xl">
              Nachweispaket — Juli 2026
            </h3>
            <p className="mt-1 text-sm text-black/60">
              Kreuzberg Kitchen · Bezirksamt Friedrichshain-Kreuzberg
            </p>

            <div className="mt-6 divide-y divide-black/10">
              {[
                ["HACCP-Plan v3", "Freigegeben 12.06.2026 · A. Yılmaz"],
                ["Temperaturhistorie", "218 Messungen · 1 Abweichung behoben"],
                ["Reinigungsnachweise", "94 Einträge · Fotobelege"],
                ["Allergenmatrix", "42 Rezepte · 14 Allergene"],
                ["IfSG §§42–43", "12/12 Mitarbeitende · gültig"],
                ["Rückverfolgbarkeit", "Lieferant → Charge → Portion"],
              ].map(([a, b]) => (
                <div key={a} className="flex items-center justify-between py-3">
                  <div className="min-w-0">
                    <div className="text-sm font-bold truncate">{a}</div>
                    <div className="text-xs text-black/55 truncate">{b}</div>
                  </div>
                  <CheckCircle2 size={18} className="text-[color:var(--color-alert-green)] shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────── regulation */
function Regulation() {
  const { t } = useI18n();
  const cards = [
    { title: "Berlin Bezirksämter", body: "12 Bezirke · Kontakte, Formulare, Zuständigkeit." },
    { title: "NRW Kreise/Städte", body: "396 Kommunen · Registrierung und Änderungsmeldung." },
    { title: "EU 852/2004", body: "HACCP-Rahmen mit Übersetzung in Ihre Prozesse." },
    { title: "EU 1169/2011", body: "14 Allergene automatisch aus Rezeptdaten." },
    { title: "IfSG §§42–43", body: "Fristen, Belehrungen, Wiederholungen." },
    { title: "LMHV", body: "Schulungsmatrix je Rolle und Standort." },
  ];
  return (
    <section id="regulation" className="bg-[color:var(--color-cream)]">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-24 md:py-32 grid md:grid-cols-3 gap-10 md:gap-16">
        <div className="md:col-span-1">
          <div className="eyebrow">{t("reg.eyebrow") ?? "German regulatory layer"}</div>
          <h2 className="mt-4 display-black text-3xl md:text-5xl">
            {t("reg.title") ?? "Built for the German inspector."}
          </h2>
          <p className="mt-5 text-black/60">
            {t("reg.body") ??
              "Behördenfinder für Berlin und NRW, EU 852/2004, 178/2002, 1169/2011, IfSG-Tracker, LMHV-Matrix, LFGB-Bezug — versioniert und mit Handlungscheckliste bei Rechtsänderungen."}
          </p>
        </div>
        <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
          {cards.map((c) => (
            <div key={c.title} className="rounded-2xl bg-white border border-black/10 p-6">
              <div className="flex items-center gap-2">
                <Building2 size={16} className="text-[color:var(--color-alert-red)]" />
                <h4 className="font-black text-base">{c.title}</h4>
              </div>
              <p className="mt-2 text-sm text-black/60">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────── pricing */
function Pricing() {
  const { t } = useI18n();
  const plans = [
    { k: "solo", price: "€39", featured: false },
    { k: "complete", price: "€69", featured: true },
    { k: "completePlus", price: "€99", featured: false },
    { k: "group", price: "€179", featured: false },
    { k: "growing", price: "€349", featured: false },
    { k: "enterprise", price: "€699+", featured: false },
  ] as const;
  return (
    <section id="pricing" className="bg-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-24 md:py-32">
        <div className="max-w-3xl">
          <div className="eyebrow">{t("pricing.eyebrow") ?? "Plans"}</div>
          <h2 className="mt-4 display-black text-4xl md:text-6xl">{t("pricing.title")}</h2>
          <p className="mt-5 text-black/60">{t("pricing.subtitle")}</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div
              key={p.k}
              className={`relative rounded-2xl p-8 ${
                p.featured
                  ? "bg-black text-white ring-4 ring-[color:var(--color-alert-red)]/60"
                  : "bg-white border border-black/10 text-black"
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-6 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase text-white bg-[color:var(--color-alert-red)]">
                  {t("pricing.featured") ?? "Most Popular"}
                </span>
              )}
              <h3 className="display-black text-2xl">{t(`pricing.plan.${p.k}`)}</h3>
              <p className={`text-sm mt-2 ${p.featured ? "text-white/70" : "text-black/60"}`}>
                {t(`pricing.plan.${p.k}.desc`)}
              </p>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="display-black text-5xl">{p.price}</span>
                <span className={`text-sm ${p.featured ? "text-white/70" : "text-black/60"}`}>
                  {t("pricing.perMonth")}
                </span>
              </div>
              <Link
                to="/app"
                className={`mt-7 inline-flex w-full items-center justify-center rounded-full py-3 text-sm font-black tracking-wider uppercase transition ${
                  p.featured
                    ? "bg-[color:var(--color-alert-green)] text-white hover:brightness-110"
                    : "bg-black text-white hover:bg-[color:var(--color-alert-red)]"
                }`}
              >
                {t("pricing.cta")}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────── cta */
function CtaFooter() {
  const { t } = useI18n();
  return (
    <section className="alert-gradient text-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-20 md:py-28 grid md:grid-cols-[minmax(0,1fr)_auto] gap-8 items-center">
        <h2 className="display-black text-4xl md:text-6xl">{t("cta.title")}</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/app" className="btn-primary">
            {t("cta.primary")} <ArrowRight size={16} />
          </Link>
          <a href="#contact" className="btn-red-outline">
            {t("cta.secondary")}
          </a>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="bg-black text-white/70">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="font-display text-2xl text-white">
            Gastro<span className="text-[color:var(--color-alert-red)]">Safe</span>
          </div>
          <p className="mt-3 text-white/50 text-xs leading-relaxed max-w-xs">{t("brand.tag")}</p>
        </div>
        <div>
          <div className="text-white text-xs font-black uppercase tracking-widest">Platform</div>
          <ul className="mt-3 space-y-2">
            <li><a href="#pillars" className="hover:text-white">{t("nav.modules")}</a></li>
            <li><a href="#inspector" className="hover:text-white">Inspector Mode</a></li>
            <li><a href="#regulation" className="hover:text-white">{t("nav.regulation")}</a></li>
            <li><a href="#pricing" className="hover:text-white">{t("nav.pricing")}</a></li>
          </ul>
        </div>
        <div>
          <div className="text-white text-xs font-black uppercase tracking-widest">Support</div>
          <ul className="mt-3 space-y-2">
            <li><a href="#" className="hover:text-white">Help centre</a></li>
            <li><a href="#" className="hover:text-white">API</a></li>
            <li><a href="#" className="hover:text-white">Status</a></li>
          </ul>
        </div>
        <div>
          <div className="text-white text-xs font-black uppercase tracking-widest">Legal</div>
          <ul className="mt-3 space-y-2">
            <li><a href="#" className="hover:text-white">{t("footer.imprint")}</a></li>
            <li><a href="#" className="hover:text-white">{t("footer.privacy")}</a></li>
            <li><a href="#" className="hover:text-white">{t("footer.terms")}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-5 text-xs text-white/40">
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
