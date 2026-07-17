import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  AlertTriangle, Bell, CheckCircle2, Clock, Filter, Mail, MessageSquare,
  Smartphone, Thermometer, Sparkles, Users, ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/app/alerts")({
  component: AlertsPage,
});

type Sev = "critical" | "warning" | "info";
type Alert = {
  id: string;
  sev: Sev;
  category: "temperature" | "cleaning" | "training" | "haccp" | "supplier";
  titleDe: string; titleEn: string;
  bodyDe: string;  bodyEn: string;
  location: string;
  when: string;
  ack: boolean;
};

const ALERTS: Alert[] = [
  { id: "a-2411", sev: "critical", category: "temperature",
    titleDe: "Kühlhaus 2 über Grenzwert", titleEn: "Cold room 2 above threshold",
    bodyDe: "8,4 °C für 47 Min. — CCP-1 verletzt. Maßnahme dokumentieren.",
    bodyEn: "8.4 °C for 47 min — CCP-1 breached. Log corrective action.",
    location: "Kreuzberg · Küche", when: "vor 8 Min.", ack: false },
  { id: "a-2410", sev: "warning", category: "training",
    titleDe: "IfSG §43 läuft in 12 Tagen ab", titleEn: "IfSG §43 expires in 12 days",
    bodyDe: "Aylin Yılmaz — Erstbelehrung Auffrischung fällig.",
    bodyEn: "Aylin Yılmaz — first-time instruction refresher due.",
    location: "Kreuzberg · Service", when: "vor 42 Min.", ack: false },
  { id: "a-2409", sev: "warning", category: "cleaning",
    titleDe: "Abzugshaube Nachweis fehlt", titleEn: "Extractor hood proof missing",
    bodyDe: "Monatliche Reinigung durch Firma X überfällig (5 Tage).",
    bodyEn: "Monthly cleaning by contractor overdue (5 days).",
    location: "Kreuzberg · Küche", when: "vor 3 Std.", ack: false },
  { id: "a-2408", sev: "info", category: "supplier",
    titleDe: "Neues Zertifikat: Bio-Metzgerei Weber", titleEn: "New certificate: Weber butchery",
    bodyDe: "IFS Food V8 hochgeladen — gültig bis 12/2026.",
    bodyEn: "IFS Food V8 uploaded — valid through 12/2026.",
    location: "HQ", when: "vor 6 Std.", ack: true },
  { id: "a-2407", sev: "critical", category: "haccp",
    titleDe: "CCP-3 Freigabe erforderlich", titleEn: "CCP-3 approval required",
    bodyDe: "Neue Version des HACCP-Plans wartet auf menschliche Freigabe.",
    bodyEn: "New HACCP plan version awaiting human sign-off.",
    location: "HQ", when: "gestern", ack: false },
  { id: "a-2406", sev: "info", category: "cleaning",
    titleDe: "Schädlingsmonitoring OK", titleEn: "Pest monitoring OK",
    bodyDe: "Externer Bericht (07/2026) — keine Auffälligkeiten.",
    bodyEn: "External report (07/2026) — no findings.",
    location: "Kreuzberg", when: "gestern", ack: true },
];

const CAT_ICON = {
  temperature: Thermometer,
  cleaning: Sparkles,
  training: Users,
  haccp: ShieldCheck,
  supplier: Bell,
} as const;

