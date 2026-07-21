import haccpImg from "@/assets/blog-haccp.jpg";
import cleaningImg from "@/assets/blog-cleaning.jpg";
import inspectionImg from "@/assets/blog-inspection.jpg";
import allergensImg from "@/assets/blog-allergens.jpg";

export type Language = "de" | "en";

export interface BlogPost {
  slug: string;
  image: string;
  imageAlt: { de: string; en: string };
  date: string; // ISO
  readMinutes: number;
  category: { de: string; en: string };
  author: string;
  title: { de: string; en: string };
  excerpt: { de: string; en: string };
  /** Rich body as ordered blocks. */
  body: {
    de: BlogBlock[];
    en: BlogBlock[];
  };
  tags: string[];
}

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string; cite?: string };

export const posts: BlogPost[] = [
  {
    slug: "haccp-plan-germany-2026",
    image: haccpImg,
    imageAlt: {
      de: "Küchenchef prüft die Kühlraumtemperatur mit einem digitalen Thermometer",
      en: "Chef checking walk-in cooler temperature with a digital probe",
    },
    date: "2026-06-14",
    readMinutes: 7,
    category: { de: "HACCP", en: "HACCP" },
    author: "Dr. Katrin Weber",
    tags: ["HACCP", "IfSG", "LMHV"],
    title: {
      de: "Ein rechtssicherer HACCP-Plan für deutsche Gastronomie – Schritt für Schritt",
      en: "A legally sound HACCP plan for German gastronomy — step by step",
    },
    excerpt: {
      de: "So bauen Sie 2026 einen HACCP-Plan auf, der IfSG, LMHV und Behördenprüfung standhält – ohne Papierchaos.",
      en: "How to build a 2026 HACCP plan that stands up to IfSG, LMHV and inspector scrutiny — without paper chaos.",
    },
    body: {
      de: [
        { type: "p", text: "Der HACCP-Plan ist das Herzstück jeder deutschen Gastronomie. Er ist gesetzlich verpflichtend nach Verordnung (EG) Nr. 852/2004 und wird bei jeder Prüfung durch das Veterinär- oder Lebensmittelüberwachungsamt kontrolliert." },
        { type: "h2", text: "Die 7 HACCP-Grundsätze in der Praxis" },
        { type: "p", text: "Die Grundsätze sind bekannt – aber der Alltag scheitert oft an Dokumentation, Verantwortlichkeit und Freigabe. Haccora strukturiert jeden Schritt, hält Nachweise revisionssicher und erzwingt eine menschliche Freigabe für jeden KI-Vorschlag." },
        { type: "ul", items: [
          "Gefahrenanalyse pro Prozessschritt (Wareneingang → Ausgabe)",
          "Kritische Kontrollpunkte (CCP) mit klaren Grenzwerten",
          "Überwachung mit Uhrzeit, Person und Messwert",
          "Korrekturmaßnahmen mit Ursachenanalyse",
          "Verifizierung durch interne Audits",
          "Dokumentation revisionssicher und exportierbar",
          "Regelmäßige Überprüfung des Plans",
        ]},
        { type: "quote", text: "Ein Prüfer bewertet nicht Ihr System – er bewertet Ihre Nachweise. Wer nichts belegt, hat nichts gemacht.", cite: "Amtstierärztin, Berlin" },
        { type: "h2", text: "Was ändert sich 2026?" },
        { type: "p", text: "Digitale Nachweise werden von immer mehr Ämtern erwartet. Papierordner werden zwar noch akzeptiert, verlangsamen aber die Prüfung deutlich. Mit Haccora liefern Sie Daten im Inspektor-Modus binnen Sekunden." },
      ],
      en: [
        { type: "p", text: "The HACCP plan is the backbone of every German food business. It is legally required under Regulation (EC) No 852/2004 and is checked during every visit by the veterinary or food safety office." },
        { type: "h2", text: "The 7 HACCP principles in practice" },
        { type: "p", text: "The principles are well known — but daily reality often fails at documentation, accountability and sign-off. Haccora structures every step, keeps evidence audit-safe and requires human approval on every AI suggestion." },
        { type: "ul", items: [
          "Hazard analysis per process step (goods-in → service)",
          "Critical Control Points (CCP) with clear limits",
          "Monitoring with time, person and value",
          "Corrective actions with root-cause analysis",
          "Verification via internal audits",
          "Audit-safe, exportable documentation",
          "Regular review of the plan",
        ]},
        { type: "quote", text: "An inspector doesn't rate your system — they rate your evidence. If you didn't log it, you didn't do it.", cite: "Public veterinarian, Berlin" },
        { type: "h2", text: "What changes in 2026?" },
        { type: "p", text: "More and more authorities now expect digital evidence. Paper binders are still accepted, but noticeably slow inspections. With Haccora's Inspector Mode you present the data in seconds." },
      ],
    },
  },
  {
    slug: "cleaning-schedule-that-passes-inspection",
    image: cleaningImg,
    imageAlt: {
      de: "Personal reinigt frühmorgens die Küchenlinie",
      en: "Staff cleaning the kitchen line at dawn",
    },
    date: "2026-05-22",
    readMinutes: 5,
    category: { de: "Betrieb", en: "Operations" },
    author: "Marco Ricci",
    tags: ["Reinigung", "SOP", "LMHV"],
    title: {
      de: "Reinigungspläne, die jede Prüfung bestehen",
      en: "Cleaning plans that pass every inspection",
    },
    excerpt: {
      de: "Von der Frequenz bis zur Kontrolle: So bauen Sie einen Reinigungsplan, der auch im Trubel funktioniert.",
      en: "From frequency to verification: how to build a cleaning plan that works even in the weeds.",
    },
    body: {
      de: [
        { type: "p", text: "Reinigung ist die häufigste Beanstandung bei deutschen Kontrollen. Nicht weil zu wenig geputzt wird – sondern weil die Nachweise fehlen." },
        { type: "h2", text: "Frequenz, Verantwortung, Kontrolle" },
        { type: "p", text: "Jede Fläche braucht drei Angaben: Häufigkeit, verantwortliche Person, Kontrollperson. Haccora erzeugt automatisch Schichtchecklisten aus Ihrem Reinigungsplan." },
        { type: "ul", items: [
          "Tägliche Punkte (Arbeitsflächen, Böden, Handkontaktflächen)",
          "Wöchentliche Punkte (Abzugshauben-Filter, Kühlraumdichtungen)",
          "Monatliche Punkte (Tiefenreinigung, Fettabscheider)",
        ]},
      ],
      en: [
        { type: "p", text: "Cleaning is the most common finding in German inspections — not because kitchens aren't cleaned enough, but because the evidence is missing." },
        { type: "h2", text: "Frequency, responsibility, verification" },
        { type: "p", text: "Every surface needs three data points: frequency, responsible person, verifying person. Haccora auto-generates shift checklists from your cleaning plan." },
        { type: "ul", items: [
          "Daily items (work surfaces, floors, hand-contact points)",
          "Weekly items (hood filters, cooler gaskets)",
          "Monthly items (deep clean, grease traps)",
        ]},
      ],
    },
  },
  {
    slug: "prepare-food-safety-inspection",
    image: inspectionImg,
    imageAlt: {
      de: "Lebensmittelkontrolleur mit Klemmbrett bei der Prüfung",
      en: "Food safety inspector with clipboard during a visit",
    },
    date: "2026-04-30",
    readMinutes: 6,
    category: { de: "Regulatorik", en: "Regulation" },
    author: "Anja Braun",
    tags: ["Inspection", "IfSG"],
    title: {
      de: "So bereiten Sie sich in 20 Minuten auf eine Lebensmittelkontrolle vor",
      en: "How to prepare for a food safety inspection in 20 minutes",
    },
    excerpt: {
      de: "Inspector Mode zeigt Prüfern in Sekunden die richtigen Nachweise – ohne Ordner-Wälzen.",
      en: "Inspector Mode gives officers the right evidence in seconds — no binder-hunting.",
    },
    body: {
      de: [
        { type: "p", text: "Deutsche Kontrollen sind unangekündigt. Wer erst dann sucht, verliert Zeit und Vertrauen. Mit einem strukturierten System sind Sie in 20 Minuten prüfbereit." },
        { type: "h2", text: "Die Checkliste vor dem Termin" },
        { type: "ul", items: [
          "HACCP-Plan aktuell und freigegeben",
          "Temperaturprotokolle der letzten 30 Tage",
          "Reinigungsnachweise der letzten Woche",
          "Schulungsnachweise nach IfSG §43",
          "Allergen- und Zusatzstoffkennzeichnung aktuell",
        ]},
      ],
      en: [
        { type: "p", text: "German inspections are unannounced. Searching only when the inspector arrives costs time and trust. With a structured system you're inspection-ready in 20 minutes." },
        { type: "h2", text: "The pre-visit checklist" },
        { type: "ul", items: [
          "HACCP plan current and approved",
          "Temperature logs for the last 30 days",
          "Cleaning evidence for the last week",
          "Training records per IfSG §43",
          "Allergen and additive labelling current",
        ]},
      ],
    },
  },
  {
    slug: "eu-14-allergens-labelling",
    image: allergensImg,
    imageAlt: {
      de: "14 EU-Allergen-Symbole auf Marmorarbeitsplatte",
      en: "14 EU allergen symbols on a marble counter",
    },
    date: "2026-03-11",
    readMinutes: 4,
    category: { de: "Rezepte", en: "Recipes" },
    author: "Sophie Klein",
    tags: ["Allergens", "LMIV"],
    title: {
      de: "14 EU-Allergene: automatische Kennzeichnung, die stimmt",
      en: "14 EU allergens: automatic labelling that actually holds up",
    },
    excerpt: {
      de: "Rezepte, Zutaten und Lieferantenwechsel – warum manuelle Allergenlisten in Deutschland gefährlich sind.",
      en: "Recipes, ingredients, supplier changes — why manual allergen lists are risky in Germany.",
    },
    body: {
      de: [
        { type: "p", text: "Die LMIV verpflichtet Sie, alle 14 EU-Hauptallergene korrekt und aktuell auszuweisen. Ein Wechsel von einer Sauce reicht, um Ihre gesamte Karte veraltet zu machen." },
        { type: "h2", text: "So löst Haccora das" },
        { type: "p", text: "Zutaten sind mit ihren Allergenen verknüpft. Ändern Sie eine Zutat oder wechseln Sie den Lieferanten, aktualisieren sich alle Rezepte und Menükarten automatisch – inklusive Prüfnachweis." },
      ],
      en: [
        { type: "p", text: "EU FIC obliges you to declare all 14 major allergens correctly and up to date. A single sauce swap is enough to make your entire menu outdated." },
        { type: "h2", text: "How Haccora solves it" },
        { type: "p", text: "Ingredients carry allergen data. Change one ingredient or swap a supplier, and every linked recipe and menu updates automatically — with an audit trail." },
      ],
    },
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string, lang: Language) {
  return new Date(iso).toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
