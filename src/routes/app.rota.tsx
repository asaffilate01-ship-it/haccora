import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { CalendarDays, Clock, Play, Square, User } from "lucide-react";

export const Route = createFileRoute("/app/rota")({
  component: RotaPage,
});

const DAYS_DE = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const DAYS_EN = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Shift = { day: number; start: string; end: string; roleDe: string; roleEn: string };
type Person = { name: string; initials: string; shifts: Shift[] };

const TEAM: Person[] = [
  { name: "Omar El-Sayed",   initials: "OE", shifts: [
    { day:0, start:"14:00", end:"22:00", roleDe:"Küche", roleEn:"Kitchen" },
    { day:1, start:"14:00", end:"22:00", roleDe:"Küche", roleEn:"Kitchen" },
    { day:3, start:"09:00", end:"17:00", roleDe:"Küche", roleEn:"Kitchen" },
    { day:4, start:"14:00", end:"23:00", roleDe:"Küche", roleEn:"Kitchen" },
    { day:5, start:"14:00", end:"23:00", roleDe:"Küche", roleEn:"Kitchen" },
  ]},
  { name: "Aylin Yılmaz",    initials: "AY", shifts: [
    { day:0, start:"17:00", end:"23:00", roleDe:"Service", roleEn:"Service" },
    { day:2, start:"11:00", end:"17:00", roleDe:"Service", roleEn:"Service" },
    { day:4, start:"17:00", end:"23:00", roleDe:"Service", roleEn:"Service" },
    { day:5, start:"17:00", end:"23:59", roleDe:"Service", roleEn:"Service" },
    { day:6, start:"11:00", end:"17:00", roleDe:"Service", roleEn:"Service" },
  ]},
  { name: "Marta Kowalska",  initials: "MK", shifts: [
    { day:0, start:"06:00", end:"14:00", roleDe:"Reinigung", roleEn:"Cleaning" },
    { day:1, start:"06:00", end:"14:00", roleDe:"Reinigung", roleEn:"Cleaning" },
    { day:2, start:"06:00", end:"14:00", roleDe:"Reinigung", roleEn:"Cleaning" },
    { day:4, start:"22:00", end:"23:59", roleDe:"Schluss",   roleEn:"Close-out" },
  ]},
  { name: "Jonas Weber",     initials: "JW", shifts: [
    { day:1, start:"09:00", end:"18:00", roleDe:"Manager", roleEn:"Manager" },
    { day:3, start:"09:00", end:"18:00", roleDe:"Manager", roleEn:"Manager" },
    { day:5, start:"11:00", end:"20:00", roleDe:"Manager", roleEn:"Manager" },
  ]},
];

const CLOCKINS = [
  { name: "Omar El-Sayed",  in: "13:58", out: null,     dur: null,   roleDe:"Küche",   roleEn:"Kitchen" },
  { name: "Marta Kowalska", in: "05:56", out: "14:04",  dur: "8h 08", roleDe:"Reinigung", roleEn:"Cleaning" },
  { name: "Aylin Yılmaz",   in: null,    out: null,     dur: null,   roleDe:"Service", roleEn:"Service" },
  { name: "Jonas Weber",    in: "08:47", out: null,     dur: null,   roleDe:"Manager", roleEn:"Manager" },
];

function RotaPage() {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const days = lang === "de" ? DAYS_DE : DAYS_EN;
  const [tab, setTab] = useState<"rota" | "clock">("rota");

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">{t("Personal", "Workforce")}</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("Dienstplan & Stempeluhr", "Rota & clock-in")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("Woche 33 · 12. – 18. August · Arbeitszeitgesetz-konform (ArbZG).",
             "Week 33 · Aug 12–18 · compliant with German working-time act (ArbZG).")}
        </p>
      </div>

      <div className="inline-flex rounded-full border border-border bg-card p-1 text-sm">
        <button onClick={() => setTab("rota")}
          className={`px-4 py-1.5 rounded-full ${tab==="rota"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
          <CalendarDays size={14} className="inline mr-1.5" />{t("Dienstplan", "Rota")}
        </button>
        <button onClick={() => setTab("clock")}
          className={`px-4 py-1.5 rounded-full ${tab==="clock"?"bg-primary text-primary-foreground":"text-muted-foreground"}`}>
          <Clock size={14} className="inline mr-1.5" />{t("Stempeluhr", "Clock-in")}
        </button>
      </div>

      {tab === "rota" && (
        <div className="surface overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-secondary/60 text-muted-foreground uppercase tracking-widest">
                <th className="text-left p-3 font-semibold min-w-[10rem]">{t("Mitarbeiter", "Staff")}</th>
                {days.map((d) => <th key={d} className="p-3 font-semibold text-center">{d}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TEAM.map((p) => (
                <tr key={p.name}>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-[10px] font-bold">{p.initials}</span>
                      <span className="font-medium text-sm">{p.name}</span>
                    </div>
                  </td>
                  {days.map((_, i) => {
                    const s = p.shifts.find((x) => x.day === i);
                    return (
                      <td key={i} className="p-2 align-top">
                        {s ? (
                          <div className="rounded-lg bg-primary/10 border border-primary/20 px-2 py-1.5 text-center">
                            <div className="text-[11px] font-bold text-primary">{s.start}–{s.end}</div>
                            <div className="text-[9px] uppercase tracking-widest text-muted-foreground">{lang==="de"?s.roleDe:s.roleEn}</div>
                          </div>
                        ) : (
                          <div className="h-10 rounded-lg border border-dashed border-border/60" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "clock" && (
        <div className="grid md:grid-cols-2 gap-4">
          {CLOCKINS.map((c) => (
            <div key={c.name} className="surface p-5 flex items-center gap-4">
              <span className="h-11 w-11 rounded-full bg-secondary grid place-items-center"><User size={18} /></span>
              <div className="flex-1 min-w-0">
                <div className="font-display">{c.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{lang==="de"?c.roleDe:c.roleEn}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {c.in ? <><span className="font-mono">{c.in}</span> → {c.out ? <span className="font-mono">{c.out}</span> : <span className="text-success font-semibold">{t("aktiv","live")}</span>}</> : t("Nicht eingestempelt", "Not clocked in")}
                  {c.dur && <span className="ml-2 text-foreground/60">· {c.dur}</span>}
                </div>
              </div>
              {c.in && !c.out ? (
                <button className="btn-alert-outline text-xs px-3 py-1.5"><Square size={12} className="inline mr-1" />{t("Aus","Out")}</button>
              ) : !c.in ? (
                <button className="btn-alert-solid text-xs px-3 py-1.5"><Play size={12} className="inline mr-1" />{t("Ein","In")}</button>
              ) : (
                <span className="text-[10px] font-bold uppercase text-success">{t("Erledigt","Done")}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
