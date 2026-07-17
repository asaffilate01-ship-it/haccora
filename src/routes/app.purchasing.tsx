import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ShoppingCart, CheckCircle2, AlertTriangle, Truck, PlusCircle, PackageCheck } from "lucide-react";

export const Route = createFileRoute("/app/purchasing")({
  component: PurchasingPage,
});

type POStatus = "draft" | "sent" | "partial" | "received" | "rejected";

type PO = {
  id: string;
  supplierDe: string; supplierEn: string;
  totalEur: number;
  eta: string;
  status: POStatus;
  lines: number;
};

const POS: PO[] = [
  { id: "PO-2026-0142", supplierDe: "Metro Cash & Carry", supplierEn: "Metro Cash & Carry",  totalEur: 812.40, eta: "18.07.2026", status: "sent",     lines: 14 },
  { id: "PO-2026-0141", supplierDe: "Bio-Hof Brandenburg", supplierEn: "Bio-Hof Brandenburg", totalEur: 246.00, eta: "17.07.2026", status: "partial",  lines: 8  },
  { id: "PO-2026-0140", supplierDe: "Deutsche See",        supplierEn: "Deutsche See",        totalEur: 419.75, eta: "16.07.2026", status: "received", lines: 5  },
  { id: "PO-2026-0139", supplierDe: "Bäckerei Steinofen",  supplierEn: "Steinofen Bakery",    totalEur: 78.20,  eta: "16.07.2026", status: "rejected", lines: 3  },
  { id: "PO-2026-0138", supplierDe: "Getränke Hansa",      supplierEn: "Hansa Beverages",     totalEur: 512.90, eta: "20.07.2026", status: "draft",    lines: 22 },
];

const INCOMING = [
  { po: "PO-2026-0142", itemDe: "Rinderfilet",  itemEn: "Beef fillet",  qty: 8,   unit: "kg",  tempC: 3.1, ok: true },
  { po: "PO-2026-0142", itemDe: "Blattspinat",  itemEn: "Leaf spinach", qty: 4,   unit: "kg",  tempC: 5.4, ok: true },
  { po: "PO-2026-0141", itemDe: "Freilandeier", itemEn: "Free-range eggs", qty: 240, unit: "pcs", tempC: 6.8, ok: false },
];

