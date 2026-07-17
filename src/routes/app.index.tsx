import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import {
  AlertTriangle, CheckCircle2, Clock, ArrowRight, ShieldCheck, TrendingUp,
  MapPin, DollarSign, Users, ChefHat, Thermometer, Wheat, Gavel, BookOpen,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

interface Task { id: string; tKey: string; catKey: string; time: string; status: "pending" | "overdue" | "done"; who: string }

const initialTasks: Task[] = [
  { id: "1", tKey: "task.cool.t",     catKey: "task.cool.cat",     time: "08:00", status: "overdue", who: "Aylin" },
  { id: "2", tKey: "task.delivery.t", catKey: "task.delivery.cat", time: "11:30", status: "pending", who: "Omar" },
  { id: "3", tKey: "task.clean.t",    catKey: "task.clean.cat",    time: "15:00", status: "pending", who: "Marta" },
  { id: "4", tKey: "task.oil.t",      catKey: "task.oil.cat",      time: "09:00", status: "done",    who: "Omar" },
  { id: "5", tKey: "task.allerg.t",   catKey: "task.allerg.cat",   time: "17:00", status: "pending", who: "Aylin" },
];

const actions = [
  { id: "a1", tKey: "action.cool.t",  severity: "high" as const,   dueKey: "time.todayAt", sourceKey: "action.source.temp" },
  { id: "a2", tKey: "action.ifsg.t",  severity: "medium" as const, due: "20.07.",          sourceKey: "action.source.staff" },
  { id: "a3", tKey: "action.clean.t", severity: "low" as const,    dueKey: "time.today",   sourceKey: "action.source.clean" },
];

function Dashboard() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [tasks, setTasks] = useState(initialTasks);
  const done = (id: string) => setTasks((prev) => prev.map((x) => x.id === id ? { ...x, status: "done" as const } : x));

  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const dateStr = new Date().toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", { weekday: "long", day: "numeric", month: "long" });

  const visibleTasks = user.role === "staff"
    ? tasks.filter((x) => x.who === firstName || x.who === "Aylin")
    : tasks;

  const pending = visibleTasks.filter((x) => x.status === "pending").length;
  const overdue = visibleTasks.filter((x) => x.status === "overdue").length;

  return (
    <div className="p-4 md:p-8 lg:p-10 space-y-6 md:space-y-8">
      <RoleHero role={user.role} firstName={firstName} dateStr={dateStr} location={user.location} />

      {user.role === "owner" && <OwnerView pending={pending} overdue={overdue} tasks={visibleTasks} done={done} />}
      {user.role === "manager" && <ManagerView pending={pending} overdue={overdue} tasks={visibleTasks} done={done} />}
      {user.role === "chef" && <ChefView pending={pending} overdue={overdue} tasks={visibleTasks} done={done} />}
      {user.role === "staff" && <StaffView tasks={visibleTasks} done={done} />}
      {user.role === "inspector" && <InspectorView />}
    </div>
  );
}

/* ---------------- Role hero band ---------------- */
function RoleHero({ role, firstName, dateStr, location }: { role: string; firstName: string; dateStr: string; location: string }) {
  const { t } = useI18n();
  const theme = {
    owner:     { bg: "bg-[#0b0f1a] text-white", accent: "text-[#f4b544]",                       icon: DollarSign,   eye: "dash.owner.hero.eye",   ti: "dash.owner.hero.t",   bo: "dash.owner.hero.b" },
    manager:   { bg: "bg-[color:var(--color-alert-red)] text-white", accent: "text-white",       icon: ClipboardList,eye: "dash.manager.hero.eye", ti: "dash.manager.hero.t", bo: "dash.manager.hero.b" },
    chef:      { bg: "bg-gradient-to-br from-emerald-700 to-emerald-900 text-white", accent: "text-emerald-200", icon: ChefHat, eye: "dash.chef.hero.eye", ti: "dash.chef.hero.t", bo: "dash.chef.hero.b" },
    staff:     { bg: "bg-gradient-to-br from-sky-600 to-indigo-700 text-white", accent: "text-sky-100", icon: BookOpen, eye: "dash.staff.hero.eye", ti: "dash.staff.hero.t", bo: "dash.staff.hero.b" },
    inspector: { bg: "bg-white border border-border text-foreground", accent: "text-[color:var(--color-alert-red)]", icon: Gavel, eye: "inspector.eyebrow", ti: "inspector.title", bo: "inspector.body" },
  }[role as "owner"|"manager"|"chef"|"staff"|"inspector"];
  const Icon = theme.icon;
  return (
    <div className={`rounded-2xl overflow-hidden ${theme.bg} shadow-lg`}>
      <div className="p-5 md:p-8 flex items-start gap-4 md:gap-6">
        <div className="hidden sm:grid h-12 w-12 md:h-14 md:w-14 place-items-center rounded-2xl bg-white/10 backdrop-blur">
          <Icon size={26} />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`text-[10px] md:text-xs font-black uppercase tracking-[0.18em] ${theme.accent}`}>{t(theme.eye)}</div>
          <h1 className="mt-1.5 font-display text-2xl md:text-4xl leading-tight">
            {t("dash.hello.role")}, {firstName}
          </h1>
          <p className="mt-1.5 text-sm md:text-base opacity-85 max-w-2xl">{t(theme.bo)}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] md:text-xs uppercase tracking-wider opacity-70">
            <span>{location}</span><span>·</span><span>{dateStr}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------------- Owner ---------------- */