function AlertsPage() {
  const { t, lang } = useI18n();
  const [filter, setFilter] = useState<"all" | Sev | "open">("open");
  const [items, setItems] = useState(ALERTS);

  const filtered = useMemo(() => items.filter((a) => {
    if (filter === "all") return true;
    if (filter === "open") return !a.ack;
    return a.sev === filter;
  }), [items, filter]);

  const counts = {
    critical: items.filter((a) => a.sev === "critical" && !a.ack).length,
    warning:  items.filter((a) => a.sev === "warning"  && !a.ack).length,
    info:     items.filter((a) => a.sev === "info"     && !a.ack).length,
  };

  const ack = (id: string) => setItems((xs) => xs.map((a) => a.id === id ? { ...a, ack: true } : a));

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="eyebrow">{t("alerts.eyebrow")}</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("alerts.title")}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{t("alerts.sub")}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1">
          {(["open","critical","warning","info","all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wide transition ${
                filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(`alerts.filter.${f}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatTile icon={AlertTriangle} tone="critical" label={t("alerts.tile.critical")} value={counts.critical} />
        <StatTile icon={Clock}          tone="warning"  label={t("alerts.tile.warning")}  value={counts.warning}  />
        <StatTile icon={CheckCircle2}   tone="info"     label={t("alerts.tile.info")}     value={counts.info}     />
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden md:flex items-center px-5 py-3 bg-secondary/60 text-xs uppercase tracking-widest text-muted-foreground">
          <div className="flex-1">{t("alerts.col.event")}</div>
          <div className="w-40">{t("alerts.col.location")}</div>
          <div className="w-28">{t("alerts.col.when")}</div>
          <div className="w-28 text-right">{t("alerts.col.action")}</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((a) => {
            const Icon = CAT_ICON[a.category];
            const title = lang === "de" ? a.titleDe : a.titleEn;
            const body  = lang === "de" ? a.bodyDe  : a.bodyEn;
            return (
              <div key={a.id} className={`px-5 py-4 flex flex-col md:flex-row md:items-center gap-3 ${a.ack ? "opacity-60" : ""}`}>
                <div className="flex-1 flex items-start gap-3 min-w-0">
                  <span className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${
                    a.sev === "critical" ? "bg-destructive/10 text-destructive" :
                    a.sev === "warning"  ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400" :
                                           "bg-secondary text-muted-foreground"
                  }`}><Icon size={16} /></span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{title}</div>
                    <div className="text-xs text-muted-foreground">{body}</div>
                  </div>
                </div>
                <div className="md:w-40 text-xs text-muted-foreground">{a.location}</div>
                <div className="md:w-28 text-xs text-muted-foreground">{a.when}</div>
                <div className="md:w-28 md:text-right">
                  {a.ack ? (
                    <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 size={12} /> {t("alerts.acked")}</span>
                  ) : (
                    <button onClick={() => ack(a.id)} className="text-xs font-semibold text-primary hover:underline">
                      {t("alerts.ack")} →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">{t("alerts.empty")}</div>
          )}
        </div>
      </div>

      <div className="surface p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-muted-foreground" />
          <h2 className="text-lg font-display">{t("alerts.channels.title")}</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">{t("alerts.channels.sub")}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ChannelToggle icon={Mail}       label={t("alerts.channels.email")}     defaultOn />
          <ChannelToggle icon={Smartphone} label={t("alerts.channels.push")}      defaultOn />
          <ChannelToggle icon={MessageSquare} label={t("alerts.channels.sms")} />
        </div>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, tone, label, value }: { icon: typeof AlertTriangle; tone: "critical"|"warning"|"info"; label: string; value: number }) {
  const toneCls =
    tone === "critical" ? "bg-destructive/10 text-destructive"
    : tone === "warning" ? "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
    : "bg-secondary text-muted-foreground";
  return (
    <div className="surface p-5 flex items-center gap-4">
      <span className={`h-11 w-11 rounded-xl grid place-items-center ${toneCls}`}><Icon size={20} /></span>
      <div>
        <div className="text-2xl font-display leading-none">{value}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}

function ChannelToggle({ icon: Icon, label, defaultOn }: { icon: typeof Mail; label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`flex items-center gap-3 rounded-xl border border-border p-4 transition text-left ${on ? "bg-primary/5 border-primary/30" : "bg-card hover:bg-secondary"}`}
    >
      <span className={`h-9 w-9 rounded-lg grid place-items-center ${on ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
        <Icon size={16} />
      </span>
      <div className="flex-1">
        <div className="text-sm font-semibold">{label}</div>
        <div className={`text-xs ${on ? "text-primary" : "text-muted-foreground"}`}>{on ? "On" : "Off"}</div>
      </div>
    </button>
  );
}
