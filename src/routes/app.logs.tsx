import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  History, Search, Download, Eye, Pencil, Trash2, LogIn, LogOut, ShieldCheck,
  Thermometer, FileText, CheckCircle2, XCircle,
} from "lucide-react";

export const Route = createFileRoute("/app/logs")({
  component: LogsPage,
});

type Action = "view" | "create" | "update" | "delete" | "login" | "logout" | "approve" | "reject";
type Entry = {
  id: string;
  ts: string;
  actor: string;
  role: string;
  action: Action;
  targetDe: string; targetEn: string;
  ip: string;
  channel: "web" | "mobile" | "api";
};

const LOG: Entry[] = [
  { id: "L-8891", ts: "2026-07-17 09:14:22", actor: "Anna Weber",   role: "Owner",   action: "approve", targetDe: "HACCP-Plan v4.2 freigegeben", targetEn: "Approved HACCP plan v4.2", ip: "82.14.9.14",  channel: "web" },
  { id: "L-8890", ts: "2026-07-17 08:52:03", actor: "Omar El-Sayed",role: "Chef",    action: "update",  targetDe: "Temperaturkontrolle Kühlhaus 2", targetEn: "Temperature check cold room 2", ip: "10.0.1.14", channel: "mobile" },
  { id: "L-8889", ts: "2026-07-17 08:41:11", actor: "Aylin Yılmaz", role: "Staff",   action: "create",  targetDe: "Reinigungsnachweis Arbeitsflächen", targetEn: "Cleaning proof — surfaces", ip: "10.0.1.19", channel: "mobile" },
  { id: "L-8888", ts: "2026-07-17 08:02:44", actor: "Marta Kowal",  role: "Manager", action: "login",   targetDe: "Anmeldung", targetEn: "Sign-in", ip: "82.14.9.14", channel: "web" },
  { id: "L-8887", ts: "2026-07-16 22:31:07", actor: "System",       role: "System",  action: "create",  targetDe: "Alarm: Kühlhaus 2 > Grenzwert", targetEn: "Alert: Cold room 2 above threshold", ip: "—", channel: "api" },
  { id: "L-8886", ts: "2026-07-16 18:14:59", actor: "Anna Weber",   role: "Owner",   action: "update",  targetDe: "Lieferant hinzugefügt: Bio-Metzgerei Weber", targetEn: "Supplier added: Weber butchery", ip: "82.14.9.14", channel: "web" },
  { id: "L-8885", ts: "2026-07-16 14:22:18", actor: "Dr. K. Braun", role: "Inspector", action: "view",  targetDe: "Inspektor-Modus geöffnet", targetEn: "Opened inspector mode", ip: "195.4.12.8", channel: "web" },
  { id: "L-8884", ts: "2026-07-16 11:05:41", actor: "Omar El-Sayed",role: "Chef",    action: "reject",  targetDe: "Wareneingang abgelehnt (Temperatur 7 °C)", targetEn: "Goods intake rejected (temp 7 °C)", ip: "10.0.1.14", channel: "mobile" },
  { id: "L-8883", ts: "2026-07-16 09:11:02", actor: "Marta Kowal",  role: "Manager", action: "delete",  targetDe: "Testdatensatz entfernt", targetEn: "Removed test record", ip: "82.14.9.14", channel: "web" },
  { id: "L-8882", ts: "2026-07-15 21:44:33", actor: "Aylin Yılmaz", role: "Staff",   action: "logout",  targetDe: "Abmeldung", targetEn: "Sign-out", ip: "10.0.1.19", channel: "mobile" },
];

const ACTION_ICON: Record<Action, typeof History> = {
  view: Eye, create: FileText, update: Pencil, delete: Trash2,
  login: LogIn, logout: LogOut, approve: CheckCircle2, reject: XCircle,
};

function LogsPage() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [action, setAction] = useState<"all" | Action>("all");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return LOG.filter((e) => {
      if (action !== "all" && e.action !== action) return false;
      if (!s) return true;
      const hay = `${e.actor} ${e.role} ${lang === "de" ? e.targetDe : e.targetEn} ${e.ip}`.toLowerCase();
      return hay.includes(s);
    });
  }, [q, action, lang]);

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="eyebrow">{t("logs.eyebrow")}</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("logs.title")}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{t("logs.sub")}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-secondary transition">
          <Download size={14} /> {t("logs.export")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Tile icon={ShieldCheck} value={LOG.length} label={t("logs.tile.events")} />
        <Tile icon={Pencil}       value={LOG.filter((e) => e.action === "update" || e.action === "create").length} label={t("logs.tile.changes")} />
        <Tile icon={LogIn}         value={LOG.filter((e) => e.action === "login").length} label={t("logs.tile.signins")} />
        <Tile icon={Thermometer}   value={LOG.filter((e) => e.actor === "System").length} label={t("logs.tile.system")} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
          <Search size={14} className="text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("logs.searchPh")}
            className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-full border border-border bg-card p-1">
          {(["all","create","update","delete","approve","reject","login","logout","view"] as const).map((k) => (
            <button key={k} onClick={() => setAction(k)}
              className={`text-[11px] px-2.5 py-1.5 rounded-full font-semibold uppercase tracking-wide transition ${
                action === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>
              {t(`logs.action.${k}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
          <div className="col-span-3">{t("logs.col.when")}</div>
          <div className="col-span-3">{t("logs.col.actor")}</div>
          <div className="col-span-1">{t("logs.col.action")}</div>
          <div className="col-span-3">{t("logs.col.target")}</div>
          <div className="col-span-1">{t("logs.col.channel")}</div>
          <div className="col-span-1">{t("logs.col.ip")}</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((e) => {
            const Icon = ACTION_ICON[e.action];
            const actionTone =
              e.action === "delete" || e.action === "reject" ? "bg-destructive/10 text-destructive"
              : e.action === "approve" || e.action === "create" ? "bg-success/10 text-success"
              : "bg-secondary text-muted-foreground";
            return (
              <div key={e.id} className="grid grid-cols-1 md:grid-cols-12 px-5 py-3 items-center gap-3 text-sm">
                <div className="md:col-span-3 font-mono text-xs text-muted-foreground">{e.ts}</div>
                <div className="md:col-span-3">
                  <div className="font-medium truncate">{e.actor}</div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{e.role}</div>
                </div>
                <div className="md:col-span-1">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${actionTone}`}>
                    <Icon size={10} /> {t(`logs.action.${e.action}`)}
                  </span>
                </div>
                <div className="md:col-span-3 text-xs">{lang === "de" ? e.targetDe : e.targetEn}</div>
                <div className="md:col-span-1 text-[11px] uppercase tracking-widest text-muted-foreground">{e.channel}</div>
                <div className="md:col-span-1 text-xs font-mono text-muted-foreground">{e.ip}</div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-muted-foreground">{t("logs.empty")}</div>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground max-w-3xl">{t("logs.footer")}</p>
    </div>
  );
}

function Tile({ icon: Icon, value, label }: { icon: typeof History; value: number; label: string }) {
  return (
    <div className="surface p-5 flex items-center gap-4">
      <span className="h-11 w-11 rounded-xl grid place-items-center bg-primary/10 text-primary"><Icon size={20} /></span>
      <div>
        <div className="text-2xl font-display leading-none">{value}</div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{label}</div>
      </div>
    </div>
  );
}
