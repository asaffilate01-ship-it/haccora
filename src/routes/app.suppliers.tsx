import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Truck, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/suppliers")({
  component: SuppliersPage,
});

const suppliers = [
  { nameK: "sup.metro",     catK: "sup.metro.cat",     certs: ["IFS", "BIO"], status: "active" as const, score: 96, noteK: null },
  { nameK: "sup.havel",     catK: "sup.havel.cat",     certs: ["QS", "BIO"],  status: "active" as const, score: 92, noteK: "sup.havel.note" },
  { nameK: "sup.ostsee",    catK: "sup.ostsee.cat",    certs: ["MSC"],        status: "review" as const, score: 78, noteK: "sup.ostsee.note" },
  { nameK: "sup.baeckerei", catK: "sup.baeckerei.cat", certs: ["QS"],         status: "active" as const, score: 88, noteK: null },
  { nameK: "sup.wein",      catK: "sup.wein.cat",      certs: ["EU-Bio"],     status: "active" as const, score: 94, noteK: null },
  { nameK: "sup.chem",      catK: "sup.chem.cat",      certs: ["DGUV"],       status: "active" as const, score: 90, noteK: "sup.chem.note" },
];

function SuppliersPage() {
  const { t } = useI18n();
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">{t("suppliers.eyebrow")}</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("suppliers.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("suppliers.sub")}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.nameK} className="surface p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><Truck size={16} /></span>
                <div>
                  <h3 className="font-display text-lg leading-tight">{t(s.nameK)}</h3>
                  <div className="text-xs text-muted-foreground">{t(s.catK)}</div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                s.status === "active" ? "bg-success/15 text-success" : "bg-warning/20 text-warning-foreground border border-warning/40"
              }`}>
                {s.status === "active" ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />} {t(`common.${s.status}`)}
              </span>
            </div>

            <div className="mt-4 flex gap-1.5">
              {s.certs.map((c) => (
                <span key={c} className="text-[10px] font-semibold rounded-full border border-border bg-secondary/60 px-2 py-0.5">{c}</span>
              ))}
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("suppliers.performance")}</div>
                <div className="font-display text-2xl">{s.score}<span className="text-sm text-muted-foreground">/100</span></div>
              </div>
              <div className="h-16 w-16 rounded-full grid place-items-center bg-secondary/60 relative">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{ background: `conic-gradient(var(--color-primary) ${s.score * 3.6}deg, transparent 0)` }}
                />
                <div className="relative h-12 w-12 rounded-full bg-card grid place-items-center font-display text-sm">{s.score}%</div>
              </div>
            </div>

            {s.noteK && (
              <div className="mt-3 text-xs text-warning-foreground bg-warning/15 border border-warning/30 rounded-lg px-3 py-2">{t(s.noteK)}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