function PurchasingPage() {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const [receive, setReceive] = useState<string | null>(null);

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="eyebrow">{t("Beschaffung", "Procurement")}</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("Einkauf & Wareneingang", "Purchasing & receiving")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("Bestellungen erstellen, Lieferungen prüfen, Chargen automatisch anlegen.",
               "Raise POs, verify deliveries, batches created automatically.")}
          </p>
        </div>
        <button className="btn-alert-solid text-sm">
          <PlusCircle size={16} className="inline mr-1.5" />{t("Neue Bestellung", "New PO")}
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Kpi label={t("Offen", "Open")}    value="3" tone="warning" />
        <Kpi label={t("Heute Anlieferung", "Deliveries today")} value="2" tone="info" />
        <Kpi label={t("Ausgaben (Monat)", "Spend (month)")} value="€ 12.480" />
        <Kpi label={t("Annahmequote", "Acceptance rate")} value="96%" tone="success" />
      </div>

      <section>
        <div className="text-sm font-display mb-3">{t("Aktive Bestellungen", "Active purchase orders")}</div>
        <div className="surface overflow-hidden">
          <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
            <div className="col-span-2">{t("Bestellung", "PO")}</div>
            <div className="col-span-3">{t("Lieferant", "Supplier")}</div>
            <div className="col-span-2">ETA</div>
            <div className="col-span-1 text-right">{t("Zeilen", "Lines")}</div>
            <div className="col-span-2 text-right">{t("Summe", "Total")}</div>
            <div className="col-span-2 text-right">{t("Status", "Status")}</div>
          </div>
          <ul className="divide-y divide-border">
            {POS.map((po) => (
              <li key={po.id} className="grid grid-cols-1 md:grid-cols-12 items-center px-5 py-3 text-sm gap-2">
                <div className="md:col-span-2 flex items-center gap-2 font-mono text-xs">
                  <ShoppingCart size={14} className="text-primary" />{po.id}
                </div>
                <div className="md:col-span-3 flex items-center gap-2"><Truck size={14} className="text-muted-foreground" />{lang === "de" ? po.supplierDe : po.supplierEn}</div>
                <div className="md:col-span-2 text-xs text-muted-foreground font-mono">{po.eta}</div>
                <div className="md:col-span-1 text-right text-xs font-mono">{po.lines}</div>
                <div className="md:col-span-2 text-right font-mono text-xs">€ {po.totalEur.toFixed(2)}</div>
                <div className="md:col-span-2 text-right">
                  <StatusBadge status={po.status} t={t} />
                  {(po.status === "sent" || po.status === "partial") && (
                    <button
                      onClick={() => setReceive(receive === po.id ? null : po.id)}
                      className="ml-2 text-[11px] font-semibold text-primary"
                    >
                      {t("Annehmen", "Receive")} →
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {receive && (
        <section className="surface p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="font-display text-base flex items-center gap-2"><PackageCheck size={16} className="text-primary" />{t("Wareneingang prüfen", "Verify delivery")} · <span className="font-mono text-xs">{receive}</span></div>
            <button onClick={() => setReceive(null)} className="text-xs text-muted-foreground">{t("Schließen", "Close")}</button>
          </div>
          <div className="divide-y divide-border">
            {INCOMING.filter((r) => r.po === receive).map((r, i) => (
              <div key={i} className="grid grid-cols-12 items-center py-3 text-sm">
                <div className="col-span-4">{lang === "de" ? r.itemDe : r.itemEn}</div>
                <div className="col-span-2 font-mono text-xs">{r.qty} {r.unit}</div>
                <div className="col-span-3 text-xs">{t("Temperatur", "Temperature")}: <span className={r.ok ? "text-success" : "text-destructive"}>{r.tempC} °C</span></div>
                <div className="col-span-3 text-right">
                  {r.ok ? (
                    <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 size={12} />{t("OK · Charge angelegt", "OK · batch created")}</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-destructive"><AlertTriangle size={12} />{t("Ablehnen · Kühlkette", "Reject · cold chain")}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-2">
            <button className="rounded-full border border-border px-4 py-1.5 text-xs">{t("Teilannahme", "Partial")}</button>
            <button className="btn-alert-solid text-xs">{t("Annahme abschließen", "Complete receipt")}</button>
          </div>
        </section>
      )}
    </div>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone?: "success" | "warning" | "info" }) {
  const toneClass = tone === "success" ? "text-success" : tone === "warning" ? "text-warning-foreground" : tone === "info" ? "text-primary" : "";
  return (
    <div className="surface p-5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`font-display text-3xl mt-2 ${toneClass}`}>{value}</div>
    </div>
  );
}

function StatusBadge({ status, t }: { status: POStatus; t: (a: string, b: string) => string }) {
  const map: Record<POStatus, { cls: string; deL: string; enL: string }> = {
    draft:    { cls: "bg-secondary text-muted-foreground",  deL: "Entwurf",       enL: "Draft" },
    sent:     { cls: "bg-primary/10 text-primary",          deL: "Gesendet",      enL: "Sent" },
    partial:  { cls: "bg-warning/20 text-warning-foreground",deL: "Teilweise",     enL: "Partial" },
    received: { cls: "bg-success/15 text-success",          deL: "Erhalten",      enL: "Received" },
    rejected: { cls: "bg-destructive/15 text-destructive",  deL: "Abgelehnt",     enL: "Rejected" },
  };
  const m = map[status];
  return <span className={`inline-flex text-[10px] font-bold uppercase px-2 py-0.5 rounded ${m.cls}`}>{t(m.deL, m.enL)}</span>;
}
