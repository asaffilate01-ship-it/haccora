import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/haccp")({
  component: HaccpPage,
});

const steps = [
  { k: "goods", ccp: false },
  { k: "chill", ccp: true },
  { k: "prepRaw", ccp: false },
  { k: "cook", ccp: true },
  { k: "hot", ccp: true },
  { k: "serve", ccp: false },
] as const;

function HaccpPage() {
  const { t } = useI18n();
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">HACCP · v3</div>
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
            <div className="text-sm font-medium">{t("common.humanApproval")}</div>
            <p className="text-xs text-muted-foreground mt-1">{t("common.humanApproval.body")}</p>
          </div>
          <button className="btn-outline text-xs py-1.5 px-3"><FileText size={14} /> PDF</button>
          <button className="btn-primary text-xs py-1.5 px-3">{t("common.approve")}</button>
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
          {steps.map((s) => (
            <div key={s.k} className="grid grid-cols-12 px-5 py-4 text-sm items-start gap-2">
              <div className="col-span-2 font-medium">{t(`haccp.step.${s.k}`)}</div>
              <div className="col-span-3 text-muted-foreground">{t(`haccp.hz.${s.k === "prepRaw" ? "cross" : s.k === "cook" ? "survive" : s.k === "serve" ? "allergen" : s.k}`)}</div>
              <div className="col-span-1">
                {s.ccp ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive px-2 py-0.5 text-[10px] font-bold uppercase">
                    <AlertTriangle size={10} /> CCP
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">–</span>
                )}
              </div>
              <div className="col-span-2 text-xs">{t(`haccp.lim.${s.k}`)}</div>
              <div className="col-span-2 text-xs text-muted-foreground">{t(`haccp.mon.${s.k}`)}</div>
              <div className="col-span-2 text-xs text-muted-foreground">{t(`haccp.act.${s.k}`)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
