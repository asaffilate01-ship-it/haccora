import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "de" | "en";

type Dict = Record<string, string>;

const de: Dict = {
  // Nav / global
  "nav.product": "Produkt",
  "nav.modules": "Module",
  "nav.pricing": "Preise",
  "nav.regulation": "Regulatorik",
  "nav.about": "Über uns",
  "nav.login": "Anmelden",
  "nav.demo": "Live-Demo",
  "nav.tryFree": "Kostenlos starten",
  "brand.tag": "Digitale Lebensmittelsicherheit für Deutschland",

  // Hero
  "hero.eyebrow": "HACCP · IfSG · LMHV · Prüfungsbereit",
  
  "hero.cta.primary": "Live-Demo öffnen",
  "hero.cta.secondary": "Preise ansehen",
  "hero.trust": "Vertraut von Restaurants, Filialisten und Franchise-Betrieben in Berlin, NRW, Bayern und Hamburg.",

  // Stats
  "stats.locations": "Standorte betreut",
  "stats.checks": "Kontrollen pro Monat",
  "stats.languages": "Personalsprachen",
  "stats.inspection": "Ø Prüfungsvorbereitung",

  // Pillars
  "pillars.title": "Fünf Produkte. Ein System.",
  "pillars.subtitle": "GastroSafe vereint Compliance, Betrieb, Einkauf, Schulung und Regulatorik – ohne getrennte Tools.",
  "pillar.haccp.title": "HACCP & Lebensmittelsicherheit",
  "pillar.haccp.body": "KI-gestützter Plan-Builder mit Gefahrenanalyse, CCPs, kritischen Grenzwerten und obligatorischer menschlicher Freigabe.",
  "pillar.ops.title": "Betrieb & Tagesabläufe",
  "pillar.ops.body": "Tägliche Kontrollen, Schichtübergabe, Aufgaben, Vorfälle, Wartung und SOP-Bibliothek – auf jedem Handy.",
  "pillar.recipes.title": "Einkauf, Rezepte & Kalkulation",
  "pillar.recipes.body": "Zutaten, 14-Allergen-Automatik, Kalkulation und Lieferanteninfos – änderungssicher verknüpft.",
  "pillar.team.title": "Personal & Schulung",
  "pillar.team.body": "IfSG §§42–43, LMHV, Allergene, Hygiene – mit Mikrolernen in 7 Sprachen und Zertifikatsnachweis.",
  "pillar.regulation.title": "Deutsche Regulatorik",
  "pillar.regulation.body": "Behördenfinder für Berlin und NRW, EU 852/2004, 178/2002, 1169/2011 – Änderungen automatisch signalisiert.",

  // Inspector Mode
  "inspector.eyebrow": "GastroSafe Inspector Mode",
  "inspector.title": "Ein Klick. Alles, was die Behörde anfragt.",
  "inspector.body": "HACCP-Plan, Temperaturhistorie, Reinigungsnachweise, Allergenmatrix, Schulungsbelege, Rückverfolgbarkeit und Auditverlauf – als schreibgeschützte deutschsprachige Ansicht oder als Nachweispaket.",
  "inspector.item.plan": "Aktueller HACCP-Plan",
  "inspector.item.temp": "Temperaturverlauf und Abweichungen",
  "inspector.item.clean": "Reinigungs- und Schädlingsnachweise",
  "inspector.item.allergen": "Allergenmatrix aller Rezepte",
  "inspector.item.training": "IfSG- und LMHV-Nachweise",
  "inspector.item.traceability": "Rückverfolgbarkeit vorwärts und rückwärts",
  "inspector.cta": "Nachweispaket demonstrieren",

  // Pricing
  "pricing.eyebrow": "Preise",
  "pricing.title": "Transparent. Ohne versteckte Module.",
  "pricing.subtitle": "Alle Kernfunktionen sind enthalten. Preis richtet sich nach Größe und Serviceumfang.",
  "pricing.perMonth": "/Monat",
  "pricing.perLocation": "je Standort",
  "pricing.cta": "Paket wählen",
  "pricing.featured": "Empfohlen",
  "pricing.plan.solo": "Solo",
  "pricing.plan.solo.desc": "Ein Standort, bis 5 Mitarbeitende",
  "pricing.plan.complete": "Complete",
  "pricing.plan.complete.desc": "Ein Standort, alle Module, unbegrenzt Personal",
  "pricing.plan.completePlus": "Complete Plus",
  "pricing.plan.completePlus.desc": "Inkl. Fachprüfung und Priorität-Support",
  "pricing.plan.group": "Small Group",
  "pricing.plan.group.desc": "Bis zu 3 Standorte",
  "pricing.plan.growing": "Growing Group",
  "pricing.plan.growing.desc": "Bis zu 10 Standorte",
  "pricing.plan.enterprise": "Enterprise",
  "pricing.plan.enterprise.desc": "Ab 10+ Standorte, SLA und Integrationen",
  "pricing.promise": "Wenn ein Prüfer einen fehlenden Nachweis identifiziert, der in Ihrem aktiven GastroSafe-Plan hätte enthalten sein müssen, unterstützen wir die Korrektur ohne zusätzliche Softwaregebühr.",

  // Guarantee
  "guarantee.title": "Ein Versprechen, das wir halten können.",
  "guarantee.body": "Wir versprechen keine „garantierte Rechtskonformität\". Wir versprechen den Service, der sie ermöglicht.",

  // CTA footer
  "cta.title": "Starten Sie in unter einem Tag.",
  "cta.body": "Kostenlose Ersteinrichtung. Optional konfigurieren wir Rezepte, HACCP und Schulungen für Sie.",
  "cta.primary": "Demo öffnen",
  "cta.secondary": "Vertrieb kontaktieren",
  "footer.rights": "© 2026 GastroSafe. Alle Rechte vorbehalten.",
  "footer.imprint": "Impressum",
  "footer.privacy": "Datenschutz",
  "footer.terms": "AGB",

  // App shell
  "app.tag": "Kreuzberg Kitchen · Berlin",
  "menu.dashboard": "Übersicht",
  "menu.haccp": "HACCP-Plan",
  "menu.checks": "Kontrollen",
  "menu.temperature": "Temperatur",
  "menu.cleaning": "Reinigung",
  "menu.recipes": "Rezepte & Allergene",
  "menu.suppliers": "Lieferanten",
  "menu.training": "Team & Schulung",
  "menu.audit": "Audit & Inspektion",
  "menu.settings": "Einstellungen",

  // Dashboard
  "dash.hello": "Guten Morgen, Aylin",
  "dash.sub": "Ihre Compliance heute – Stand jetzt.",
  "dash.metric.score": "Compliance-Score",
  "dash.metric.pending": "Offene Aufgaben",
  "dash.metric.overdue": "Überfällig",
  "dash.metric.actions": "Offene Maßnahmen",
  "dash.metric.failed": "Temperaturabweichungen (24h)",
  "dash.metric.training": "Schulungen laufen ab (30T)",
  "dash.today": "Heute fällig",
  "dash.actions": "Korrekturmaßnahmen",
  "dash.readiness": "Prüfungsbereitschaft",
  "dash.readiness.body": "Alle Nachweise sind aktuell. Erstellen Sie mit einem Klick die vollständige Prüfungsmappe.",
  "dash.readiness.cta": "Inspector Mode öffnen",
  "dash.complete": "Erledigen",
  "dash.completed": "Erledigt",
  "dash.overdue": "Überfällig",
  "dash.pending": "Offen",
  "dash.severity.high": "Hoch",
  "dash.severity.medium": "Mittel",
  "dash.severity.low": "Niedrig",
  "dash.severity.critical": "Kritisch",

  // HACCP
  "haccp.title": "HACCP-Plan",
  "haccp.sub": "KI-gestützter Entwurf · Menschliche Freigabe erforderlich",
  "haccp.status.draft": "KI-Entwurf",
  "haccp.status.review": "In Prüfung",
  "haccp.status.approved": "Freigegeben",
  "haccp.step": "Prozess-Schritt",
  "haccp.hazard": "Gefahr",
  "haccp.ccp": "CCP",
  "haccp.limit": "Grenzwert",
  "haccp.monitor": "Überwachung",
  "haccp.action": "Korrekturmaßnahme",

  // Recipes
  "recipes.title": "Rezepte & Allergene",
  "recipes.sub": "14 Allergene automatisch berechnet · Zutatenänderungen werden markiert",
  "recipes.allergen": "Allergene",
  "recipes.margin": "Marge",
  "recipes.cost": "Kosten",
  "recipes.price": "VK",

  // Temperature
  "temp.title": "Temperaturüberwachung",
  "temp.sub": "Manuell, Bluetooth, QR-Code oder Sensor-API",
  "temp.record": "Messung erfassen",
  "temp.equipment": "Gerät",
  "temp.value": "Wert",
  "temp.range": "Zulässiger Bereich",
  "temp.last": "Letzte Messung",

  // Training
  "training.title": "Team & Schulung",
  "training.sub": "IfSG · LMHV · Allergene · Hygiene – mehrsprachig",
  "training.expires": "läuft ab in",
  "training.days": "Tagen",

  // Inspection
  "inspection.title": "Inspector Mode",
  "inspection.sub": "Ein schreibgeschütztes Nachweispaket für die Lebensmittelaufsicht.",
  "inspection.generate": "Nachweispaket generieren",
  "inspection.from": "Von",
  "inspection.to": "Bis",

  // Landing extras (FoodAlert-inspired)
  "nav.search": "Suchen",
  "nav.contact": "Kontakt",
  "hero.title": "Ein System für die gesamte Lebensmittelsicherheit.",
  "hero.subtitle": "GastroSafe ersetzt HACCP-Ordner, Temperaturlisten, Reinigungspläne, Allergenmappen, Personalzertifikate und Prüfungsvorbereitung – in einer mehrsprachigen Plattform, gebaut für Gastronomie in Deutschland.",
  "hero.video.title": "So unterstützen wir Ihren Betrieb",
  "contact.title": "Mehr Informationen anfordern",
  "contact.first": "Vorname",
  "contact.last": "Nachname",
  "contact.email": "E-Mail-Adresse",
  "contact.phone": "Telefonnummer",
  "contact.business": "Firmenname",
  "contact.cta": "Kontakt aufnehmen",
  "contact.legal": "Mit dem Absenden dieses Formulars stimmen Sie unserer Datenschutzerklärung zu.",
  "s360.title": "Lebensmittelsicherheit rundum",
  "s360.more": "Mehr erfahren",
  "s360.docs.t": "Digitale Nachweise",
  "s360.docs.b": "HACCP, Checklisten und Belege – lückenlos an einem Ort.",
  "s360.time.t": "24/7 Überwachung",
  "s360.time.b": "Temperatur- und Aufgaben-Alarme rund um die Uhr.",
  "s360.alert.t": "Vorfallsmanagement",
  "s360.alert.b": "Korrekturmaßnahmen mit Fotobeleg und Freigabe.",
  "pillars.eyebrow": "Die Plattform",
  "pillar.temp.title": "Temperatur & Sensoren",
  "pillar.temp.body": "Manuelle Eingabe oder Sensor-Anbindung – Grenzwerte, Alarme und Maßnahmen automatisch dokumentiert.",
  "reg.eyebrow": "Deutsche Regulatorik",
  "reg.title": "Gebaut für die deutsche Lebensmittelaufsicht.",
  "reg.body": "Behördenfinder Berlin und NRW, EU 852/2004, 178/2002, 1169/2011, IfSG-Tracker, LMHV-Matrix, LFGB-Bezug – versioniert und mit Handlungscheckliste bei Rechtsänderungen.",

  // Auth / roles
  "auth.title": "Bei GastroSafe anmelden",
  "auth.sub": "Wählen Sie eine Rolle für die Demo. Jede Rolle sieht ihr eigenes Dashboard und ihre Berechtigungen.",
  "auth.continue": "Als {role} fortfahren",
  "auth.signout": "Abmelden",
  "auth.signedInAs": "Angemeldet als",
  "auth.switch": "Rolle wechseln",
  "auth.demo": "Demo-Modus · keine echte Anmeldung erforderlich",
  "auth.back": "Zurück zur Startseite",
  "role.owner": "Inhaberin / Geschäftsführung",
  "role.owner.desc": "Voller Zugriff: Compliance, Finanzen, Standorte, Team, Regulatorik.",
  "role.manager": "Betriebsleitung",
  "role.manager.desc": "Tagesgeschäft, Aufgaben, Personal, Inspektionen – ohne Preis- & Vertragsbereich.",
  "role.chef": "Küchenleitung / Head Chef",
  "role.chef.desc": "HACCP, Temperaturen, Rezepte, Allergene und Küchenteam.",
  "role.staff": "Mitarbeiter:in",
  "role.staff.desc": "Nur eigene Aufgaben, Checklisten und Schulungen.",
  "role.inspector": "Lebensmittelaufsicht",
  "role.inspector.desc": "Schreibgeschützter Inspector Mode – Nachweise, kein Zugriff auf operative Daten.",
  "dash.hello.role": "Guten Tag",
  "dash.role.owner": "Ihr Compliance-Überblick über alle Standorte.",
  "dash.role.manager": "Heute im Betrieb – Aufgaben, Personal und offene Punkte.",
  "dash.role.chef": "Küche heute – HACCP, Temperaturen, Freigaben.",
  "dash.role.staff": "Ihre offenen Aufgaben für heute.",
  "dash.role.inspector": "Nachweisansicht – schreibgeschützt für die Aufsicht.",
};



