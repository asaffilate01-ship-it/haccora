import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { openCookieSettings } from "@/lib/cookie-consent";
import {
  ArrowRight,
  Thermometer,
  ClipboardCheck,
  Wheat,
  Users,
  ShieldCheck,
  Boxes,
  Truck,
  GraduationCap,
  FileText,
  Bell,
  Smartphone,
  Server,
  Lock,
  CheckCircle2,
  Plus,
  Minus,
  Home,
  LayoutGrid,
  HelpCircle,
  KeyRound,
  Sparkles,
  BarChart3,
  Camera,
  WifiOff,
} from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageToggle } from "@/components/LanguageToggle";
import promoHero from "@/assets/promo-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Haccora — Digitale Lebensmittelsicherheit für die Gastronomie" },
      {
        name: "description",
        content:
          "Haccora bündelt HACCP, Temperatur, Reinigung, Allergene, Schulungen und Prüfungsnachweise in einer zweisprachigen Plattform für deutsche Lebensmittelbetriebe.",
      },
      { property: "og:title", content: "Haccora — Sicher. Sauber. Nachweisbar." },
      {
        property: "og:description",
        content:
          "Eine Plattform für HACCP, Betrieb, Einkauf, Schulung und behördliche Prüfungen in Deutschland.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PromoHome,
});

