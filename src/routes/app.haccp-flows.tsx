import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import {
  Workflow, PackageCheck, Flame, ThermometerSun, Snowflake, Microwave, ShieldCheck,
  CheckCircle2, AlertTriangle, Loader2, ArrowRight, ArrowLeft, X, FileText,
} from "lucide-react";

export const Route = createFileRoute("/app/haccp-flows")({ component: HaccpFlowsPage });

type FlowKey = "goods_in" | "cook" | "hot_hold" | "cool" | "reheat" | "chill";

interface FlowStep {
  id: string;
  labelDe: string;
  labelEn: string;
  kind: "input" | "check" | "note";
  unit?: string;
  targetMin?: number;
  targetMax?: number;
  primary?: boolean; // the CCP measurement
}

interface FlowDef {
  key: FlowKey;
  icon: typeof PackageCheck;
  titleDe: string; titleEn: string;
  ccpDe: string; ccpEn: string;
  regDe: string; regEn: string;
  steps: FlowStep[];
}

const FLOWS: FlowDef[] = [
  {
    key: "goods_in", icon: PackageCheck,
    titleDe: "Wareneingang", titleEn: "Goods receiving",
    ccpDe: "Kerntemperatur ≤ 7 °C (Kühl) / ≤ −18 °C (TK)", ccpEn: "Core temp ≤ 7 °C (chilled) / ≤ −18 °C (frozen)",
    regDe: "VO (EG) 852/2004", regEn: "Reg. (EC) 852/2004",
    steps: [
      { id: "product", labelDe: "Produkt & Charge", labelEn: "Product & batch", kind: "note" },
      { id: "supplier", labelDe: "Lieferant / Fahrzeug sauber", labelEn: "Supplier / vehicle clean", kind: "check" },
      { id: "packaging", labelDe: "Verpackung unbeschädigt", labelEn: "Packaging intact", kind: "check" },
      { id: "temp", labelDe: "Kerntemperatur", labelEn: "Core temperature", kind: "input", unit: "°C", targetMax: 7, primary: true },
      { id: "mhd", labelDe: "MHD / Verbrauchsdatum geprüft", labelEn: "Best-before checked", kind: "check" },
    ],
  },
  {
    key: "cook", icon: Flame,
    titleDe: "Erhitzen / Garen", titleEn: "Cooking",
    ccpDe: "Kerntemperatur ≥ 72 °C für ≥ 2 Min.", ccpEn: "Core temp ≥ 72 °C for ≥ 2 min",
    regDe: "DIN 10508", regEn: "DIN 10508",
    steps: [
      { id: "product", labelDe: "Gericht / Batch", labelEn: "Dish / batch", kind: "note" },
      { id: "temp", labelDe: "Kerntemperatur nach Garen", labelEn: "Core temperature after cook", kind: "input", unit: "°C", targetMin: 72, primary: true },
      { id: "hold", labelDe: "Haltezeit", labelEn: "Hold time", kind: "input", unit: "min", targetMin: 2 },
      { id: "sensory", labelDe: "Sensorik ok (Farbe/Konsistenz)", labelEn: "Sensory ok (colour/texture)", kind: "check" },
    ],
  },
  {
    key: "hot_hold", icon: ThermometerSun,
    titleDe: "Heißhaltung", titleEn: "Hot holding",
    ccpDe: "Temperatur ≥ 65 °C", ccpEn: "Temperature ≥ 65 °C",
    regDe: "DIN 10508", regEn: "DIN 10508",
    steps: [
      { id: "product", labelDe: "Speise / Behälter", labelEn: "Item / container", kind: "note" },
      { id: "temp", labelDe: "Temperatur", labelEn: "Temperature", kind: "input", unit: "°C", targetMin: 65, primary: true },
      { id: "duration", labelDe: "Standzeit seit Zubereitung", labelEn: "Time since prep", kind: "input", unit: "min", targetMax: 180 },
    ],
  },
  {
    key: "cool", icon: Snowflake,
    titleDe: "Abkühlen", titleEn: "Cooling",
    ccpDe: "70 → 10 °C in ≤ 2 h", ccpEn: "70 → 10 °C in ≤ 2 h",
    regDe: "DIN 10508", regEn: "DIN 10508",
    steps: [
      { id: "product", labelDe: "Gericht / Batch", labelEn: "Dish / batch", kind: "note" },
      { id: "startTemp", labelDe: "Starttemperatur", labelEn: "Start temperature", kind: "input", unit: "°C", targetMin: 60 },
      { id: "endTemp", labelDe: "Endtemperatur", labelEn: "End temperature", kind: "input", unit: "°C", targetMax: 10, primary: true },
      { id: "duration", labelDe: "Dauer", labelEn: "Duration", kind: "input", unit: "min", targetMax: 120 },
    ],
  },
  {
    key: "reheat", icon: Microwave,
    titleDe: "Wiedererhitzen", titleEn: "Reheating",
    ccpDe: "Kerntemperatur ≥ 72 °C für ≥ 2 Min.", ccpEn: "Core temp ≥ 72 °C for ≥ 2 min",
    regDe: "DIN 10508", regEn: "DIN 10508",
    steps: [
      { id: "product", labelDe: "Speise / Batch", labelEn: "Dish / batch", kind: "note" },
      { id: "temp", labelDe: "Kerntemperatur", labelEn: "Core temperature", kind: "input", unit: "°C", targetMin: 72, primary: true },
      { id: "hold", labelDe: "Haltezeit", labelEn: "Hold time", kind: "input", unit: "min", targetMin: 2 },
    ],
  },
  {
    key: "chill", icon: Snowflake,
    titleDe: "Kühllagerung", titleEn: "Chilled storage",
    ccpDe: "≤ 7 °C (Kühl) / ≤ −18 °C (TK)", ccpEn: "≤ 7 °C (chilled) / ≤ −18 °C (frozen)",
    regDe: "VO (EG) 852/2004", regEn: "Reg. (EC) 852/2004",
    steps: [
      { id: "unit", labelDe: "Gerät / Standort", labelEn: "Unit / location", kind: "note" },
      { id: "temp", labelDe: "Temperatur", labelEn: "Temperature", kind: "input", unit: "°C", targetMax: 7, primary: true },
      { id: "seal", labelDe: "Türdichtung ok", labelEn: "Door seal ok", kind: "check" },
    ],
  },
];

