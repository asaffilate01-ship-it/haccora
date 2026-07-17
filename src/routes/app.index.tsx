import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import {
  AlertTriangle, CheckCircle2, Clock, ArrowRight, ShieldCheck, TrendingUp,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});


interface Task { id: string; title: string; category: string; time: string; status: "pending" | "overdue" | "done"; who: string }

const initialTasks: Task[] = [
  { id: "1", title: "Kühltemperaturen prüfen", category: "Temperatur",   time: "08:00", status: "overdue", who: "Aylin" },
  { id: "2", title: "Lieferkontrolle Metro",   category: "Wareneingang", time: "11:30", status: "pending", who: "Omar" },
  { id: "3", title: "Reinigungsplan Küche",    category: "Reinigung",    time: "15:00", status: "pending", who: "Marta" },
  { id: "4", title: "Frittieröl-Qualität",     category: "Produktion",   time: "09:00", status: "done",    who: "Omar" },
  { id: "5", title: "Allergenmappe prüfen",    category: "Allergene",    time: "17:00", status: "pending", who: "Aylin" },
];

const actions = [
  { id: "a1", title: "Kühlhaus 2 über 5 °C",         severity: "high" as const,   status: "in_progress", due: "Heute 12:00", source: "Temperatur" },
  { id: "a2", title: "Fehlende IfSG-Unterweisung",   severity: "medium" as const, status: "open",        due: "20.07.",     source: "Personal" },
  { id: "a3", title: "Reinigungsfoto Küchenboden",   severity: "low" as const,    status: "open",        due: "Heute",      source: "Reinigung" },
];

function Dashboard() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [tasks, setTasks] = useState(initialTasks);
  const done = (id: string) => setTasks((prev) => prev.map((x) => x.id === id ? { ...x, status: "done" } : x));

  // For staff, only their own tasks.
  const visibleTasks = user?.role === "staff"
    ? tasks.filter((x) => x.who === user.name.split(" ")[0] || x.who === "Aylin")
    : tasks;

  const pending  = visibleTasks.filter((x) => x.status === "pending").length;
  const overdue  = visibleTasks.filter((x) => x.status === "overdue").length;

  const allMetrics = [
    { l: t("dash.metric.score"),    v: "94%",  hint: "+2 vs. letzte Woche", roles: ["owner","manager","chef","inspector"] },
    { l: t("dash.metric.pending"),  v: pending, roles: ["owner","manager","chef","staff"] },
    { l: t("dash.metric.overdue"),  v: overdue, roles: ["owner","manager","chef","staff"] },
    { l: t("dash.metric.actions"),  v: 3,       roles: ["owner","manager","chef","inspector"] },
    { l: t("dash.metric.failed"),   v: 1,       roles: ["owner","manager","chef","inspector"] },
    { l: t("dash.metric.training"), v: 3,       roles: ["owner","manager","staff"] },
  ];
  const metrics = allMetrics.filter((m) => !user || m.roles.includes(user.role));
  const firstName = user?.name.split(" ")[0] ?? "";
  const roleSub = user ? t(`dash.role.${user.role}`) : t("dash.sub");

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">{user?.location ?? "Kreuzberg Kitchen"} · {new Date().toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("dash.hello.role")}{firstName ? `, ${firstName}` : ""}</h1>
        <p className="text-muted-foreground mt-1">{roleSub}</p>
      </div>


      {/* metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m) => (
          <div key={m.l} className="surface p-4">
            <div className="text-xs text-muted-foreground">{m.l}</div>
            <div className="mt-2 font-display text-3xl">{m.v}</div>
            {m.hint && <div className="text-[10px] mt-1 text-success flex items-center gap-1"><TrendingUp size={10} /> {m.hint}</div>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">{t("dash.today")}</h2>
            <Link to="/app/checks" className="text-xs text-primary hover:underline">Alle · All →</Link>
          </div>
          <div className="mt-4 divide-y divide-border">
            {visibleTasks.map((task) => (
              <div key={task.id} className="py-3 flex items-center gap-3">
                <StatusPill status={task.status} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>{task.title}</div>
                  <div className="text-xs text-muted-foreground">{task.category} · {task.who} · {task.time}</div>
                </div>
                {task.status !== "done" ? (
                  <button
                    onClick={() => done(task.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:brightness-110"
                  >
                    {t("dash.complete")}
                  </button>
                ) : (
                  <span className="text-xs text-success inline-flex items-center gap-1"><CheckCircle2 size={14} /> {t("dash.completed")}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="surface p-6 bg-primary text-primary-foreground border-primary">
            <div className="flex items-start gap-3">
              <ShieldCheck size={20} className="mt-0.5" />
              <div>
                <h3 className="font-display text-lg">{t("dash.readiness")}</h3>
                <p className="text-sm opacity-85 mt-1">{t("dash.readiness.body")}</p>
                <Link to="/app/inspection" className="mt-4 inline-flex items-center gap-1 text-sm font-medium bg-accent text-accent-foreground rounded-full px-3.5 py-1.5">
                  {t("dash.readiness.cta")} <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>

          <div className="surface p-6">
            <h2 className="font-display text-xl">{t("dash.actions")}</h2>
            <div className="mt-3 space-y-2">
              {actions.map((a) => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/60">
                  <SeverityBadge sev={a.severity} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.title}</div>
                    <div className="text-xs text-muted-foreground">{a.source} · {a.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Task["status"] }) {
  const { t } = useI18n();
  if (status === "done")    return <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 size={14} /></span>;
  if (status === "overdue") return <span className="inline-flex items-center gap-1 text-xs text-destructive"><AlertTriangle size={14} /></span>;
  return <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock size={14} /></span>;
}

function SeverityBadge({ sev }: { sev: "high" | "medium" | "low" }) {
  const { t } = useI18n();
  const map = {
    high:   { c: "bg-destructive/10 text-destructive",   l: t("dash.severity.high") },
    medium: { c: "bg-warning/15 text-warning-foreground border border-warning/40", l: t("dash.severity.medium") },
    low:    { c: "bg-secondary text-foreground",         l: t("dash.severity.low") },
  } as const;
  const { c, l } = map[sev];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${c}`}>{l}</span>;
}