/* ─────────────────────────────── bilingual promo copy (kept strictly separate) */
const COPY = {
  de: {
    navProduct: "Plattform",
    navModules: "Module",
    navApp: "App",
    navFaq: "FAQ",
    access: "Zugang",
    eyebrow: "Sicher. Sauber. Nachweisbar.",
    heroTitle: "Digitale Lebensmittel\u00ADsicherheit für die deutsche Gastronomie",
    heroBody:
      "HACCP, Temperaturen, Reinigung, Allergene, Einkauf, Schulungen und Prüfungsnachweise — vollständig digital, zweisprachig und jederzeit prüfbereit.",
    ctaPrimary: "Zugang anfordern",
    ctaSecondary: "Module ansehen",
    chips: ["DSGVO & Hosting in der EU", "HACCP nach LMHV", "§43 IfSG Nachweise", "Inspector Mode"],
    statsTitle: "Was Haccora abdeckt",
    stats: [
      { v: "40+", l: "Betriebsmodule" },
      { v: "5", l: "Rollen mit eigenen Dashboards" },
      { v: "2", l: "Sprachen, sauber getrennt" },
      { v: "100 %", l: "Prüfnachweise digital" },
    ],
    modulesEyebrow: "Fünf Produkte in einem",
    modulesTitle: "Alles, was Ihr Betrieb täglich braucht",
    modulesBody:
      "Von der Temperaturmessung bis zur behördlichen Prüfung: jeder Schritt wird zeit-, datums- und benutzergestempelt dokumentiert.",
    showcaseEyebrow: "Einblick",
    showcaseTitle: "Web-Plattform und native App",
    showcaseBody:
      "Dieselben Daten am Desktop, auf dem Tablet in der Küche und mobil unterwegs — offlinefähig, mit Foto- und Geo-Nachweis.",
    shotWeb: "Web-Plattform",
    shotWebDesc: "Dashboards, Auswertungen und Prüfberichte für Inhaber und Leitung.",
    shotApp: "Mobile App",
    shotAppDesc: "Erfassung in Sekunden direkt am Kühlhaus, mit Foto- und Standortnachweis.",
    rolesEyebrow: "Rollen & Rechte",
    rolesTitle: "Jede Rolle sieht genau das Richtige",
    roles: [
      { r: "Inhaber", d: "Kosten, Compliance-Score, Standorte und Abrechnung im Blick." },
      { r: "Leitung", d: "Aufgaben, Personal, Abweichungen und Korrekturmaßnahmen steuern." },
      { r: "Küchenchef", d: "Rezepte, Allergene, Wareneingang, Temperaturen und HACCP-Abläufe." },
      { r: "Team", d: "Klare Tagesliste, Erfassung in Sekunden, keine Ablenkung." },
      { r: "Prüfer", d: "Lesegeschützter Zugang mit befristetem Umfang und Nachweisexport." },
    ],
    platformEyebrow: "Plattform",
    platformTitle: "Gebaut für den harten Küchenalltag",
    platform: [
      { t: "Native App & PWA", d: "iOS, Android und installierbare Web-App mit Bottom-Navigation." },
      { t: "Offlinefähig", d: "Erfassung ohne Netz, automatische Synchronisierung danach." },
      { t: "Foto- & Geo-Nachweis", d: "Jeder Nachweis mit Zeitstempel, Standort und Person." },
      { t: "Hosting in der EU", d: "DSGVO-konform, verschlüsselt, mit revisionssicherem Protokoll." },
    ],
    faqTitle: "Häufige Fragen",
    faq: [
      {
        q: "Warum ist der Rest der Seite geschützt?",
        a: "Die Plattform befindet sich in einer geschlossenen Promo-Phase. Mit dem Zugangswort öffnen Sie die vollständige Website, den Login und die App.",
      },
      {
        q: "Ersetzt Haccora meine Papierunterlagen?",
        a: "Ja. Alle Kontrollen, Temperaturen, Reinigungspläne und Nachweise werden digital und revisionssicher geführt und lassen sich als Prüfbericht exportieren.",
      },
      {
        q: "Ist Haccora für die deutsche Lebensmittelaufsicht geeignet?",
        a: "Haccora bildet HACCP nach LMHV, §43 IfSG-Belehrungen, Rückverfolgbarkeit, Schädlingsmonitoring und Kalibrierung ab und stellt Prüfern einen eigenen Lesezugang bereit.",
      },
      {
        q: "Funktioniert die App auch ohne Internet?",
        a: "Ja. Einträge werden lokal gespeichert und automatisch synchronisiert, sobald wieder eine Verbindung besteht.",
      },
      {
        q: "In welchen Sprachen ist Haccora verfügbar?",
        a: "Deutsch ist die Standardsprache. Englisch lässt sich jederzeit umschalten — beide Sprachen sind vollständig voneinander getrennt.",
      },
    ],
    ctaTitle: "Bereit für einen prüfbereiten Betrieb?",
    ctaBody: "Fordern Sie Ihr Zugangswort an und sehen Sie die vollständige Plattform.",
    footerTag: "Digitale Lebensmittelsicherheit für Deutschland",
    bottomHome: "Start",
    bottomModules: "Module",
    bottomApp: "App",
    bottomFaq: "FAQ",
    bottomAccess: "Zugang",
  },
  en: {
    navProduct: "Platform",
    navModules: "Modules",
    navApp: "App",
    navFaq: "FAQ",
    access: "Access",
    eyebrow: "Safe. Clean. Compliant.",
    heroTitle: "Digital food safety for professional kitchens",
    heroBody:
      "HACCP, temperatures, cleaning, allergens, purchasing, training and inspection evidence — fully digital, bilingual and always inspection-ready.",
    ctaPrimary: "Request access",
    ctaSecondary: "See the modules",
    chips: ["GDPR & EU hosting", "HACCP under LMHV", "§43 IfSG records", "Inspector mode"],
    statsTitle: "What Haccora covers",
    stats: [
      { v: "40+", l: "Operational modules" },
      { v: "5", l: "Roles with their own dashboards" },
      { v: "2", l: "Languages, cleanly separated" },
      { v: "100%", l: "Digital inspection evidence" },
    ],
    modulesEyebrow: "Five products in one",
    modulesTitle: "Everything your operation needs daily",
    modulesBody:
      "From a fridge reading to a full authority inspection: every step is recorded with time, date and the person who logged it.",
    showcaseEyebrow: "A look inside",
    showcaseTitle: "Web platform and native app",
    showcaseBody:
      "The same data on desktop, on the kitchen tablet and in your pocket — offline capable, with photo and geo evidence.",
    shotWeb: "Web platform",
    shotWebDesc: "Dashboards, analytics and inspection reports for owners and managers.",
    shotApp: "Mobile app",
    shotAppDesc: "Log a check in seconds at the walk-in, with photo and location evidence.",
    rolesEyebrow: "Roles & permissions",
    rolesTitle: "Every role sees exactly what it needs",
    roles: [
      { r: "Owner", d: "Cost, compliance score, sites and billing at a glance." },
      { r: "Manager", d: "Tasks, people, deviations and corrective actions under control." },
      { r: "Head chef", d: "Recipes, allergens, goods-in, temperatures and HACCP flows." },
      { r: "Team", d: "A clear daily list, logging in seconds, nothing else in the way." },
      { r: "Inspector", d: "Read-only access with a scoped, time-limited evidence export." },
    ],
    platformEyebrow: "Platform",
    platformTitle: "Built for a hard working kitchen",
    platform: [
      { t: "Native app & PWA", d: "iOS, Android and an installable web app with bottom navigation." },
      { t: "Offline capable", d: "Log without signal; everything syncs automatically afterwards." },
      { t: "Photo & geo evidence", d: "Every record carries a timestamp, location and person." },
      { t: "Hosted in the EU", d: "GDPR compliant, encrypted, with a tamper-evident audit trail." },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      {
        q: "Why is the rest of the site protected?",
        a: "The platform is in a closed promo phase. The access word opens the full website, the login and the app.",
      },
      {
        q: "Does Haccora replace my paper records?",
        a: "Yes. Checks, temperatures, cleaning schedules and evidence are kept digitally and tamper-evident, and export as an inspection report.",
      },
      {
        q: "Is Haccora suitable for German food authorities?",
        a: "Haccora covers HACCP under LMHV, §43 IfSG instruction records, traceability, pest monitoring and calibration, and gives inspectors their own read-only access.",
      },
      {
        q: "Does the app work without internet?",
        a: "Yes. Entries are stored locally and synchronised automatically once a connection returns.",
      },
      {
        q: "Which languages are supported?",
        a: "German is the default language. English can be switched on at any time — both languages are kept fully separate.",
      },
    ],
    ctaTitle: "Ready to run an inspection-ready operation?",
    ctaBody: "Request your access word and explore the complete platform.",
    footerTag: "Digital food safety, built for Germany",
    bottomHome: "Home",
    bottomModules: "Modules",
    bottomApp: "App",
    bottomFaq: "FAQ",
    bottomAccess: "Access",
  },
} as const;

