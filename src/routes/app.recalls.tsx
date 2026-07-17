import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { PackageX, AlertTriangle, ShieldAlert, PlusCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/recalls")({
  component: RecallsPage,
});

type Recall = {
  id: string;
  productDe: string; productEn: string;
  lot: string;
  supplierDe: string; supplierEn: string;
  reasonDe: string; reasonEn: string;
  severity: "high" | "medium" | "low";
  status: "active" | "quarantined" | "closed";
  affectedKg: number;
  dateDe: string; dateEn: string;
};

const RECALLS: Recall[] = [
  { id: "RC-2026-004", productDe: "Hühnerschenkel", productEn: "Chicken thighs",  lot: "L-CHK-2026-118", supplierDe: "Metro Cash & Carry", supplierEn: "Metro Cash & Carry", reasonDe: "Salmonellenverdacht (BVL-Warnung)", reasonEn: "Salmonella suspicion (BVL alert)", severity: "high",   status: "active",      affectedKg: 12.4, dateDe: "Heute 08:12", dateEn: "Today 08:12" },
  { id: "RC-2026-003", productDe: "Feta-Käse 200g", productEn: "Feta cheese 200g", lot: "L-FTA-2026-091", supplierDe: "Bio-Hof Brandenburg", supplierEn: "Bio-Hof Brandenburg", reasonDe: "Listerienbefund Charge",           reasonEn: "Listeria in batch",                severity: "high",   status: "quarantined", affectedKg: 4.8,  dateDe: "Gestern",     dateEn: "Yesterday" },
  { id: "RC-2026-002", productDe: "Sesampaste",      productEn: "Sesame paste",     lot: "L-SES-2026-042", supplierDe: "Orient Import",       supplierEn: "Orient Import",       reasonDe: "Fehlende Allergenkennzeichnung", reasonEn: "Missing allergen label",           severity: "medium", status: "closed",      affectedKg: 2.0,  dateDe: "12.07.2026",  dateEn: "Jul 12, 2026" },
  { id: "RC-2026-001", productDe: "Basmati Reis 5kg",productEn: "Basmati rice 5kg", lot: "L-RIS-2026-011", supplierDe: "Handelshaus Süd",    supplierEn: "Handelshaus Süd",    reasonDe: "Pestizidrückstände",              reasonEn: "Pesticide residues",               severity: "low",    status: "closed",      affectedKg: 15.0, dateDe: "02.07.2026",  dateEn: "Jul 2, 2026" },
];

function RecallsPage() {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const [open, setOpen] = useState(false);

  const active = RECALLS.filter((r) => r.status === "active").length;
  const quarantined = RECALLS.filter((r) => r.status === "quarantined").length;

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow">{t("Sicherheit · § 44 LFGB", "Safety · § 44 LFGB")}</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("Rückrufe & Quarantäne", "Recalls & quarantine")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("BVL/RASFF-Warnungen erfassen, Chargen sperren, betroffene Kunden benachrichtigen.",
               "Track BVL/RASFF alerts, block batches, notify affected customers.")}
          </p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-alert-solid text-sm">
          <PlusCircle size={16} className="inline mr-1.5" />{t("Rückruf melden", "Report recall")}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Kpi label={t("Aktive Rückrufe", "Active recalls")} value={String(active)} tone="destructive" icon={AlertTriangle} />
        <Kpi label={t("Quarantäne (Chargen)", "Quarantined (batches)")} value={String(quarantined)} tone="warning" icon={ShieldAlert} />
        <Kpi label={t("RASFF-Abo aktiv", "RASFF feed active")} value={t("Ja", "Yes")} tone="success" icon={CheckCircle2} />
      </div>

      {open && (
        <div className="surface p-5 grid md:grid-cols-4 gap-3">
          <input placeholder={t("Produkt", "Product")} className="rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <input placeholder={t("Chargen-Nr.", "Lot #")} className="rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <input placeholder={t("Grund", "Reason")} className="rounded-lg border border-border bg-card px-3 py-2 text-sm md:col-span-2" />
          <button className="btn-alert-solid text-sm md:col-span-1">{t("Charge sperren", "Quarantine batch")}</button>
        </div>
      )}

      <div className="surface overflow-hidden">
        <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
          <div className="col-span-2">{t("Rückruf", "Recall")}</div>
          <div className="col-span-3">{t("Produkt", "Product")}</div>
          <div className="col-span-2">{t("Charge", "Lot")}</div>
          <div className="col-span-3">{t("Grund", "Reason")}</div>
          <div className="col-span-1 text-right">{t("Menge", "Qty")}</div>
          <div className="col-span-1 text-right">{t("Status", "Status")}</div>
        </div>
        <ul className="divide-y divide-border">
          {RECALLS.map((r) => (
            <li key={r.id} className="grid grid-cols-1 md:grid-cols-12 items-start px-5 py-3 text-sm gap-2">
              <div className="md:col-span-2 flex items-center gap-2 font-mono text-xs">
                <PackageX size={14} className={r.severity === "high" ? "text-destructive" : r.severity === "medium" ? "text-warning-foreground" : "text-muted-foreground"} />
                {r.id}
              </div>
              <div className="md:col-span-3">
                <div className="font-medium">{lang === "de" ? r.productDe : r.productEn}</div>
                <div className="text-[11px] text-muted-foreground">{lang === "de" ? r.supplierDe : r.supplierEn} · {lang === "de" ? r.dateDe : r.dateEn}</div>
              </div>
              <div className="md:col-span-2 font-mono text-xs">{r.lot}</div>
              <div className="md:col-span-3 text-xs">{lang === "de" ? r.reasonDe : r.reasonEn}</div>
              <div className="md:col-span-1 text-right font-mono text-xs">{r.affectedKg} kg</div>
              <div className="md:col-span-1 text-right">
                <StatusBadge status={r.status} t={t} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Kpi({ label, value, tone, icon: Icon }: { label: string; value: string; tone?: "success" | "warning" | "destructive"; icon: typeof PackageX }) {
  const toneClass =
    tone === "success" ? "text-success" :
    tone === "warning" ? "text-warning-foreground" :
    tone === "destructive" ? "text-destructive" : "";
  return (
    <div className="surface p-5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <Icon size={14} className={`opacity-60 ${toneClass}`} />
      </div>
      <div className={`font-display text-3xl mt-2 ${toneClass}`}>{value}</div>
    </div>
  );
}

function StatusBadge({ status, t }: { status: Recall["status"]; t: (a: string, b: string) => string }) {
  const map: Record<Recall["status"], { cls: string; deL: string; enL: string }> = {
    active:      { cls: "bg-destructive/15 text-destructive", deL: "Aktiv",      enL: "Active" },
    quarantined: { cls: "bg-warning/20 text-warning-foreground", deL: "Quarantäne", enL: "Quarantine" },
    closed:      { cls: "bg-success/15 text-success",         deL: "Geschlossen", enL: "Closed" },
  };
  const m = map[status];
  return <span className={`inline-flex text-[10px] font-bold uppercase px-2 py-0.5 rounded ${m.cls}`}>{t(m.deL, m.enL)}</span>;
}