const en: Dict = {
  "nav.product": "Product",
  "nav.modules": "Modules",
  "nav.pricing": "Pricing",
  "nav.regulation": "Regulation",
  "nav.about": "About",
  "nav.login": "Sign in",
  "nav.demo": "Live demo",
  "nav.tryFree": "Get started",
  "brand.tag": "Digital food safety, built for Germany",

  "hero.eyebrow": "HACCP · IfSG · LMHV · Inspector-ready",
  "hero.title": "One system for every part of food safety.",
  "hero.subtitle": "GastroSafe replaces your HACCP folder, temperature sheets, cleaning records, allergen files, staff certificates and inspection paperwork — in one multilingual platform built for food businesses in Germany.",
  "hero.cta.primary": "Open live demo",
  "hero.cta.secondary": "See pricing",
  "hero.trust": "Trusted by independent restaurants, chains and franchises across Berlin, NRW, Bavaria and Hamburg.",

  "stats.locations": "Locations onboarded",
  "stats.checks": "Checks per month",
  "stats.languages": "Staff languages",
  "stats.inspection": "Avg. inspection prep",

  "pillars.title": "Five products. One system.",
  "pillars.subtitle": "Compliance, operations, purchasing, training and regulation — no more disconnected tools.",
  "pillar.haccp.title": "HACCP & food safety",
  "pillar.haccp.body": "AI-assisted plan builder with hazard analysis, CCPs, critical limits and mandatory human approval.",
  "pillar.ops.title": "Restaurant operations",
  "pillar.ops.body": "Daily checks, shift handover, tasks, incidents, maintenance and an SOP library — on any phone.",
  "pillar.recipes.title": "Purchasing, recipes & costing",
  "pillar.recipes.body": "Ingredients, automatic 14-allergen calculation, margin analysis and supplier specs — linked end-to-end.",
  "pillar.team.title": "Staff & training",
  "pillar.team.body": "IfSG §§42–43, LMHV, allergens, hygiene — with microlearning in 7 staff languages and digital certificates.",
  "pillar.regulation.title": "German regulation",
  "pillar.regulation.body": "Authority finder for Berlin & NRW, EU 852/2004, 178/2002, 1169/2011 — updates flagged automatically.",

  "inspector.eyebrow": "GastroSafe Inspector Mode",
  "inspector.title": "One click. Everything the authority asks for.",
  "inspector.body": "HACCP plan, temperature history, cleaning records, allergen matrix, training evidence, traceability and audit history — as a read-only German interface or a downloadable evidence pack.",
  "inspector.item.plan": "Current HACCP plan",
  "inspector.item.temp": "Temperature history and deviations",
  "inspector.item.clean": "Cleaning and pest-control records",
  "inspector.item.allergen": "Full allergen matrix",
  "inspector.item.training": "IfSG & LMHV evidence",
  "inspector.item.traceability": "One-step-forward and one-step-back",
  "inspector.cta": "See a sample evidence pack",

  "pricing.eyebrow": "Pricing",
  "pricing.title": "Transparent. No hidden modules.",
  "pricing.subtitle": "Every core feature is included. Price scales with size and service level.",
  "pricing.perMonth": "/month",
  "pricing.perLocation": "per location",
  "pricing.cta": "Choose plan",
  "pricing.featured": "Recommended",
  "pricing.plan.solo": "Solo",
  "pricing.plan.solo.desc": "One site, up to 5 staff",
  "pricing.plan.complete": "Complete",
  "pricing.plan.complete.desc": "One site, all modules, unlimited staff",
  "pricing.plan.completePlus": "Complete Plus",
  "pricing.plan.completePlus.desc": "Includes annual specialist review & priority support",
  "pricing.plan.group": "Small Group",
  "pricing.plan.group.desc": "Up to 3 locations",
  "pricing.plan.growing": "Growing Group",
  "pricing.plan.growing.desc": "Up to 10 locations",
  "pricing.plan.enterprise": "Enterprise",
  "pricing.plan.enterprise.desc": "10+ locations, SLA and integrations",
  "pricing.promise": "If an inspector finds a missing record that should have been part of your active GastroSafe plan, we help configure the correction with no additional software charge.",

  "guarantee.title": "A promise we can actually keep.",
  "guarantee.body": "We don't promise \"guaranteed legal compliance\". We promise the service that makes it possible.",

  "cta.title": "Live in under a day.",
  "cta.body": "Free self-setup. Optional: we configure your recipes, HACCP and training for you.",
  "cta.primary": "Open the demo",
  "cta.secondary": "Talk to sales",
  "footer.rights": "© 2026 GastroSafe. All rights reserved.",
  "footer.imprint": "Imprint",
  "footer.privacy": "Privacy",
  "footer.terms": "Terms",

  "app.tag": "Kreuzberg Kitchen · Berlin",
  "menu.dashboard": "Overview",
  "menu.haccp": "HACCP plan",
  "menu.checks": "Daily checks",
  "menu.temperature": "Temperature",
  "menu.cleaning": "Cleaning",
  "menu.recipes": "Recipes & allergens",
  "menu.suppliers": "Suppliers",
  "menu.training": "Team & training",
  "menu.audit": "Audit & inspection",
  "menu.settings": "Settings",

  "dash.hello": "Good morning, Aylin",
  "dash.sub": "Your compliance today — as of now.",
  "dash.metric.score": "Compliance score",
  "dash.metric.pending": "Pending tasks",
  "dash.metric.overdue": "Overdue",
  "dash.metric.actions": "Open actions",
  "dash.metric.failed": "Temperature deviations (24h)",
  "dash.metric.training": "Training expiring (30d)",
  "dash.today": "Due today",
  "dash.actions": "Corrective actions",
  "dash.readiness": "Inspection readiness",
  "dash.readiness.body": "All evidence is current. Generate the complete inspection pack in one click.",
  "dash.readiness.cta": "Open Inspector Mode",
  "dash.complete": "Complete",
  "dash.completed": "Done",
  "dash.overdue": "Overdue",
  "dash.pending": "Pending",
  "dash.severity.high": "High",
  "dash.severity.medium": "Medium",
  "dash.severity.low": "Low",
  "dash.severity.critical": "Critical",

  "haccp.title": "HACCP plan",
  "haccp.sub": "AI-drafted · Human approval required",
  "haccp.status.draft": "AI draft",
  "haccp.status.review": "In review",
  "haccp.status.approved": "Approved",
  "haccp.step": "Process step",
  "haccp.hazard": "Hazard",
  "haccp.ccp": "CCP",
  "haccp.limit": "Limit",
  "haccp.monitor": "Monitoring",
  "haccp.action": "Corrective action",

  "recipes.title": "Recipes & allergens",
  "recipes.sub": "14 allergens computed automatically · Ingredient changes flagged",
  "recipes.allergen": "Allergens",
  "recipes.margin": "Margin",
  "recipes.cost": "Cost",
  "recipes.price": "Price",

  "temp.title": "Temperature monitoring",
  "temp.sub": "Manual, Bluetooth, QR or sensor API",
  "temp.record": "Record reading",
  "temp.equipment": "Equipment",
  "temp.value": "Value",
  "temp.range": "Permitted range",
  "temp.last": "Last reading",

  "training.title": "Team & training",
  "training.sub": "IfSG · LMHV · Allergens · Hygiene — multilingual",
  "training.expires": "expires in",
  "training.days": "days",

  "inspection.title": "Inspector Mode",
  "inspection.sub": "A read-only evidence pack for the food control authority.",
  "inspection.generate": "Generate evidence pack",
  "inspection.from": "From",
  "inspection.to": "To",

  // Landing extras (FoodAlert-inspired)
  "nav.search": "Search",
  "nav.contact": "Contact us",
  "hero.video.title": "Watch how we support your business",
  "contact.title": "Get more information",
  "contact.first": "First name",
  "contact.last": "Last name",
  "contact.email": "Email address",
  "contact.phone": "Phone number",
  "contact.business": "Business name",
  "contact.cta": "Get in touch",
  "contact.legal": "By submitting this form you agree to our privacy policy.",
  "s360.title": "food health & safety support",
  "s360.more": "Learn more",
  "s360.docs.t": "Digital records",
  "s360.docs.b": "HACCP, checklists and evidence — all in one place.",
  "s360.time.t": "24/7 monitoring",
  "s360.time.b": "Temperature and task alerts around the clock.",
  "s360.alert.t": "Incident response",
  "s360.alert.b": "Corrective actions with photo evidence and sign-off.",
  "pillars.eyebrow": "The platform",
  "pillar.temp.title": "Temperature & sensors",
  "pillar.temp.body": "Manual entry or sensor integration — thresholds, alerts and corrective actions documented automatically.",
  "reg.eyebrow": "German regulatory layer",
  "reg.title": "Built for the German inspector.",
  "reg.body": "Authority finder for Berlin & NRW, EU 852/2004, 178/2002, 1169/2011, IfSG tracker, LMHV matrix, LFGB references — versioned with an action checklist when the law changes.",

  // Auth / roles
  "auth.title": "Sign in to GastroSafe",
  "auth.sub": "Pick a role for the demo. Each role gets its own dashboard and permissions.",
  "auth.continue": "Continue as {role}",
  "auth.signout": "Sign out",
  "auth.signedInAs": "Signed in as",
  "auth.switch": "Switch role",
  "auth.demo": "Demo mode · no real credentials required",
  "auth.back": "Back to homepage",
  "role.owner": "Owner / Executive",
  "role.owner.desc": "Full access: compliance, finance, locations, team, regulation.",
  "role.manager": "Location Manager",
  "role.manager.desc": "Day-to-day operations, tasks, staff, inspections — no pricing or contracts.",
  "role.chef": "Head Chef",
  "role.chef.desc": "HACCP, temperatures, recipes, allergens and kitchen team.",
  "role.staff": "Team Member",
  "role.staff.desc": "Only own tasks, checklists and training modules.",
  "role.inspector": "Food Authority",
  "role.inspector.desc": "Read-only Inspector Mode — evidence only, no operational access.",
  "dash.hello.role": "Hello",
  "dash.role.owner": "Your compliance overview across every location.",
  "dash.role.manager": "Today at the location — tasks, staff and open items.",
  "dash.role.chef": "Kitchen today — HACCP, temperatures, sign-offs.",
  "dash.role.staff": "Your open tasks for today.",
  "dash.role.inspector": "Evidence view — read-only for the authority.",
};



