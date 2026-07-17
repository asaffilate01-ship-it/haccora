import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ClipboardList, CheckCircle2, AlertTriangle, PlayCircle, Award, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/audits")({
  component: AuditsPage,
});

type Template = { id: string; nameDe: string; nameEn: string; sections: number; questions: number; refDe: string; refEn: string };

const TEMPLATES: Template[] = [
  { id: "T-DIN",  nameDe: "DIN 10514 Selbstkontrolle", nameEn: "DIN 10514 self-check",       sections: 8, questions: 62, refDe: "DIN 10514",       refEn: "DIN 10514" },
  { id: "T-IFS",  nameDe: "IFS Food v8 Vorbereitung", nameEn: "IFS Food v8 pre-audit",       sections: 12, questions: 240, refDe: "IFS Food v8", refEn: "IFS Food v8" },
  { id: "T-LMHV", nameDe: "LMHV Küchenrundgang",       nameEn: "LMHV kitchen walk-through",   sections: 6, questions: 34, refDe: "LMHV",            refEn: "LMHV" },
  { id: "T-ALL",  nameDe: "Allergen-Kreuzkontamination",nameEn: "Allergen cross-contamination", sections: 4, questions: 22, refDe: "LMIV 1169/2011", refEn: "EU 1169/2011" },
];

type Audit = { id: string; templateDe: string; templateEn: string; dateDe: string; dateEn: string; auditor: string; score: number; findings: number; critical: number; status: "completed" | "in_progress" };

const HISTORY: Audit[] = [
  { id: "A-2026-018", templateDe: "LMHV Küchenrundgang", templateEn: "LMHV kitchen walk-through", dateDe: "Heute 09:20",  dateEn: "Today 09:20",  auditor: "Anna Weber",  score: 92, findings: 4, critical: 0, status: "in_progress" },
  { id: "A-2026-017", templateDe: "DIN 10514",           templateEn: "DIN 10514",                  dateDe: "12.07.2026",  dateEn: "Jul 12, 2026", auditor: "Marta Kowal", score: 88, findings: 7, critical: 1, status: "completed" },
  { id: "A-2026-016", templateDe: "Allergen-Kontrolle",   templateEn: "Allergen check",             dateDe: "05.07.2026",  dateEn: "Jul 5, 2026",  auditor: "Omar E.",    score: 96, findings: 2, critical: 0, status: "completed" },
  { id: "A-2026-015", templateDe: "IFS Food v8",          templateEn: "IFS Food v8",                dateDe: "21.06.2026",  dateEn: "Jun 21, 2026", auditor: "Anna Weber",  score: 81, findings: 14, critical: 2, status: "completed" },
];

function AuditsPage() {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const [tab, setTab] = useState<"templates" | "history">("history");

  const avg = Math.round(HISTORY.filter((h) => h.status === "completed").reduce((s, h) => s + h.score, 0) / HISTORY.filter((h) => h.status === "completed").length);

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">{t("Interne Kontrolle", "Internal control")}</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("Interne Audits", "Internal audits")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("Vorlagen ausführen, Findings dokumentieren, Score verfolgen.",
             "Run templates, log findings, track score over time.")}
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Kpi label={t("Ø Score (90T)", "Avg score (90d)")} value={`${avg}%`} tone="success" icon={Award} />
        <Kpi label={t("Audits (90T)", "Audits (90d)")} value={String(HISTORY.length)} icon={ClipboardList} />
        <Kpi label={t("Kritische Findings", "Critical findings")} value="3" tone="destructive" icon={AlertTriangle} />
        <Kpi label={t("Verbesserung", "Improvement")} value="+7%" tone="success" icon={TrendingUp} />
      </div>

      <div className="inline-flex rounded-full border border-border bg-card p-1 text-sm">
        <button onClick={() => setTab("history")}   className={`px-4 py-1.5 rounded-full ${tab === "history" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t("Verlauf", "History")}</button>
        <button onClick={() => setTab("templates")} className={`px-4 py-1.5 rounded-full ${tab === "templates" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>{t("Vorlagen", "Templates")}</button>
      </div>

      {tab === "history" && (
        <div className="surface overflow-hidden">
          <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
            <div className="col-span-2">{t("Audit", "Audit")}</div>
            <div className="col-span-3">{t("Vorlage", "Template")}</div>
            <div className="col-span-2">{t("Datum", "Date")}</div>
            <div className="col-span-2">{t("Prüfer", "Auditor")}</div>
            <div className="col-span-1 text-right">{t("Findings", "Findings")}</div>
            <div className="col-span-2 text-right">{t("Score", "Score")}</div>
          </div>
          <ul className="divide-y divide-border">
            {HISTORY.map((a) => (
              <li key={a.id} className="grid grid-cols-1 md:grid-cols-12 items-center px-5 py-3 text-sm gap-2">
                <div className="md:col-span-2 font-mono text-xs">{a.id}</div>
                <div className="md:col-span-3">{lang === "de" ? a.templateDe : a.templateEn}</div>
                <div className="md:col-span-2 text-xs text-muted-foreground">{lang === "de" ? a.dateDe : a.dateEn}</div>
                <div className="md:col-span-2 text-xs">{a.auditor}</div>
                <div className="md:col-span-1 text-right text-xs">
                  {a.findings}
                  {a.critical > 0 && <span className="ml-1 text-destructive font-bold">·{a.critical}!</span>}
                </div>
                <div className="md:col-span-2 text-right">
                  <div className="inline-flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full ${a.score >= 90 ? "bg-success" : a.score >= 80 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${a.score}%` }} />
                    </div>
                    <span className={`font-mono text-xs font-bold ${a.score >= 90 ? "text-success" : a.score >= 80 ? "text-warning-foreground" : "text-destructive"}`}>{a.score}%</span>
                  </div>
                  {a.status === "in_progress" && <div className="text-[10px] text-primary mt-0.5">{t("läuft", "in progress")}</div>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "templates" && (
        <div className="grid md:grid-cols-2 gap-4">
          {TEMPLATES.map((tpl) => (
            <div key={tpl.id} className="surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{lang === "de" ? tpl.refDe : tpl.refEn}</div>
                  <div className="font-display text-lg leading-tight mt-0.5">{lang === "de" ? tpl.nameDe : tpl.nameEn}</div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-muted-foreground">
                  <CheckCircle2 size={10} />{tpl.sections}s · {tpl.questions}q
                </span>
              </div>
              <button className="btn-alert-solid text-xs mt-4">
                <PlayCircle size={12} className="inline mr-1.5" />{t("Audit starten", "Start audit")}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Kpi({ label, value, tone, icon: Icon }: { label: string; value: string; tone?: "success" | "warning" | "destructive"; icon: typeof ClipboardList }) {
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