function OwnerView({ pending, overdue, tasks, done }: { pending: number; overdue: number; tasks: Task[]; done: (id: string) => void }) {
  const { t } = useI18n();
  const locations = [
    { name: "Kreuzberg Kitchen", city: "Berlin",   score: 94, alerts: 1 },
    { name: "Neukölln Bistro",   city: "Berlin",   score: 88, alerts: 3 },
    { name: "Altstadt Grill",    city: "München",  score: 97, alerts: 0 },
  ];

  return (
    <>
      <MetricRow items={[
        { l: t("dash.metric.score"),    v: "93%",  hint: t("time.trend"), icon: ShieldCheck },
        { l: t("owner.locations"),      v: locations.length, icon: MapPin },
        { l: t("dash.metric.actions"),  v: 3,      icon: AlertTriangle },
        { l: t("owner.revenue"),        v: "€184k", hint: t("owner.revenue.hint"), icon: DollarSign },
        { l: t("dash.metric.training"), v: 3,      icon: Users },
      ]} />

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl">{t("owner.byLocation")}</h2>
            <span className="text-xs text-muted-foreground">{t("owner.last30")}</span>
          </div>
          <div className="divide-y divide-border">
            {locations.map((l) => (
              <div key={l.name} className="py-3 flex items-center gap-4">
                <div className="h-9 w-9 rounded-lg bg-secondary grid place-items-center text-primary shrink-0">
                  <MapPin size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{l.name}</div>
                  <div className="text-xs text-muted-foreground">{l.city}</div>
                </div>
                <div className="text-right">
                  <div className={`font-display text-2xl ${l.score >= 95 ? "text-success" : l.score >= 90 ? "text-foreground" : "text-warning-foreground"}`}>{l.score}%</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {l.alerts} {t("owner.alerts")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ReadinessCard />
      </div>

      <TasksAndActions tasks={tasks} done={done} pending={pending} overdue={overdue} />
    </>
  );
}

/* ---------------- Manager ---------------- */
function ManagerView({ pending, overdue, tasks, done }: { pending: number; overdue: number; tasks: Task[]; done: (id: string) => void }) {
  const { t } = useI18n();
  return (
    <>
      <MetricRow items={[
        { l: t("dash.metric.score"),    v: "94%", hint: t("time.trend"), icon: ShieldCheck },
        { l: t("dash.metric.pending"),  v: pending, icon: Clock },
        { l: t("dash.metric.overdue"),  v: overdue, icon: AlertTriangle },
        { l: t("dash.metric.actions"),  v: 3, icon: AlertTriangle },
        { l: t("dash.metric.failed"),   v: 1, icon: Thermometer },
        { l: t("dash.metric.training"), v: 3, icon: Users },
      ]} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TasksCard tasks={tasks} done={done} />
        </div>
        <div className="space-y-6">
          <ReadinessCard />
          <ActionsCard />
        </div>
      </div>
    </>
  );
}

/* ---------------- Chef ---------------- */
function ChefView({ tasks, done }: { pending: number; overdue: number; tasks: Task[]; done: (id: string) => void }) {
  const { t } = useI18n();
  const kitchen = [
    { l: t("chef.temps"),    v: "12/12", to: "/app/temperature", icon: Thermometer },
    { l: t("chef.haccp"),    v: t("chef.approved"), to: "/app/haccp", icon: ShieldCheck },
    { l: t("chef.recipes"),  v: "42", to: "/app/recipes", icon: Wheat },
    { l: t("chef.brigade"),  v: "6", to: "/app/training", icon: ChefHat },
  ];
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kitchen.map((k) => (
          <Link key={k.l} to={k.to as never} className="surface p-4 hover:shadow-md transition group">
            <div className="flex items-center justify-between">
              <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><k.icon size={16} /></span>
              <ArrowRight size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">{k.l}</div>
            <div className="font-display text-2xl">{k.v}</div>
          </Link>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2"><TasksCard tasks={tasks} done={done} /></div>
        <ActionsCard />
      </div>
    </>
  );
}

/* ---------------- Staff (focus view) ---------------- */
function StaffView({ tasks, done }: { tasks: Task[]; done: (id: string) => void }) {
  const { t } = useI18n();
  const pending = tasks.filter((x) => x.status !== "done").length;
  const overdue = tasks.filter((x) => x.status === "overdue").length;
  return (
    <>
      <div className="grid grid-cols-2 gap-3 max-w-md">
        <div className="surface p-4">
          <div className="text-xs text-muted-foreground">{t("dash.metric.pending")}</div>
          <div className="mt-2 font-display text-3xl">{pending}</div>
        </div>
        <div className={`surface p-4 ${overdue > 0 ? "border-destructive/30" : ""}`}>
          <div className="text-xs text-muted-foreground">{t("dash.metric.overdue")}</div>
          <div className={`mt-2 font-display text-3xl ${overdue > 0 ? "text-destructive" : ""}`}>{overdue}</div>
        </div>
      </div>
      <TasksCard tasks={tasks} done={done} big />
      <Link to="/app/training" className="surface p-6 flex items-center gap-4 hover:shadow-md transition">
        <span className="h-11 w-11 rounded-xl bg-primary text-primary-foreground grid place-items-center"><BookOpen size={20} /></span>
        <div className="flex-1">
          <div className="font-display text-lg">{t("staff.training.t")}</div>
          <div className="text-sm text-muted-foreground">{t("staff.training.b")}</div>
        </div>
        <ArrowRight size={18} className="text-muted-foreground" />
      </Link>
    </>
  );
}

/* ---------------- Inspector ---------------- */
function InspectorView() {
  const { t } = useI18n();
  return (
    <div className="surface p-8 md:p-10 max-w-2xl">
      <div className="flex items-start gap-4">
        <span className="h-12 w-12 rounded-xl bg-primary text-primary-foreground grid place-items-center shrink-0"><Gavel size={22} /></span>
        <div>
          <h2 className="font-display text-2xl">{t("inspector.title")}</h2>
          <p className="text-muted-foreground mt-2">{t("inspector.body")}</p>
          <Link to="/app/inspection" className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold hover:brightness-110 transition">
            {t("dash.readiness.cta")} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Shared building blocks ---------------- */

function MetricRow({ items }: { items: Array<{ l: string; v: string | number; hint?: string; icon: typeof ShieldCheck }> }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((m) => (
        <div key={m.l} className="surface p-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">{m.l}</div>
            <m.icon size={14} className="text-muted-foreground/60" />
          </div>
          <div className="mt-2 font-display text-3xl">{m.v}</div>
          {m.hint && <div className="text-[10px] mt-1 text-success flex items-center gap-1"><TrendingUp size={10} /> {m.hint}</div>}
        </div>
      ))}
    </div>
  );
}

function TasksAndActions({ tasks, done, pending, overdue }: { tasks: Task[]; done: (id: string) => void; pending: number; overdue: number }) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2"><TasksCard tasks={tasks} done={done} /></div>
      <ActionsCard />
    </div>
  );
}

function TasksCard({ tasks, done, big }: { tasks: Task[]; done: (id: string) => void; big?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl">{t("dash.today")}</h2>
        <Link to="/app/checks" className="text-xs text-primary hover:underline">{t("dash.allTasks")} →</Link>
      </div>
      <div className="mt-4 divide-y divide-border">
        {tasks.map((task) => (
          <div key={task.id} className={`${big ? "py-4" : "py-3"} flex items-center gap-3`}>
            <StatusPill status={task.status} />
            <div className="flex-1 min-w-0">
              <div className={`${big ? "text-base" : "text-sm"} font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>{t(task.tKey)}</div>
              <div className="text-xs text-muted-foreground">{t(task.catKey)} · {task.who} · {task.time}</div>
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
  );
}

function ActionsCard() {
  const { t } = useI18n();
  return (
    <div className="surface p-6">
      <h2 className="font-display text-xl">{t("dash.actions")}</h2>
      <div className="mt-3 space-y-2">
        {actions.map((a) => (
          <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/60">
            <SeverityBadge sev={a.severity} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{t(a.tKey)}</div>
              <div className="text-xs text-muted-foreground">{t(a.sourceKey)} · {a.dueKey ? t(a.dueKey) : a.due}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReadinessCard() {
  const { t } = useI18n();
  return (
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
  );
}

function StatusPill({ status }: { status: Task["status"] }) {
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
