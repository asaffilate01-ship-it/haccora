import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/checks")({
  component: ChecksPage,
});

interface Row { id: string; title: string; cat: string; time: string; assignee: string; status: "done" | "pending" | "overdue" | "failed" }

const rows: Row[] = [
  { id: "01", title: "Öffnungskontrolle", cat: "Öffnung", time: "07:30", assignee: "Aylin", status: "done" },
  { id: "02", title: "Kühltemperaturen — alle Geräte", cat: "Temperatur", time: "08:00", assignee: "Aylin", status: "failed" },
  { id: "03", title: "Handwaschstationen", cat: "Hygiene", time: "08:30", assignee: "Omar", status: "done" },
  { id: "04", title: "Lieferkontrolle Metro", cat: "Wareneingang", time: "11:30", assignee: "Omar", status: "pending" },
  { id: "05", title: "Kerntemperatur Mittagsservice", cat: "Produktion", time: "12:00", assignee: "Chef", status: "done" },
  { id: "06", title: "Heißhaltung Buffet", cat: "Buffet", time: "13:00", assignee: "Chef", status: "done" },
  { id: "07", title: "Reinigungsplan Küche", cat: "Reinigung", time: "15:00", assignee: "Marta", status: "pending" },
  { id: "08", title: "Frittieröl-Qualität", cat: "Produktion", time: "17:00", assignee: "Omar", status: "pending" },
  { id: "09", title: "Toilettenkontrolle", cat: "Gastbereich", time: "18:00", assignee: "Marta", status: "pending" },
  { id: "10", title: "Schädlingskontrolle Sichtprüfung", cat: "Schädlinge", time: "19:00", assignee: "Manager", status: "pending" },
  { id: "11", title: "Schließkontrolle", cat: "Schließung", time: "23:30", assignee: "Manager", status: "pending" },
];

function ChecksPage() {
  const { t } = useI18n();
  const [items, setItems] = useState(rows);
  const [filter, setFilter] = useState<"all" | "pending" | "failed">("all");

  const done = (id: string) => setItems((prev) => prev.map((x) => x.id === id ? { ...x, status: "done" } : x));
  const filtered = items.filter((r) => filter === "all" || (filter === "pending" ? r.status === "pending" || r.status === "overdue" : r.status === "failed"));

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">Daily Compliance</div>
          <h1 className="mt-1 text-3xl md:text-4xl">Kontrollen · Daily checks</h1>
          <p className="text-muted-foreground mt-1">Alle Öffnungs-, Betriebs- und Schließungskontrollen mit automatischer Eskalation.</p>
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-card p-1">
          {(["all","pending","failed"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1 text-xs rounded-full transition ${filter === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {k === "all" ? "Alle" : k === "pending" ? "Offen" : "Abweichung"}
            </button>
          ))}
        </div>
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
          <div className="col-span-5">Kontrolle</div>
          <div className="col-span-2">Kategorie</div>
          <div className="col-span-2">Zeit</div>
          <div className="col-span-2">Zuständig</div>
          <div className="col-span-1 text-right">Aktion</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((r) => (
            <div key={r.id} className="grid grid-cols-1 md:grid-cols-12 px-5 py-4 items-center gap-3">
              <div className="md:col-span-5 flex items-center gap-3">
                <StatusIcon s={r.status} />
                <div className={`text-sm font-medium ${r.status === "done" ? "line-through text-muted-foreground" : ""}`}>{r.title}</div>
              </div>
              <div className="md:col-span-2 text-xs text-muted-foreground">{r.cat}</div>
              <div className="md:col-span-2 text-xs text-muted-foreground">{r.time}</div>
              <div className="md:col-span-2 text-xs text-muted-foreground">{r.assignee}</div>
              <div className="md:col-span-1 text-right">
                {r.status === "done" ? (
                  <span className="text-xs text-success">✓</span>
                ) : r.status === "failed" ? (
                  <span className="text-xs text-destructive font-semibold">Maßnahme</span>
                ) : (
                  <button
                    onClick={() => done(r.id)}
                    className="text-xs font-semibold rounded-full bg-primary text-primary-foreground px-3 py-1"
                  >
                    Erledigen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusIcon({ s }: { s: Row["status"] }) {
  if (s === "done")    return <span className="h-8 w-8 rounded-lg bg-success/15 text-success grid place-items-center"><CheckCircle2 size={16} /></span>;
  if (s === "failed")  return <span className="h-8 w-8 rounded-lg bg-destructive/15 text-destructive grid place-items-center"><AlertTriangle size={16} /></span>;
  if (s === "overdue") return <span className="h-8 w-8 rounded-lg bg-warning/25 text-warning-foreground grid place-items-center"><Clock size={16} /></span>;
  return <span className="h-8 w-8 rounded-lg bg-secondary text-muted-foreground grid place-items-center"><Clock size={16} /></span>;
}
