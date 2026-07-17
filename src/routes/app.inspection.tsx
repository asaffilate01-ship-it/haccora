import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Gavel, Download, FileCheck2, Lock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/inspection")({
  component: InspectionPage,
});

const contents = ["plan","temp","clean","pest","allerg","ifsg","lmhv","trace","audit"] as const;

function InspectionPage() {
  const { t } = useI18n();
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-07-17");
  const [ready, setReady] = useState(false);

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">GastroSafe Inspector Mode</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("inspection.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("inspection.sub")}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold">
          <Lock size={12} /> {t("inspection.readonly")}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface p-6">
          <h2 className="font-display text-xl">{t("inspection.contents")}</h2>
          <div className="mt-4 divide-y divide-border">
            {contents.map((k) => (
              <div key={k} className="py-3 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary grid place-items-center"><FileCheck2 size={14} /></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{t(`inspection.item.${k}`)}</div>
                  <div className="text-xs text-muted-foreground">{t(`inspection.item.${k}.sub`)}</div>
                </div>
                <span className="text-xs text-success">✓</span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface p-6 h-fit">
          <h2 className="font-display text-xl">{t("inspection.generate")}</h2>
          <p className="text-xs text-muted-foreground mt-1">{t("inspection.desc")}</p>
          <div className="mt-4 space-y-3">
            <label className="block">
              <span className="text-xs text-muted-foreground">{t("inspection.from")}</span>
              <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs text-muted-foreground">{t("inspection.to")}</span>
              <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />
            </label>
          </div>
          <button
            onClick={() => setReady(true)}
            className="btn-primary w-full mt-5"
          >
            <Gavel size={16} /> {t("common.generate")}
          </button>

          {ready && (
            <div className="mt-4 rounded-lg bg-forest-deep text-primary-foreground p-4">
              <div className="text-xs opacity-70 uppercase tracking-widest">{t("common.ready")}</div>
              <div className="font-display text-lg mt-1">{t("inspection.pack")} · {from} → {to}</div>
              <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-3 py-1.5 text-xs font-semibold">
                <Download size={12} /> {t("common.downloadPdf")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