const MODULES = [
  { icon: Thermometer, tone: "from-[color:var(--color-alert-red)] to-orange-500", de: ["Temperaturen & HACCP", "Messwerte mit Sollbereich, Abweichung und Korrekturmaßnahme."], en: ["Temperature & HACCP", "Readings with target range, deviation and corrective action."] },
  { icon: ClipboardCheck, tone: "from-emerald-500 to-emerald-600", de: ["Reinigung & Kontrollen", "Pflichtlisten mit Zeitstempel und Foto-Nachweis."], en: ["Cleaning & checks", "Mandatory task lists with timestamped photo evidence."] },
  { icon: Wheat, tone: "from-amber-500 to-orange-600", de: ["Rezepte & Allergene", "LMIV-konforme Allergenmatrix und Kalkulation."], en: ["Recipes & allergens", "LMIV-compliant allergen matrix and costing."] },
  { icon: Boxes, tone: "from-blue-600 to-indigo-600", de: ["Lager & Verfall", "Mindestbestände, MHD-Warnungen und Abfallerfassung."], en: ["Stock & expiry", "Par levels, best-before alerts and waste logging."] },
  { icon: Truck, tone: "from-slate-700 to-slate-900", de: ["Wareneingang & Lieferanten", "Rückverfolgbarkeit nach EU 178/2002 mit Chargen."], en: ["Goods-in & suppliers", "Traceability under EU 178/2002 with batch records."] },
  { icon: GraduationCap, tone: "from-violet-600 to-purple-700", de: ["Schulungen & §43 IfSG", "Zweisprachige Kurse, Tests und automatische Zertifikate."], en: ["Training & §43 IfSG", "Bilingual courses, quizzes and automatic certificates."] },
  { icon: Users, tone: "from-cyan-600 to-blue-700", de: ["Dienstplan & Zeiterfassung", "Schichten, Stempeln und Personalnachweise."], en: ["Rota & clock-in", "Shifts, clock-in and workforce records."] },
  { icon: ShieldCheck, tone: "from-[color:var(--color-alert-red)] to-rose-700", de: ["Inspector Mode", "Lesegeschützter Prüferzugang mit befristetem Umfang."], en: ["Inspector mode", "Read-only inspector access with a time-limited scope."] },
  { icon: FileText, tone: "from-slate-600 to-slate-800", de: ["Dokumente & Protokolle", "Versionierte Ablage und revisionssicheres Audit-Log."], en: ["Documents & logs", "Versioned storage and a tamper-evident audit log."] },
  { icon: Bell, tone: "from-orange-500 to-red-600", de: ["Alarme & Eskalation", "Live-Warnungen bei Abweichung, Verfall und Vorfällen."], en: ["Alerts & escalation", "Live warnings for deviations, expiry and incidents."] },
  { icon: BarChart3, tone: "from-emerald-600 to-teal-700", de: ["Auswertungen", "Compliance-Score, Kosten und Trends je Standort."], en: ["Analytics", "Compliance score, cost and trends per location." ] },
  { icon: Camera, tone: "from-indigo-600 to-blue-800", de: ["Foto- & Geo-Nachweis", "Gestempelte Bilder als belastbarer Prüfnachweis."], en: ["Photo & geo evidence", "Stamped images as defensible inspection evidence."] },
] as const;

