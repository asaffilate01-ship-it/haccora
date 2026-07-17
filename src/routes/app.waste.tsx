import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Trash2, TrendingDown, PlusCircle } from "lucide-react";

export const Route = createFileRoute("/app/waste")({
  component: WastePage,
});

type WasteEntry = {
  id: string; dateDe: string; dateEn: string;
  itemDe: string; itemEn: string;
  qty: number; unit: string;
  reasonDe: string; reasonEn: string;
  costEur: number;
};

const ENTRIES: WasteEntry[] = [
  { id: "w1", dateDe:"Heute 11:20", dateEn:"Today 11:20", itemDe:"Rinderhack", itemEn:"Beef mince", qty:2.4, unit:"kg", reasonDe:"MHD überschritten", reasonEn:"Past use-by", costEur:22.80 },
  { id: "w2", dateDe:"Heute 09:04", dateEn:"Today 09:04", itemDe:"Blattsalat", itemEn:"Leaf salad",  qty:0.8, unit:"kg", reasonDe:"Welk",             reasonEn:"Wilted",     costEur:3.20 },
  { id: "w3", dateDe:"Gestern",     dateEn:"Yesterday",   itemDe:"Milch 3.5%", itemEn:"Milk 3.5%",   qty:4,   unit:"L",  reasonDe:"Kühlkette",         reasonEn:"Chain broken",costEur:5.60 },
  { id: "w4", dateDe:"Gestern",     dateEn:"Yesterday",   itemDe:"Tellerrest", itemEn:"Plate waste", qty:6.2, unit:"kg", reasonDe:"Gastreste",         reasonEn:"Guest waste", costEur:31.10 },
  { id: "w5", dateDe:"12. Aug",     dateEn:"Aug 12",      itemDe:"Baguette",   itemEn:"Baguette",    qty:8,   unit:"pcs",reasonDe:"Überproduktion",    reasonEn:"Over-prep",   costEur:9.20 },
];

const REASONS_DE = ["MHD überschritten", "Kühlkette", "Welk", "Über­produktion", "Gastreste", "Verbrannt"];
const REASONS_EN = ["Past use-by", "Chain broken", "Wilted", "Over-prep", "Guest waste", "Burnt"];

function WastePage() {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const [open, setOpen] = useState(false);

  const week = 71.90;
  const items = ENTRIES.reduce((n, e) => n + e.qty, 0);
  const co2 = 42.6;

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow">{t("Nachhaltigkeit", "Sustainability")}</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("Abfallprotokoll", "Waste log")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("Verluste erfassen, Ursachen analysieren, Kosten senken.",
               "Log losses, analyse causes, cut costs.")}
          </p>
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-alert-solid text-sm">
          <PlusCircle size={16} className="inline mr-1.5" />{t("Eintrag", "New entry")}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Kpi label={t("Kostenverlust (Woche)", "Cost loss (week)")} value={`€ ${week.toFixed(2)}`} trend={t("−12% vs. Vorwoche", "−12% vs last week")} />
        <Kpi label={t("Menge (Woche)", "Volume (week)")} value={`${items.toFixed(1)} kg`} trend={t("Ziel < 25 kg", "Target < 25 kg")} />
        <Kpi label={t("CO₂-Äquivalent", "CO₂ equivalent")} value={`${co2} kg`} trend={t("−8% vs. Vormonat", "−8% vs last month")} />
      </div>

      {open && (
        <div className="surface p-5 grid md:grid-cols-4 gap-3">
          <input placeholder={t("Artikel", "Item")} className="rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <input placeholder={t("Menge", "Qty")} className="rounded-lg border border-border bg-card px-3 py-2 text-sm" />
          <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {(lang==="de"?REASONS_DE:REASONS_EN).map((r) => <option key={r}>{r}</option>)}
          </select>
          <button className="btn-alert-solid text-sm">{t("Speichern","Save")}</button>
        </div>
      )}

      <div className="surface overflow-hidden">
        <div className="grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
          <div className="col-span-2">{t("Datum","Date")}</div>
          <div className="col-span-3">{t("Artikel","Item")}</div>
          <div className="col-span-2">{t("Menge","Qty")}</div>
          <div className="col-span-3">{t("Grund","Reason")}</div>
          <div className="col-span-2 text-right">{t("Kosten","Cost")}</div>
        </div>
        <ul className="divide-y divide-border">
          {ENTRIES.map((e) => (
            <li key={e.id} className="grid grid-cols-12 items-center px-5 py-3 text-sm">
              <div className="col-span-2 text-xs text-muted-foreground">{lang==="de"?e.dateDe:e.dateEn}</div>
              <div className="col-span-3 flex items-center gap-2"><Trash2 size={14} className="text-destructive" />{lang==="de"?e.itemDe:e.itemEn}</div>
              <div className="col-span-2 font-mono text-xs">{e.qty} {e.unit}</div>
              <div className="col-span-3 text-xs">{lang==="de"?e.reasonDe:e.reasonEn}</div>
              <div className="col-span-2 text-right font-mono text-xs">€ {e.costEur.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Kpi({ label, value, trend }: { label: string; value: string; trend: string }) {
  return (
    <div className="surface p-5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-3xl mt-2">{value}</div>
      <div className="text-xs text-success mt-1 flex items-center gap-1"><TrendingDown size={12} />{trend}</div>
    </div>
  );
}
