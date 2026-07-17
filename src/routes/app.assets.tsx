import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Wrench, Thermometer, Flame, Snowflake, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

export const Route = createFileRoute("/app/assets")({
  component: AssetsPage,
});

type Asset = {
  id: string;
  nameDe: string; nameEn: string;
  kind: "fridge" | "freezer" | "oven" | "dishwasher" | "hood";
  serial: string;
  lastServiceDe: string; lastServiceEn: string;
  nextDueDays: number;
  status: "ok" | "due" | "overdue";
};

const ASSETS: Asset[] = [
  { id: "A-01", nameDe: "Kühlschrank Küche 1", nameEn: "Fridge kitchen 1", kind: "fridge",     serial: "LG-KF-8821", lastServiceDe: "12.04.2026", lastServiceEn: "Apr 12, 2026", nextDueDays: 42,  status: "ok" },
  { id: "A-02", nameDe: "Tiefkühler Lager",     nameEn: "Freezer storage",   kind: "freezer",    serial: "LB-TK-3312", lastServiceDe: "08.03.2026", lastServiceEn: "Mar 8, 2026",  nextDueDays: 12,  status: "due" },
  { id: "A-03", nameDe: "Kombidämpfer Rational",nameEn: "Combi oven Rational", kind: "oven",     serial: "RAT-CM-611", lastServiceDe: "02.02.2026", lastServiceEn: "Feb 2, 2026",  nextDueDays: -6,  status: "overdue" },
  { id: "A-04", nameDe: "Spülmaschine",         nameEn: "Dishwasher",        kind: "dishwasher", serial: "WT-DW-441",  lastServiceDe: "22.05.2026", lastServiceEn: "May 22, 2026", nextDueDays: 88,  status: "ok" },
  { id: "A-05", nameDe: "Abzugshaube",           nameEn: "Extractor hood",    kind: "hood",       serial: "AH-EX-114",  lastServiceDe: "15.01.2026", lastServiceEn: "Jan 15, 2026", nextDueDays: 4,   status: "due" },
];

const ICONS = { fridge: Snowflake, freezer: Snowflake, oven: Flame, dishwasher: Wrench, hood: Wrench };

function AssetsPage() {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);

  const overdue = ASSETS.filter((a) => a.status === "overdue").length;
  const due     = ASSETS.filter((a) => a.status === "due").length;

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">{t("Instandhaltung", "Maintenance")}</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("Geräte & Wartung", "Assets & maintenance")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("Kalibrierungen, Wartungsintervalle und Reparaturhistorie – auditsicher.",
             "Calibrations, service intervals and repair history — audit-safe.")}
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Kpi label={t("Geräte", "Assets")}  value={String(ASSETS.length)} icon={Thermometer} />
        <Kpi label={t("Fällig", "Due")}     value={String(due)}           icon={Clock} tone="warning" />
        <Kpi label={t("Überfällig", "Overdue")} value={String(overdue)}   icon={AlertTriangle} tone="destructive" />
        <Kpi label={t("Compliance", "Compliance")} value="94%"            icon={CheckCircle2} tone="success" />
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
          <div className="col-span-4">{t("Gerät", "Asset")}</div>
          <div className="col-span-2">{t("Serien-Nr.", "Serial")}</div>
          <div className="col-span-3">{t("Letzte Wartung", "Last service")}</div>
          <div className="col-span-2">{t("Nächste fällig", "Next due")}</div>
          <div className="col-span-1 text-right">{t("Status", "Status")}</div>
        </div>
        <ul className="divide-y divide-border">
          {ASSETS.map((a) => {
            const Icon = ICONS[a.kind];
            return (
              <li key={a.id} className="grid grid-cols-1 md:grid-cols-12 items-center px-5 py-3 text-sm gap-2">
                <div className="md:col-span-4 flex items-center gap-2.5">
                  <span className="h-9 w-9 rounded-lg bg-secondary grid place-items-center"><Icon size={16} /></span>
                  <div>
                    <div className="font-medium">{lang === "de" ? a.nameDe : a.nameEn}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{a.id}</div>
                  </div>
                </div>
                <div className="md:col-span-2 font-mono text-xs">{a.serial}</div>
                <div className="md:col-span-3 text-xs text-muted-foreground">{lang === "de" ? a.lastServiceDe : a.lastServiceEn}</div>
                <div className="md:col-span-2 text-xs font-mono">
                  {a.nextDueDays < 0
                    ? <span className="text-destructive font-bold">{Math.abs(a.nextDueDays)}d {t("überfällig", "overdue")}</span>
                    : <span className="text-muted-foreground">{a.nextDueDays}d</span>}
                </div>
                <div className="md:col-span-1 text-right">
                  {a.status === "ok"       && <CheckCircle2 size={16} className="inline text-success" />}
                  {a.status === "due"      && <Clock         size={16} className="inline text-warning-foreground" />}
                  {a.status === "overdue"  && <AlertTriangle size={16} className="inline text-destructive" />}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function Kpi({ label, value, icon: Icon, tone }: { label: string; value: string; icon: typeof Wrench; tone?: "success" | "warning" | "destructive" }) {
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
