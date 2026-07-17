import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/haccp")({
  component: HaccpPage,
});

const steps = [
  { step: "Wareneingang",       hazard: "Mikrobiologisch (Salmonellen)", ccp: false, limit: "≤ 7 °C bei Lieferung", monitor: "Temp bei jeder Lieferung", action: "Ablehnen · Foto · Lieferant benachrichtigen" },
  { step: "Kühllagerung",       hazard: "Mikrobiologisches Wachstum",    ccp: true,  limit: "0–5 °C kontinuierlich", monitor: "Sensor 15 min · manuell 3×/Tag", action: "Umlagern · Prüfen · Kalibrieren" },
  { step: "Zubereitung roh",    hazard: "Kreuzkontamination Allergene",  ccp: false, limit: "Farbcodierung Boards",  monitor: "Sichtprüfung Schichtbeginn", action: "Neu waschen · Personal schulen" },
  { step: "Erhitzen",           hazard: "Überleben pathogener Keime",    ccp: true,  limit: "Kerntemp ≥ 75 °C, 2 Min", monitor: "Sonde · Charge",              action: "Weiter erhitzen · Charge verwerfen" },
  { step: "Heißhalten",         hazard: "Mikrobiologisches Wachstum",    ccp: true,  limit: "≥ 65 °C, max. 3 h",       monitor: "Stündlich Sonde",             action: "Erneut erhitzen · Verwerfen" },
  { step: "Ausgabe/Verpackung", hazard: "Allergen-Kontamination",        ccp: false, limit: "Etikett + Trennung",     monitor: "Sichtprüfung",                 action: "Rückruf-Workflow" },
];

function HaccpPage() {
  const { t } = useI18n();
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">HACCP Plan · v3</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("haccp.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("haccp.sub")}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 text-accent-foreground px-3 py-1 text-xs font-semibold">
            <Sparkles size={12} /> {t("haccp.status.draft")}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/15 text-success px-3 py-1 text-xs font-semibold">
            <CheckCircle2 size={12} /> {t("haccp.status.approved")} 12.06.2026
          </span>
        </div>
      </div>

      <div className="surface p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
            <ShieldCheck size={18} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">Menschliche Freigabe erforderlich</div>
            <p className="text-xs text-muted-foreground mt-1">
              AI kann den Plan entwerfen. Erst nach Prüfung durch eine qualifizierte Person wird er aktiviert.
              Die letzten Änderungen: 2 neue CCPs, aktualisierte Grenzwerte für Sous-vide.
            </p>
          </div>
          <button className="btn-outline text-xs py-1.5 px-3"><FileText size={14} /> PDF</button>
          <button className="btn-primary text-xs py-1.5 px-3">Freigeben</button>
        </div>
      </div>

      <div className="surface overflow-hidden">
        <div className="grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
          <div className="col-span-2">{t("haccp.step")}</div>
          <div className="col-span-3">{t("haccp.hazard")}</div>
          <div className="col-span-1">{t("haccp.ccp")}</div>
          <div className="col-span-2">{t("haccp.limit")}</div>
          <div className="col-span-2">{t("haccp.monitor")}</div>
          <div className="col-span-2">{t("haccp.action")}</div>
        </div>
        <div className="divide-y divide-border">
          {steps.map((s, i) => (
            <div key={i} className="grid grid-cols-12 px-5 py-4 text-sm items-start gap-2">
              <div className="col-span-2 font-medium">{s.step}</div>
              <div className="col-span-3 text-muted-foreground">{s.hazard}</div>
              <div className="col-span-1">
                {s.ccp ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive px-2 py-0.5 text-[10px] font-bold uppercase">
                    <AlertTriangle size={10} /> CCP
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">–</span>
                )}
              </div>
              <div className="col-span-2 text-xs">{s.limit}</div>
              <div className="col-span-2 text-xs text-muted-foreground">{s.monitor}</div>
              <div className="col-span-2 text-xs text-muted-foreground">{s.action}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