const dicts: Record<Language, Dict> = { de, en };

type Ctx = { lang: Language; setLang: (l: Language) => void; t: (key: string) => string };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("de");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gs-lang");
      if (stored === "de" || stored === "en") setLangState(stored);
      else if (typeof navigator !== "undefined" && navigator.language?.startsWith("en")) setLangState("en");
    } catch { /* noop */ }
  }, []);

  const setLang = (l: Language) => {
    if (l === lang) return;
    const doSwap = () => {
      setLangState(l);
      try { localStorage.setItem("gs-lang", l); } catch { /* noop */ }
      if (typeof document !== "undefined") document.documentElement.lang = l;
    };
    // Smooth crossfade using the View Transitions API when available.
    const anyDoc = typeof document !== "undefined" ? (document as Document & { startViewTransition?: (cb: () => void) => unknown }) : null;
    if (anyDoc?.startViewTransition) {
      anyDoc.startViewTransition(doSwap);
    } else {
      // Fallback: brief opacity fade on <body>.
      if (typeof document !== "undefined") {
        document.body.classList.add("lang-swap");
        setTimeout(() => {
          doSwap();
          setTimeout(() => document.body.classList.remove("lang-swap"), 160);
        }, 120);
      } else {
        doSwap();
      }
    }
  };


  const t = (key: string) => dicts[lang][key] ?? dicts.en[key] ?? key;
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used inside LanguageProvider");
  return ctx;
}
