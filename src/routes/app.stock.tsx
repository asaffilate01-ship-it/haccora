import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Boxes, Truck, ClipboardList, PackageCheck, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/stock")({
  component: StockPage,
});

type Item = {
  id: string; skuDe: string; skuEn: string;
  categoryDe: string; categoryEn: string;
  qty: number; unit: string; par: number; supplier: string;
};

const STOCK: Item[] = [
  { id:"s1", skuDe:"Rinderhack (frisch)", skuEn:"Beef mince (fresh)",  categoryDe:"Fleisch",   categoryEn:"Meat",     qty:4.2, unit:"kg",  par:8,  supplier:"Metzgerei Wagner" },
  { id:"s2", skuDe:"Olivenöl EV",          skuEn:"Olive oil EV",         categoryDe:"Trocken",   categoryEn:"Dry",      qty:11,  unit:"L",   par:6,  supplier:"Chef Direct" },
  { id:"s3", skuDe:"Tomaten San Marzano",  skuEn:"San Marzano tomatoes", categoryDe:"Konserven", categoryEn:"Tinned",   qty:14,  unit:"tin", par:20, supplier:"Chef Direct" },
  { id:"s4", skuDe:"Vollmilch 3.5%",       skuEn:"Whole milk 3.5%",      categoryDe:"Molkerei",  categoryEn:"Dairy",    qty:2,   unit:"L",   par:12, supplier:"Molkerei Nord" },
  { id:"s5", skuDe:"Basilikum",            skuEn:"Basil",                categoryDe:"Kräuter",   categoryEn:"Herbs",    qty:0.2, unit:"kg",  par:0.5,supplier:"Bio Frisch" },
];

const DELIVERIES = [
  { id:"d1", ref:"PO-2408-014", supplier:"Metzgerei Wagner", dateDe:"Heute 07:32", dateEn:"Today 07:32", status:"accepted", tempDe:"3.1 °C ✓", tempEn:"3.1 °C ✓", items:6 },
  { id:"d2", ref:"PO-2408-015", supplier:"Chef Direct",       dateDe:"Heute 08:15", dateEn:"Today 08:15", status:"partial",  tempDe:"n/a",       tempEn:"n/a",       items:14 },
  { id:"d3", ref:"PO-2408-013", supplier:"Molkerei Nord",     dateDe:"Gestern",     dateEn:"Yesterday",    status:"rejected", tempDe:"8.4 °C ✗", tempEn:"8.4 °C ✗", items:4 },
];

function StockPage() {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const [tab, setTab] = useState<"stock" | "delivery" | "take">("stock");

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">{t("Bestand", "Inventory")}</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("Bestand & Wareneingang", "Stock & receiving")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("Bestände, Inventuren und Wareneingang – mit Temperaturprüfung.",
             "Live stock, stock-takes and delivery acceptance — with temp check.")}
        </p>
      </div>

      <div className="inline-flex rounded-full border border-border bg-card p-1 text-sm">
        <Tab active={tab==="stock"}    onClick={() => setTab("stock")}    icon={Boxes}         label={t("Bestand","Stock")} />
        <Tab active={tab==="delivery"} onClick={() => setTab("delivery")} icon={Truck}         label={t("Wareneingang","Receiving")} />
        <Tab active={tab==="take"}     onClick={() => setTab("take")}     icon={ClipboardList} label={t("Inventur","Stock-take")} />
      </div>

      {tab === "stock" && (
        <div className="surface overflow-hidden">
          <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
            <div className="col-span-4">{t("Artikel","Item")}</div>
            <div className="col-span-2">{t("Kategorie","Category")}</div>
            <div className="col-span-2">{t("Bestand","On hand")}</div>
            <div className="col-span-2">{t("Par","Par")}</div>
            <div className="col-span-2">{t("Lieferant","Supplier")}</div>
          </div>
          <ul className="divide-y divide-border">
            {STOCK.map((s) => {
              const low = s.qty < s.par * 0.5;
              return (
                <li key={s.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-2 px-5 py-3 text-sm">
                  <div className="md:col-span-4 flex items-center gap-2">
                    <Boxes size={14} className="text-muted-foreground" />
                    <span className="font-medium">{lang==="de"?s.skuDe:s.skuEn}</span>
                  </div>
                  <div className="md:col-span-2 text-xs text-muted-foreground">{lang==="de"?s.categoryDe:s.categoryEn}</div>
                  <div className="md:col-span-2">
                    <span className={`font-mono text-sm ${low ? "text-destructive font-bold" : ""}`}>{s.qty} {s.unit}</span>
                    {low && <span className="ml-2 text-[10px] font-bold uppercase text-destructive">{t("Niedrig","Low")}</span>}
                  </div>
                  <div className="md:col-span-2 font-mono text-xs text-muted-foreground">{s.par} {s.unit}</div>
                  <div className="md:col-span-2 text-xs">{s.supplier}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {tab === "delivery" && (
        <div className="space-y-3">
          {DELIVERIES.map((d) => {
            const badge =
              d.status === "accepted"  ? { deL:"Angenommen", enL:"Accepted", cls:"bg-success/15 text-success" }
            : d.status === "partial"   ? { deL:"Teilweise",  enL:"Partial",  cls:"bg-warning/15 text-warning-foreground" }
                                       : { deL:"Abgelehnt",  enL:"Rejected", cls:"bg-destructive/15 text-destructive" };
            return (
              <div key={d.id} className="surface p-5 flex items-center gap-4">
                <span className="h-11 w-11 rounded-xl bg-secondary grid place-items-center"><Truck size={18} /></span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-display">{d.ref}</div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${badge.cls}`}>{lang==="de"?badge.deL:badge.enL}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{d.supplier} · {d.items} {t("Positionen","lines")} · {lang==="de"?d.dateDe:d.dateEn}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("Kühlkette","Cold chain")}</div>
                  <div className={`font-mono text-sm ${d.status==="rejected" ? "text-destructive" : "text-success"}`}>{lang==="de"?d.tempDe:d.tempEn}</div>
                </div>
                {d.status === "rejected" && <AlertTriangle size={18} className="text-destructive shrink-0" />}
              </div>
            );
          })}
        </div>
      )}

      {tab === "take" && (
        <div className="surface p-10 text-center">
          <PackageCheck size={32} className="mx-auto text-primary mb-3" />
          <div className="font-display text-xl">{t("Wöchentliche Inventur", "Weekly stock-take")}</div>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            {t("Zähle nach Kategorie, GastroSafe vergleicht mit Buchbestand und meldet Abweichungen.",
               "Count by category — GastroSafe reconciles with book stock and flags variance.")}
          </p>
          <button className="btn-alert-solid mt-5">{t("Inventur starten", "Start stock-take")}</button>
        </div>
      )}
    </div>
  );
}

function Tab({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof Boxes; label: string }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-1.5 rounded-full ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
      <Icon size={14} className="inline mr-1.5" />{label}
    </button>
  );
}