function PromoHome() {
  const { lang } = useI18n();
  const c = COPY[lang];
  return (
    <div className="min-h-screen bg-white text-foreground pb-24 md:pb-0">
      <PromoHeader c={c} />
      <PromoHero c={c} />
      <StatsBand c={c} />
      <Modules c={c} lang={lang} />
      <Showcase c={c} />
      <Roles c={c} />
      <PlatformBand c={c} />
      <Faq c={c} />
      <CtaBand c={c} />
      <PromoFooter c={c} />
      <BottomNav c={c} />
    </div>
  );
}

type Copy = (typeof COPY)["de"] | (typeof COPY)["en"];

/* ─────────────────────────────── header */
function PromoHeader({ c }: { c: Copy }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { href: "#modules", label: c.navModules },
    { href: "#app", label: c.navApp },
    { href: "#platform", label: c.navProduct },
    { href: "#faq", label: c.navFaq },
  ];
  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_10px_30px_-18px_rgba(0,0,0,0.45)]" : ""
      } border-b border-black/5`}
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 h-20 md:h-28 flex items-center justify-between gap-4">
        <BrandLogo to="/" imgClassName="h-14 md:h-24 w-auto" />
        <nav className="hidden lg:flex items-center gap-8 text-sm font-bold">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-[color:var(--color-alert-red)] transition"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2 md:gap-3">
          <LanguageToggle />
          <Link to="/unlock" className="btn-red !px-4 !py-2.5 !text-xs md:!px-5 md:!py-3 md:!text-sm">
            <KeyRound size={15} /> {c.access}
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────── hero */
function PromoHero({ c }: { c: Copy }) {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <img
          src={promoHero}
          alt=""
          width={1600}
          height={1104}
          className="h-full w-full object-cover object-[65%_center]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, rgba(6,10,20,0.96) 0%, rgba(6,10,20,0.86) 42%, rgba(200,16,46,0.55) 78%, rgba(255,80,40,0.55) 100%)",
          }}
        />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-4 md:px-8 py-16 md:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[0.7rem] font-black uppercase tracking-[0.18em]">
            <Sparkles size={13} /> {c.eyebrow}
          </div>
          <h1
            className="mt-6 display-black text-4xl md:text-7xl leading-[1.02]"
            style={{ hyphens: "auto" }}
          >
            {c.heroTitle}
          </h1>
          <p className="mt-6 text-base md:text-xl text-white/80 leading-relaxed max-w-2xl">
            {c.heroBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/unlock" className="btn-red">
              {c.ctaPrimary} <ArrowRight size={16} />
            </Link>
            <a href="#modules" className="btn-red-outline !text-white">
              {c.ctaSecondary}
            </a>
          </div>
          <ul className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 max-w-xl">
            {c.chips.map((chip) => (
              <li key={chip} className="flex items-center gap-2 text-sm text-white/85">
                <CheckCircle2 size={16} className="text-[color:var(--color-alert-red-on-dark)]" />
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── stats */
function StatsBand({ c }: { c: Copy }) {
  return (
    <section className="bg-black text-white border-t border-white/10">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-10 md:py-14 grid grid-cols-2 lg:grid-cols-4 gap-6">
        {c.stats.map((s) => (
          <div key={s.l}>
            <div className="display-black text-3xl md:text-5xl text-[color:var(--color-alert-red-on-dark)]">
              {s.v}
            </div>
            <div className="mt-1 text-xs md:text-sm text-white/65 leading-snug">{s.l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────── modules */
function Modules({ c, lang }: { c: Copy; lang: "de" | "en" }) {
  return (
    <section id="modules" className="bg-[#f6f6f7] border-t border-black/5 scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-16 md:py-28">
        <div className="max-w-3xl">
          <div className="eyebrow">{c.modulesEyebrow}</div>
          <h2 className="mt-4 display-black text-3xl md:text-5xl" style={{ hyphens: "auto" }}>
            {c.modulesTitle}
          </h2>
          <p className="mt-4 text-black/60">{c.modulesBody}</p>
        </div>
        <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {MODULES.map(({ icon: Icon, tone, de, en }) => {
            const [title, desc] = lang === "en" ? en : de;
            return (
              <article
                key={title}
                className="group relative rounded-3xl bg-white border border-black/5 p-6 md:p-7 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_28px_60px_-32px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "radial-gradient(closest-side, color-mix(in oklab, var(--color-alert-red) 16%, transparent), transparent)",
                  }}
                />
                <span
                  className={`relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.35)]`}
                >
                  <Icon size={24} strokeWidth={2.2} />
                </span>
                <h3 className="relative mt-5 font-black text-lg md:text-xl leading-tight">
                  {title}
                </h3>
                <p className="relative mt-2 text-sm text-black/60 leading-relaxed">{desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── showcase (screenshots) */
function Showcase({ c }: { c: Copy }) {
  return (
    <section id="app" className="bg-white border-t border-black/5 scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-16 md:py-28">
        <div className="max-w-3xl">
          <div className="eyebrow">{c.showcaseEyebrow}</div>
          <h2 className="mt-4 display-black text-3xl md:text-5xl">{c.showcaseTitle}</h2>
          <p className="mt-4 text-black/60">{c.showcaseBody}</p>
        </div>
        <div className="mt-10 md:mt-14 grid lg:grid-cols-[1.55fr_1fr] gap-6 md:gap-10 items-start">
          <figure className="rounded-3xl border border-black/10 bg-[#f6f6f7] p-3 md:p-4 shadow-[0_40px_80px_-50px_rgba(0,0,0,0.7)]">
            <div className="rounded-2xl overflow-hidden bg-black">
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#1b1d21]">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <img
                src="/screens/web-platform.png"
                alt={c.shotWeb}
                loading="lazy"
                width={1440}
                height={900}
                className="w-full block"
              />
            </div>
            <figcaption className="px-2 pt-4 pb-1">
              <div className="font-black">{c.shotWeb}</div>
              <p className="mt-1 text-sm text-black/55">{c.shotWebDesc}</p>
            </figcaption>
          </figure>

          <figure className="justify-self-center max-w-[340px]">
            <div className="rounded-[2.5rem] border-[10px] border-black bg-black shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] overflow-hidden">
              <img
                src="/screens/mobile-app.png"
                alt={c.shotApp}
                loading="lazy"
                width={390}
                height={844}
                className="w-full block"
              />
            </div>
            <figcaption className="pt-4 text-center">
              <div className="font-black">{c.shotApp}</div>
              <p className="mt-1 text-sm text-black/55">{c.shotAppDesc}</p>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── roles */
function Roles({ c }: { c: Copy }) {
  return (
    <section className="bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-16 md:py-28">
        <div className="max-w-3xl">
          <div className="eyebrow !text-[color:var(--color-alert-red-on-dark)]">{c.rolesEyebrow}</div>
          <h2 className="mt-4 display-black text-3xl md:text-5xl">{c.rolesTitle}</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {c.roles.map((r, i) => (
            <div
              key={r.r}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.08] transition"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-alert-red)] text-white text-xs font-black">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-4 font-black text-lg">{r.r}</div>
              <p className="mt-2 text-sm text-white/60 leading-relaxed">{r.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── platform band */
function PlatformBand({ c }: { c: Copy }) {
  const icons = [Smartphone, WifiOff, Camera, Server];
  return (
    <section id="platform" className="bg-[#f6f6f7] border-t border-black/5 scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-16 md:py-28">
        <div className="max-w-3xl">
          <div className="eyebrow">{c.platformEyebrow}</div>
          <h2 className="mt-4 display-black text-3xl md:text-5xl">{c.platformTitle}</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {c.platform.map((p, i) => {
            const Icon = icons[i] ?? Smartphone;
            return (
              <div
                key={p.t}
                className="rounded-3xl bg-white border border-black/5 p-6 md:p-7 hover:shadow-[0_28px_60px_-34px_rgba(0,0,0,0.5)] hover:-translate-y-1 transition-all duration-300"
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-black text-white shadow-[0_10px_24px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.25)]">
                  <Icon size={24} strokeWidth={2.2} />
                </span>
                <div className="mt-5 font-black text-lg">{p.t}</div>
                <p className="mt-2 text-sm text-black/60 leading-relaxed">{p.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── faq */
function Faq({ c }: { c: Copy }) {
  return (
    <section id="faq" className="bg-white border-t border-black/10 scroll-mt-24">
      <div className="mx-auto max-w-[900px] px-4 md:px-8 py-16 md:py-28">
        <h2 className="display-black text-3xl md:text-5xl text-center">{c.faqTitle}</h2>
        <div className="mt-10 divide-y divide-black/10 border-y border-black/10">
          {c.faq.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                <span className="font-black text-base md:text-xl">{f.q}</span>
                <span className="shrink-0 inline-flex items-center justify-center h-9 w-9 rounded-full bg-black text-white group-open:hidden">
                  <Plus size={16} />
                </span>
                <span className="shrink-0 hidden group-open:inline-flex items-center justify-center h-9 w-9 rounded-full bg-[color:var(--color-alert-red)] text-white">
                  <Minus size={16} />
                </span>
              </summary>
              <p className="mt-4 text-black/70 leading-relaxed pr-10">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── cta */
function CtaBand({ c }: { c: Copy }) {
  return (
    <section
      className="text-white"
      style={{
        background:
          "linear-gradient(120deg, var(--color-alert-red) 0%, #e2452b 55%, var(--color-alert-orange) 100%)",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-16 md:py-24 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <h2 className="display-black text-3xl md:text-5xl">{c.ctaTitle}</h2>
          <p className="mt-3 text-white/85">{c.ctaBody}</p>
        </div>
        <Link
          to="/unlock"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-7 py-4 font-black text-sm hover:bg-black/85 transition shrink-0"
        >
          <Lock size={16} /> {c.ctaPrimary}
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────────── footer */
function PromoFooter({ c }: { c: Copy }) {
  const { t } = useI18n();
  return (
    <footer className="bg-black text-white/70">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <BrandLogo to="" onDark imgClassName="h-16 w-auto" />
          <p className="mt-4 text-white/50 text-xs leading-relaxed max-w-xs">{c.footerTag}</p>
        </div>
        <div className="md:justify-self-center">
          <div className="text-white text-xs font-black uppercase tracking-widest">
            {t("footer.section.legal")}
          </div>
          <ul className="mt-3 space-y-2">
            <li>
              <Link to="/legal/imprint" className="hover:text-white">
                {t("footer.imprint")}
              </Link>
            </li>
            <li>
              <Link to="/legal/privacy" className="hover:text-white">
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link to="/legal/terms" className="hover:text-white">
                {t("footer.terms")}
              </Link>
            </li>
            <li>
              <Link to="/legal/cookies" className="hover:text-white">
                {t("footer.cookies")}
              </Link>
            </li>
            <li>
              <Link to="/legal/complaints" className="hover:text-white">
                {t("footer.complaints")}
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={openCookieSettings}
                className="hover:text-white underline-offset-2 hover:underline"
              >
                {t("cookie.settings")}
              </button>
            </li>
          </ul>
        </div>
        <div className="md:justify-self-end">
          <Link to="/unlock" className="btn-red !px-5 !py-3 !text-sm">
            <KeyRound size={15} /> {c.access}
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-5 text-xs text-white/70">
          {t("footer.rights")}
          <span className="block mt-1 text-white/50">{t("footer.trading")}</span>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────── native-style bottom nav (mobile) */
function BottomNav({ c }: { c: Copy }) {
  const items = [
    { href: "#top", icon: Home, label: c.bottomHome },
    { href: "#modules", icon: LayoutGrid, label: c.bottomModules },
    { href: "#app", icon: Smartphone, label: c.bottomApp },
    { href: "#faq", icon: HelpCircle, label: c.bottomFaq },
  ];
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 border-t border-black/10 bg-white/95 backdrop-blur pb-safe">
      <div className="grid grid-cols-5">
        {items.map(({ href, icon: Icon, label }) => (
          <a
            key={label}
            href={href}
            className="flex flex-col items-center gap-1 py-2.5 text-[0.62rem] font-bold text-black/65 active:text-[color:var(--color-alert-red)]"
          >
            <Icon size={20} strokeWidth={2.1} />
            {label}
          </a>
        ))}
        <Link
          to="/unlock"
          className="flex flex-col items-center gap-1 py-2.5 text-[0.62rem] font-bold text-[color:var(--color-alert-red)]"
        >
          <KeyRound size={20} strokeWidth={2.1} />
          {c.bottomAccess}
        </Link>
      </div>
    </nav>
  );
}
