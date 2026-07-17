import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/checks")({
  component: ChecksPage,
});

type Status = "done" | "pending" | "overdue" | "failed";
interface Row { id: string; tKey: string; catKey: string; time: string; assignee: string; status: Status }

const rows: Row[] = [
  { id: "01", tKey: "checks.row.opening",     catKey: "checks.cat.opening",     time: "07:30", assignee: "Aylin",   status: "done" },
  { id: "02", tKey: "checks.row.chill",       catKey: "checks.cat.temperature", time: "08:00", assignee: "Aylin",   status: "failed" },
  { id: "03", tKey: "checks.row.wash",        catKey: "checks.cat.hygiene",     time: "08:30", assignee: "Omar",    status: "done" },
  { id: "04", tKey: "checks.row.delivery",    catKey: "checks.cat.goods",       time: "11:30", assignee: "Omar",    status: "pending" },
  { id: "05", tKey: "checks.row.core",        catKey: "checks.cat.production",  time: "12:00", assignee: "Chef",    status: "done" },
  { id: "06", tKey: "checks.row.hot",         catKey: "checks.cat.buffet",      time: "13:00", assignee: "Chef",    status: "done" },
  { id: "07", tKey: "checks.row.cleanKitchen",catKey: "checks.cat.cleaning",    time: "15:00", assignee: "Marta",   status: "pending" },
  { id: "08", tKey: "checks.row.oil",         catKey: "checks.cat.production",  time: "17:00", assignee: "Omar",    status: "pending" },
  { id: "09", tKey: "checks.row.wc",          catKey: "checks.cat.guests",      time: "18:00", assignee: "Marta",   status: "pending" },
  { id: "10", tKey: "checks.row.pest",        catKey: "checks.cat.pest",        time: "19:00", assignee: "Manager", status: "pending" },
  { id: "11", tKey: "checks.row.closing",     catKey: "checks.cat.closing",     time: "23:30", assignee: "Manager", status: "pending" },
];

function ChecksPage() {
  const { t } = useI18n();
  const [items, setItems] = useState(rows);
  const [filter, setFilter] = useState<"all" | "pending" | "failed">("all");

  const done = (id: string) => setItems((prev) => prev.map((x) => x.id === id ? { ...x, status: "done" as Status } : x));
  const filtered = items.filter((r) => filter === "all" || (filter === "pending" ? r.status === "pending" || r.status === "overdue" : r.status === "failed"));

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">{t("checks.eyebrow")}</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("checks.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("checks.sub")}</p>
        </div>
        <div className="flex gap-1 rounded-full border border-border bg-card p-1">
          {(["all","pending","failed"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`px-3 py-1 text-xs rounded-full transition ${filter === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {k === "all" ? t("common.all") : k === "pending" ? t("checks.filter.pending") : t("checks.filter.failed")}
            </button>
          ))}
        </div>
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
          <div className="col-span-5">{t("checks.col.check")}</div>
          <div className="col-span-2">{t("checks.col.category")}</div>
          <div className="col-span-2">{t("checks.col.time")}</div>
          <div className="col-span-2">{t("checks.col.assignee")}</div>
          <div className="col-span-1 text-right">{t("checks.col.action")}</div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((r) => (
            <div key={r.id} className="grid grid-cols-1 md:grid-cols-12 px-5 py-4 items-center gap-3">
              <div className="md:col-span-5 flex items-center gap-3">
                <StatusIcon s={r.status} />
                <div className={`text-sm font-medium ${r.status === "done" ? "line-through text-muted-foreground" : ""}`}>{t(r.tKey)}</div>
              </div>
              <div className="md:col-span-2 text-xs text-muted-foreground">{t(r.catKey)}</div>
              <div className="md:col-span-2 text-xs text-muted-foreground">{r.time}</div>
              <div className="md:col-span-2 text-xs text-muted-foreground">{r.assignee}</div>
              <div className="md:col-span-1 text-right">
                {r.status === "done" ? (
                  <span className="text-xs text-success">✓</span>
                ) : r.status === "failed" ? (
                  <span className="text-xs text-destructive font-semibold">{t("common.action")}</span>
                ) : (
                  <button
                    onClick={() => done(r.id)}
                    className="text-xs font-semibold rounded-full bg-primary text-primary-foreground px-3 py-1"
                  >
                    {t("common.complete")}
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

function StatusIcon({ s }: { s: Status }) {
  if (s === "done")    return <span className="h-8 w-8 rounded-lg bg-success/15 text-success grid place-items-center"><CheckCircle2 size={16} /></span>;
  if (s === "failed")  return <span className="h-8 w-8 rounded-lg bg-destructive/15 text-destructive grid place-items-center"><AlertTriangle size={16} /></span>;
  if (s === "overdue") return <span className="h-8 w-8 rounded-lg bg-warning/25 text-warning-foreground grid place-items-center"><Clock size={16} /></span>;
  return <span className="h-8 w-8 rounded-lg bg-secondary text-muted-foreground grid place-items-center"><Clock size={16} /></span>;
}
