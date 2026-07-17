import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { AlertOctagon, PlusCircle, ShieldAlert, User, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/incidents")({
  component: IncidentsPage,
});

type Severity = "low" | "medium" | "high";
type Status = "open" | "investigating" | "closed";
type Category = "injury" | "illness" | "contamination" | "pest" | "equipment" | "customer";

interface Incident {
  id: string; dateDe: string; dateEn: string;
  category: Category;
  titleDe: string; titleEn: string;
  who: string;
  severity: Severity; status: Status;
  rootDe?: string; rootEn?: string;
}

const CAT_META: Record<Category, { deL: string; enL: string }> = {
  injury:        { deL: "Verletzung",       enL: "Injury" },
  illness:       { deL: "Erkrankung",       enL: "Illness" },
  contamination: { deL: "Kontamination",    enL: "Contamination" },
  pest:          { deL: "Schädlingsbefall", enL: "Pest sighting" },
  equipment:     { deL: "Geräteausfall",    enL: "Equipment failure" },
  customer:      { deL: "Gastbeschwerde",   enL: "Customer complaint" },
};

const SEED: Incident[] = [
  { id: "i1", dateDe: "Heute 10:22", dateEn: "Today 10:22", category: "injury",        titleDe: "Schnittverletzung Daumen", titleEn: "Thumb laceration",       who: "Omar",  severity: "medium", status: "open" },
  { id: "i2", dateDe: "Gestern",      dateEn: "Yesterday",  category: "contamination", titleDe: "Fremdkörper in Suppe",     titleEn: "Foreign object in soup", who: "Marta", severity: "high",   status: "investigating", rootDe: "Zerbrochenes Sieb", rootEn: "Broken sieve" },
  { id: "i3", dateDe: "12. Aug",      dateEn: "Aug 12",     category: "pest",          titleDe: "Motte in Lager gesichtet", titleEn: "Moth sighted in store",  who: "Aylin", severity: "low",    status: "closed", rootDe: "Rispex-Behandlung",  rootEn: "Rispex treatment" },
  { id: "i4", dateDe: "10. Aug",      dateEn: "Aug 10",     category: "customer",      titleDe: "Allergen-Reaktion Nüsse",  titleEn: "Nut allergen reaction",  who: "Marta", severity: "high",   status: "closed", rootDe: "Menükarte aktualisiert", rootEn: "Menu card updated" },
];

function IncidentsPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const canReport = user ? can(user.role, "incidents.report") : false;
  const canClose  = user ? can(user.role, "incidents.close")  : false;
  const [items, setItems] = useState<Incident[]>(SEED);
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState<Category>("injury");
  const [sev, setSev] = useState<Severity>("medium");
  const [titleDe, setTitleDe] = useState("");

  const kpis = {
    open: items.filter((i) => i.status !== "closed").length,
    high: items.filter((i) => i.severity === "high").length,
    mtd:  items.length,
  };

  const submit = () => {
    if (!titleDe.trim()) return;
    setItems((prev) => [{
      id: `i${Date.now()}`,
      dateDe: t("Gerade eben","Just now"), dateEn: t("Gerade eben","Just now"),
      category: cat, titleDe: titleDe, titleEn: titleDe, who: user?.name.split(" ")[0] ?? "—",
      severity: sev, status: "open",
    }, ...prev]);
    setTitleDe(""); setOpen(false);
  };

  const close = (id: string) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, status: "closed" as Status } : i));
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow">{t("Sicherheit & Meldungen","Safety & reporting")}</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("Vorfälle & Unfälle","Incidents & accidents")}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            {t("Meldepflichtige Ereignisse gemäß ArbSchG §16 und IfSG §42 – mit Ursachenanalyse und Nachweis.",
               "Reportable events under ArbSchG §16 and IfSG §42 — with root-cause analysis and audit trail.")}
          </p>
        </div>
        {canReport && (
          <button onClick={() => setOpen((o) => !o)} className="btn-alert-solid text-sm">
            <PlusCircle size={16} className="inline mr-1.5" />{t("Neuer Vorfall","New incident")}
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Kpi label={t("Offen","Open")}          value={kpis.open} tone="warn" />
        <Kpi label={t("Hohe Priorität","High severity")} value={kpis.high} tone="danger" />
        <Kpi label={t("Diesen Monat","Month-to-date")}   value={kpis.mtd}  tone="neutral" />
      </div>

      {open && canReport && (
        <div className="surface p-5 grid md:grid-cols-4 gap-3">
          <select value={cat} onChange={(e) => setCat(e.target.value as Category)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {(Object.keys(CAT_META) as Category[]).map((c) => (
              <option key={c} value={c}>{lang === "de" ? CAT_META[c].deL : CAT_META[c].enL}</option>
            ))}
          </select>
          <input value={titleDe} onChange={(e) => setTitleDe(e.target.value)}
            placeholder={t("Was ist passiert?","What happened?")}
            className="md:col-span-2 rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <select value={sev} onChange={(e) => setSev(e.target.value as Severity)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option value="low">{t("Niedrig","Low")}</option>
            <option value="medium">{t("Mittel","Medium")}</option>
            <option value="high">{t("Hoch","High")}</option>
          </select>
          <button onClick={submit} className="btn-alert-solid text-sm md:col-span-4">{t("Melden","Report")}</button>
        </div>
      )}

      <div className="surface overflow-hidden">
        <ul className="divide-y divide-border">
          {items.map((i) => (
            <li key={i.id} className="p-5 flex items-start gap-4">
              <span className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${
                i.severity === "high" ? "bg-[color:var(--color-alert-red)]/15 text-[color:var(--color-alert-red)]"
                : i.severity === "medium" ? "bg-amber-500/15 text-amber-700"
                : "bg-secondary text-muted-foreground"
              }`}>
                {i.severity === "high" ? <ShieldAlert size={18} /> : <AlertOctagon size={18} />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    {lang === "de" ? CAT_META[i.category].deL : CAT_META[i.category].enL}
                  </span>
                  <StatusChip status={i.status} lang={lang} />
                </div>
                <div className="font-display text-lg mt-0.5">{lang === "de" ? i.titleDe : i.titleEn}</div>
                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><User size={11} />{i.who}</span>
                  <span className="inline-flex items-center gap-1"><Clock size={11} />{lang === "de" ? i.dateDe : i.dateEn}</span>
                </div>
                {i.rootDe && (
                  <div className="mt-2 text-xs bg-secondary/60 rounded-lg px-3 py-2">
                    <span className="font-bold">{t("Ursache","Root cause")}: </span>{lang === "de" ? i.rootDe : i.rootEn}
                  </div>
                )}
              </div>
              {i.status !== "closed" && canClose && (
                <button onClick={() => close(i.id)}
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-success text-success-foreground hover:brightness-110">
                  <CheckCircle2 size={12} className="inline mr-1" />{t("Abschließen","Close")}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: number; tone: "warn"|"danger"|"neutral" }) {
  const cls = tone === "danger" ? "text-[color:var(--color-alert-red)]" : tone === "warn" ? "text-amber-600" : "text-foreground";
  return (
    <div className="surface p-5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`font-display text-4xl mt-2 ${cls}`}>{value}</div>
    </div>
  );
}

function StatusChip({ status, lang }: { status: Status; lang: "de"|"en" }) {
  const map = {
    open:          { de: "Offen",           en: "Open",          cls: "bg-[color:var(--color-alert-red)]/15 text-[color:var(--color-alert-red)]" },
    investigating: { de: "In Bearbeitung",  en: "Investigating", cls: "bg-amber-100 text-amber-800" },
    closed:        { de: "Abgeschlossen",   en: "Closed",        cls: "bg-success/15 text-success" },
  } as const;
  const m = map[status];
  return <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${m.cls}`}>{lang === "de" ? m.de : m.en}</span>;
}