interface Run {
  id: string;
  flow_key: FlowKey;
  title: string;
  product: string | null;
  ccp_value: number | null;
  ccp_unit: string | null;
  in_range: boolean | null;
  corrective_action: string | null;
  performed_at: string;
  status: string;
}

function HaccpFlowsPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const role = user?.role;
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const canRun = role === "owner" || role === "manager" || role === "chef" || role === "staff";

  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<FlowDef | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("haccp_flow_runs")
      .select("id,flow_key,title,product,ccp_value,ccp_unit,in_range,corrective_action,performed_at,status")
      .order("performed_at", { ascending: false })
      .limit(50);
    setRuns((data ?? []) as Run[]);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todays = runs.filter(r => new Date(r.performed_at) >= today);
    const ok = todays.filter(r => r.in_range === true).length;
    const fail = todays.filter(r => r.in_range === false).length;
    return { total: todays.length, ok, fail };
  }, [runs]);

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow flex items-center gap-2"><Workflow size={12} /> HACCP · {t("Digitale Flows", "Digital flows")}</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("HACCP-Ablaufkontrollen", "HACCP flow checks")}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            {t(
              "Geführte Schritt-für-Schritt-Flows für CCPs mit automatischer Grenzwertprüfung, Korrekturmaßnahme und lückenlosem Nachweis.",
              "Guided step-by-step flows for CCPs with automatic limit validation, corrective action and audit-ready evidence."
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 font-semibold">
            {stats.total} {t("heute", "today")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success px-3 py-1 font-semibold">
            <CheckCircle2 size={12} /> {stats.ok} {t("in Grenze", "in range")}
          </span>
          {stats.fail > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 text-destructive px-3 py-1 font-semibold">
              <AlertTriangle size={12} /> {stats.fail} {t("Abweichung", "out of range")}
            </span>
          )}
        </div>
      </div>

      {/* Flow tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {FLOWS.map(f => {
          const Icon = f.icon;
          return (
            <button
              key={f.key}
              onClick={() => canRun && setActive(f)}
              disabled={!canRun}
              className="card-polished group text-left p-4 hover:-translate-y-0.5 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="icon-3d h-10 w-10 grid place-items-center mb-3 text-primary">
                <Icon size={18} />
              </div>
              <div className="text-sm font-semibold">{t(f.titleDe, f.titleEn)}</div>
              <div className="mt-1 text-[11px] text-muted-foreground line-clamp-2">
                {t(f.ccpDe, f.ccpEn)}
              </div>
              <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition">
                {t("Start", "Start")} <ArrowRight size={10} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent runs */}
      <div className="surface overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-secondary/60 border-b border-border">
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            {t("Letzte Ablaufkontrollen", "Recent flow checks")}
          </div>
          <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
            <ShieldCheck size={11} /> {t("Unveränderlich protokolliert", "Immutably logged")}
          </div>
        </div>
        {loading ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            <Loader2 size={16} className="inline animate-spin mr-2" />{t("Lade…", "Loading…")}
          </div>
        ) : runs.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            {t("Noch keine Ablaufkontrollen. Starten Sie oben einen Flow.", "No flow runs yet. Start a flow above.")}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {runs.map(r => (
              <div key={r.id} className="px-5 py-3 flex items-center gap-3 text-sm">
                <div className={`h-2 w-2 rounded-full ${r.in_range === false ? "bg-destructive" : "bg-success"}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{r.title}{r.product ? ` · ${r.product}` : ""}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {new Date(r.performed_at).toLocaleString(lang === "de" ? "de-DE" : "en-GB")}
                    {r.corrective_action ? ` · ${t("Maßnahme", "Action")}: ${r.corrective_action}` : ""}
                  </div>
                </div>
                {r.ccp_value != null && (
                  <div className={`text-sm font-mono font-semibold ${r.in_range === false ? "text-destructive" : "text-foreground"}`}>
                    {r.ccp_value}{r.ccp_unit ?? ""}
                  </div>
                )}
                {r.in_range === false ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive px-2 py-0.5 text-[10px] font-bold uppercase">
                    <AlertTriangle size={10} /> CCP
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 text-success px-2 py-0.5 text-[10px] font-bold uppercase">
                    <CheckCircle2 size={10} /> OK
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {active && <FlowRunner flow={active} onClose={() => setActive(null)} onSaved={() => { setActive(null); load(); }} />}
    </div>
  );
}

function FlowRunner({ flow, onClose, onSaved }: { flow: FlowDef; onClose: () => void; onSaved: () => void }) {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const [idx, setIdx] = useState(0);
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [notes, setNotes] = useState("");
  const [corrective, setCorrective] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const step = flow.steps[idx];
  const total = flow.steps.length;

  const evaluateStep = (s: FlowStep, raw: string | boolean | undefined): boolean | null => {
    if (raw === undefined || raw === "") return null;
    if (s.kind === "check") return raw === true;
    if (s.kind === "note") return true;
    const n = typeof raw === "string" ? parseFloat(raw) : NaN;
    if (Number.isNaN(n)) return null;
    if (s.targetMin != null && n < s.targetMin) return false;
    if (s.targetMax != null && n > s.targetMax) return false;
    return true;
  };

  const currentOk = step ? evaluateStep(step, values[step.id] as any) : null;
  const primary = flow.steps.find(s => s.primary);
  const primaryRaw = primary ? values[primary.id] : undefined;
  const primaryOk = primary ? evaluateStep(primary, primaryRaw as any) : null;

  const next = () => setIdx(i => Math.min(total - 1, i + 1));
  const prev = () => setIdx(i => Math.max(0, i - 1));

  const finish = async () => {
    setBusy(true); setErr(null);
    const stepsPayload = flow.steps.map(s => ({
      id: s.id,
      label: lang === "de" ? s.labelDe : s.labelEn,
      value: values[s.id] ?? null,
      unit: s.unit ?? null,
      ok: evaluateStep(s, values[s.id] as any),
    }));
    const primaryVal = primary && typeof primaryRaw === "string" && primaryRaw !== ""
      ? parseFloat(primaryRaw as string) : null;
    const inRange = stepsPayload.every(s => s.ok !== false);
    const status = inRange ? "complete" : "corrective";

    const { data: u } = await supabase.auth.getUser();
    const { error } = await supabase.from("haccp_flow_runs").insert({
      flow_key: flow.key,
      title: lang === "de" ? flow.titleDe : flow.titleEn,
      product: (values["product"] as string) || (values["unit"] as string) || null,
      ccp_value: primaryVal,
      ccp_unit: primary?.unit ?? null,
      target_min: primary?.targetMin ?? null,
      target_max: primary?.targetMax ?? null,
      in_range: inRange,
      corrective_action: inRange ? null : (corrective || t("Vorgang wiederholt", "Process repeated")),
      steps: stepsPayload,
      notes: notes || null,
      status,
      performed_by: u.user?.id ?? null,
    });
    setBusy(false);
    if (error) { setErr(error.message); return; }
    onSaved();
  };

  const Icon = flow.icon;
  const isLast = idx === total - 1;
  const needsCorrective = !isLast ? false : flow.steps.some(s => evaluateStep(s, values[s.id] as any) === false);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-card rounded-2xl border border-border shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4 border-b border-border flex items-center gap-3">
          <div className="icon-3d h-10 w-10 grid place-items-center text-primary"><Icon size={18} /></div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold">{t(flow.titleDe, flow.titleEn)}</div>
            <div className="text-[11px] text-muted-foreground truncate">
              CCP: {t(flow.ccpDe, flow.ccpEn)} · {t(flow.regDe, flow.regEn)}
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={16} /></button>
        </div>

        <div className="px-5 pt-3">
          <div className="h-1 rounded-full bg-secondary overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${((idx + 1) / total) * 100}%` }} />
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            {t("Schritt", "Step")} {idx + 1} / {total}
          </div>
        </div>

        <div className="p-5 space-y-4">
          {step && (
            <div>
              <label className="block text-sm font-semibold mb-1.5">{t(step.labelDe, step.labelEn)}</label>
              {step.kind === "input" && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    autoFocus
                    value={(values[step.id] as string) ?? ""}
                    onChange={e => setValues(v => ({ ...v, [step.id]: e.target.value }))}
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-lg font-mono"
                    placeholder={step.unit}
                  />
                  {step.unit && <span className="text-sm text-muted-foreground font-medium">{step.unit}</span>}
                </div>
              )}
              {step.kind === "check" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setValues(v => ({ ...v, [step.id]: true }))}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${values[step.id] === true ? "bg-success/15 border-success text-success" : "border-border"}`}
                  >{t("Ja", "Yes")}</button>
                  <button
                    onClick={() => setValues(v => ({ ...v, [step.id]: false }))}
                    className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${values[step.id] === false ? "bg-destructive/10 border-destructive text-destructive" : "border-border"}`}
                  >{t("Nein", "No")}</button>
                </div>
              )}
              {step.kind === "note" && (
                <input
                  autoFocus
                  value={(values[step.id] as string) ?? ""}
                  onChange={e => setValues(v => ({ ...v, [step.id]: e.target.value }))}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  placeholder={t(step.labelDe, step.labelEn)}
                />
              )}
              {(step.targetMin != null || step.targetMax != null) && (
                <div className="mt-2 text-[11px] text-muted-foreground">
                  {t("Ziel", "Target")}: {step.targetMin != null ? `≥ ${step.targetMin}` : ""} {step.targetMax != null ? `≤ ${step.targetMax}` : ""} {step.unit ?? ""}
                </div>
              )}
              {currentOk === false && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-destructive font-medium">
                  <AlertTriangle size={12} /> {t("Außerhalb der Grenze – Korrekturmaßnahme erforderlich.", "Out of range — corrective action required.")}
                </div>
              )}
            </div>
          )}

          {isLast && (
            <div className="space-y-2">
              {needsCorrective && (
                <div>
                  <label className="block text-xs font-semibold mb-1 text-destructive">
                    {t("Korrekturmaßnahme", "Corrective action")}
                  </label>
                  <input
                    value={corrective}
                    onChange={e => setCorrective(e.target.value)}
                    className="w-full rounded-lg border border-destructive/40 bg-background px-3 py-2 text-sm"
                    placeholder={t("z. B. Nachgaren, Charge verworfen…", "e.g. re-cooked, batch discarded…")}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold mb-1">{t("Notizen", "Notes")}</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              {primary && primaryRaw !== undefined && primaryRaw !== "" && (
                <div className={`rounded-lg px-3 py-2 text-xs font-medium ${primaryOk === false ? "bg-destructive/10 text-destructive" : "bg-success/15 text-success"}`}>
                  <div className="flex items-center gap-1.5">
                    {primaryOk === false ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                    CCP: {primaryRaw as string}{primary.unit} · {primaryOk === false ? t("nicht konform", "non-compliant") : t("konform", "compliant")}
                  </div>
                </div>
              )}
            </div>
          )}

          {err && <div className="rounded-lg bg-destructive/10 text-destructive text-xs px-3 py-2">{err}</div>}
        </div>

        <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-2">
          <button
            onClick={prev}
            disabled={idx === 0}
            className="btn-outline text-sm py-1.5 px-3 disabled:opacity-40"
          >
            <ArrowLeft size={14} className="inline mr-1" /> {t("Zurück", "Back")}
          </button>
          {!isLast ? (
            <button onClick={next} className="btn-alert-solid text-sm py-1.5 px-4">
              {t("Weiter", "Next")} <ArrowRight size={14} className="inline ml-1" />
            </button>
          ) : (
            <button onClick={finish} disabled={busy} className="btn-alert-solid text-sm py-1.5 px-4">
              {busy ? <Loader2 size={14} className="inline animate-spin mr-1" /> : <FileText size={14} className="inline mr-1" />}
              {t("Abschließen & protokollieren", "Finish & log")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
