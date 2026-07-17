import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Truck, CheckCircle2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/app/suppliers")({
  component: SuppliersPage,
});

const suppliers = [
  { name: "Metro Berlin",       cat: "Gastronomie-Vollsortiment", certs: ["IFS", "BIO"], status: "aktiv",  score: 96, note: "" },
  { name: "Havelbauer GmbH",    cat: "Gemüse regional",           certs: ["QS", "BIO"],  status: "aktiv",  score: 92, note: "Preisänderung Karotten +8%" },
  { name: "Ostsee Fisch KG",    cat: "Fisch",                     certs: ["MSC"],        status: "prüfen", score: 78, note: "Zertifikat läuft 30.09. ab" },
  { name: "Bäckerei Kreuzer",   cat: "Backwaren",                 certs: ["QS"],         status: "aktiv",  score: 88, note: "" },
  { name: "Wein Import Süd",    cat: "Getränke",                  certs: ["EU-Bio"],     status: "aktiv",  score: 94, note: "" },
  { name: "CleanChem AG",       cat: "Reinigungschemie",          certs: ["DGUV"],       status: "aktiv",  score: 90, note: "Neues SDB verfügbar" },
];

function SuppliersPage() {
  const { t } = useI18n();
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">Procurement</div>
        <h1 className="mt-1 text-3xl md:text-4xl">Lieferanten · Suppliers</h1>
        <p className="text-muted-foreground mt-1">Approved-Supplier-Liste, Spezifikationen, Zertifikate, Rückrufe.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div key={s.name} className="surface p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><Truck size={16} /></span>
                <div>
                  <h3 className="font-display text-lg leading-tight">{s.name}</h3>
                  <div className="text-xs text-muted-foreground">{s.cat}</div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                s.status === "aktiv" ? "bg-success/15 text-success" : "bg-warning/20 text-warning-foreground border border-warning/40"
              }`}>
                {s.status === "aktiv" ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />} {s.status}
              </span>
            </div>

            <div className="mt-4 flex gap-1.5">
              {s.certs.map((c) => (
                <span key={c} className="text-[10px] font-semibold rounded-full border border-border bg-secondary/60 px-2 py-0.5">{c}</span>
              ))}
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Performance</div>
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

            {s.note && (
              <div className="mt-3 text-xs text-warning-foreground bg-warning/15 border border-warning/30 rounded-lg px-3 py-2">{s.note}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
