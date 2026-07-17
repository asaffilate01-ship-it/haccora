import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { CalendarClock, Package, AlertTriangle, CheckCircle2, Trash2, Plus, Snowflake } from "lucide-react";

export const Route = createFileRoute("/app/expiry")({
  component: ExpiryPage,
});

type Item = {
  id: string;
  nameDe: string; nameEn: string;
  batch: string;
  location: string;
  qty: string;
  received: string;
  expires: string; // ISO
  storage: "chilled" | "frozen" | "dry";
};

const today = new Date("2026-07-17");
function daysUntil(iso: string) {
  const d = new Date(iso);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

const ITEMS: Item[] = [
  { id: "b-8801", nameDe: "Hähnchenbrust (frisch)", nameEn: "Chicken breast (fresh)", batch: "LOT-2411-A", location: "Kühlhaus 1", qty: "8,2 kg", received: "2026-07-15", expires: "2026-07-18", storage: "chilled" },
  { id: "b-8802", nameDe: "Räucherlachs",           nameEn: "Smoked salmon",           batch: "LOT-2409-C", location: "Kühlhaus 2", qty: "3,1 kg", received: "2026-07-12", expires: "2026-07-19", storage: "chilled" },
  { id: "b-8803", nameDe: "Mozzarella di Bufala",   nameEn: "Buffalo mozzarella",      batch: "LOT-2410-M", location: "Kühlhaus 1", qty: "24 Stk", received: "2026-07-14", expires: "2026-07-22", storage: "chilled" },
  { id: "b-8804", nameDe: "Rinderhack TK",          nameEn: "Ground beef (frozen)",    batch: "LOT-2312-B", location: "TK-1",       qty: "12,5 kg", received: "2026-06-20", expires: "2026-12-20", storage: "frozen" },
  { id: "b-8805", nameDe: "Basmatireis",            nameEn: "Basmati rice",            batch: "LOT-2308-R", location: "Trockenlager", qty: "40 kg", received: "2026-05-02", expires: "2027-05-02", storage: "dry" },
  { id: "b-8806", nameDe: "Frische Sahne 30%",      nameEn: "Fresh cream 30%",         batch: "LOT-2412-S", location: "Kühlhaus 1", qty: "6 L", received: "2026-07-16", expires: "2026-07-20", storage: "chilled" },
  { id: "b-8807", nameDe: "Sushi-Reisessig",        nameEn: "Sushi rice vinegar",      batch: "LOT-2205-V", location: "Trockenlager", qty: "8 L", received: "2026-01-10", expires: "2026-07-16", storage: "dry" },
];

function ExpiryPage() {
  const { t, lang } = useI18n();
  const [items, setItems] = useState(ITEMS);
  const [tab, setTab] = useState<"all"|"expired"|"soon"|"ok">("soon");

  const enriched = useMemo(() => items.map((i) => ({ ...i, d: daysUntil(i.expires) })), [items]);
  const filtered = enriched.filter((i) => {
    if (tab === "all") return true;
    if (tab === "expired") return i.d < 0;
    if (tab === "soon") return i.d >= 0 && i.d <= 3;
    return i.d > 3;
  });

  const stats = {
    expired: enriched.filter((i) => i.d < 0).length,
    soon:    enriched.filter((i) => i.d >= 0 && i.d <= 3).length,
    ok:      enriched.filter((i) => i.d > 3).length,
  };

  const remove = (id: string) => setItems((xs) => xs.filter((i) => i.id !== id));

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="eyebrow">{t("expiry.eyebrow")}</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("expiry.title")}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{t("expiry.sub")}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition">
          <Plus size={14} /> {t("expiry.add")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tile tone="critical" icon={AlertTriangle} value={stats.expired} label={t("expiry.tile.expired")} />
        <Tile tone="warning"  icon={CalendarClock} value={stats.soon}    label={t("expiry.tile.soon")} />
        <Tile tone="ok"       icon={CheckCircle2}  value={stats.ok}      label={t("expiry.tile.ok")} />
      </div>

      <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1 w-fit">
        {(["soon","expired","ok","all"] as const).map((k) => (
          <button key={k} onClick={() => setTab(k)}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wide transition ${
              tab === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}>
            {t(`expiry.tab.${k}`)}
          </button>
        ))}
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
          <div className="col-span-4">{t("expiry.col.product")}</div>
          <div className="col-span-2">{t("expiry.col.batch")}</div>
          <div className="col-span-2">{t("expiry.col.location")}</div>
          <div className="col-span-1">{t("expiry.col.qty")}</div>
          <div className="col-span-2">{t("expiry.col.expires")}</div>
          <div className="col-span-1 text-right">·</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((i) => {
            const status = i.d < 0 ? "expired" : i.d <= 3 ? "soon" : "ok";
            const badgeCls =
              status === "expired" ? "bg-destructive/10 text-destructive"
              : status === "soon"  ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
              : "bg-success/10 text-success";
            const label = i.d < 0 ? t("expiry.badge.expired").replace("{n}", String(-i.d))
                                 : t("expiry.badge.in").replace("{n}", String(i.d));
            return (
              <div key={i.id} className="grid grid-cols-1 md:grid-cols-12 px-5 py-4 items-center gap-3">
                <div className="md:col-span-4 flex items-center gap-3">
                  <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center">
                    {i.storage === "frozen" ? <Snowflake size={16} /> : <Package size={16} />}
                  </span>
                  <div>
                    <div className="font-medium text-sm">{lang === "de" ? i.nameDe : i.nameEn}</div>
                    <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{t(`expiry.storage.${i.storage}`)}</div>
                  </div>
                </div>
                <div className="md:col-span-2 text-xs font-mono text-muted-foreground">{i.batch}</div>
                <div className="md:col-span-2 text-xs">{i.location}</div>
                <div className="md:col-span-1 text-xs">{i.qty}</div>
                <div className="md:col-span-2 text-xs">
                  <div>{i.expires}</div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase mt-1 ${badgeCls}`}>{label}</span>
                </div>
                <div className="md:col-span-1 md:text-right">
                  <button onClick={() => remove(i.id)} className="text-muted-foreground hover:text-destructive transition" aria-label="Remove">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">{t("expiry.empty")}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function Tile({ tone, icon: Icon, value, label }: { tone: "critical"|"warning"|"ok"; icon: typeof AlertTriangle; value: number; label: string }) {
  const cls = tone === "critical" ? "bg-destructive/10 text-destructive"
    : tone === "warning" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
    : "bg-success/10 text-success";
  return (
    <div className="surface p-5 flex items-center gap-4">
      <span className={`h-11 w-11 rounded-xl grid place-items-center ${cls}`}><Icon size={20} /></span>
      <div>
        <div className="text-2xl font-display leading-none">{value}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
