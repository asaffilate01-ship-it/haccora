import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Loader2,
  Thermometer,
  Sparkles,
  ShieldCheck,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/app/alerts")({ component: AlertsPage });

interface Row {
  id: string;
  kind: string;
  severity: string;
  title: string;
  message: string | null;
  read_at: string | null;
  created_at: string;
  user_id: string;
}

const ICON: Record<string, typeof Bell> = {
  temperature: Thermometer,
  cleaning: Sparkles,
  haccp: ShieldCheck,
  training: Users,
};

function AlertsPage() {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);

  const [rows, setRows] = useState<Row[]>([]);
  const [readState, setReadState] = useState<"loading" | "ready" | "unavailable">("loading");
  const [writeError, setWriteError] = useState("");
  const requestVersion = useRef(0);
  const [filter, setFilter] = useState<"all" | "unread" | "critical">("all");

  const load = useCallback(async () => {
    const version = ++requestVersion.current;
    setReadState("loading");
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      if (version !== requestVersion.current) return;
      if (error || !Array.isArray(data)) throw new Error("Alert evidence unavailable");
      setRows(data as Row[]);
      setReadState("ready");
    } catch {
      if (version === requestVersion.current) {
        setRows([]);
        setReadState("unavailable");
      }
    }
  }, []);

  useEffect(() => {
    void load();
    return () => {
      requestVersion.current += 1;
    };
  }, [load]);

  const markRead = async (id: string) => {
    setWriteError("");
    try {
      const { data, error } = await supabase
        .from("alerts")
        .update({ read_at: new Date().toISOString() })
        .eq("id", id)
        .select("id")
        .maybeSingle();
      if (error || !data?.id) throw new Error("Unconfirmed read");
      void load();
    } catch {
      setWriteError(
        t(
          "Lesestatus nicht bestätigt. Bitte erneut versuchen.",
          "Read status not confirmed. Retry.",
        ),
      );
    }
  };
  const markAllRead = async () => {
    setWriteError("");
    try {
      const { error } = await supabase
        .from("alerts")
        .update({ read_at: new Date().toISOString() })
        .is("read_at", null);
      if (error) throw error;
      void load();
    } catch {
      setWriteError(
        t(
          "Lesestatus nicht bestätigt. Bitte aktualisieren.",
          "Read status not confirmed. Refresh to verify.",
        ),
      );
    }
  };

  const filtered = rows.filter((r) =>
    filter === "all" ? true : filter === "unread" ? !r.read_at : r.severity === "critical",
  );
  const unread = rows.filter((r) => !r.read_at).length;

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">{t("Benachrichtigungen", "Notifications")}</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("Alerts", "Alerts")}</h1>
          <p className="text-muted-foreground mt-1">
            {t(
              readState === "ready"
                ? `${unread} ungelesen · letzte 100 Einträge.`
                : readState === "loading"
                  ? "Einträge werden geprüft…"
                  : "Benachrichtigungen nicht verfügbar.",
              readState === "ready"
                ? `${unread} unread · latest 100 records.`
                : readState === "loading"
                  ? "Checking alert records…"
                  : "Alert records unavailable.",
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "unread", "critical"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${filter === f ? "bg-foreground text-background border-foreground" : "border-border hover:bg-secondary"}`}
            >
              {f === "all"
                ? t("Alle", "All")
                : f === "unread"
                  ? t("Ungelesen", "Unread")
                  : t("Kritisch", "Critical")}
            </button>
          ))}
          {readState === "ready" && unread > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-success text-success-foreground"
            >
              {t("Alle gelesen", "Mark all read")}
            </button>
          )}
        </div>
      </div>

      {writeError && (
        <div role="alert" className="surface p-4 text-sm text-destructive">
          {writeError}
        </div>
      )}

      <div className="surface overflow-hidden">
        {readState === "loading" ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            <Loader2 size={16} className="inline animate-spin mr-2" />
            {t("Lade…", "Loading…")}
          </div>
        ) : readState === "unavailable" ? (
          <div role="alert" className="p-10 space-y-3 text-sm">
            <p>
              {t(
                "Benachrichtigungen konnten nicht geladen werden. Keine Entwarnung möglich.",
                "Alert records are unavailable. No safety clearance can be inferred.",
              )}
            </p>
            <button
              type="button"
              onClick={() => void load()}
              className="rounded-lg border border-border px-4 py-3 font-semibold"
            >
              {t("Erneut laden", "Retry alerts")}
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            <Bell size={20} className="inline mr-2 opacity-40" />
            {t(
              "Keine Benachrichtigungen in dieser Ansicht erfasst. Keine Sicherheitsfreigabe.",
              "No alerts recorded in this view. This is not safety clearance.",
            )}
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((a) => {
              const Icon = ICON[a.kind] ?? AlertTriangle;
              const sevCls =
                a.severity === "critical"
                  ? "bg-[color:var(--color-alert-red)]/15 text-[color:var(--color-alert-red)]"
                  : a.severity === "warning"
                    ? "bg-amber-500/15 text-amber-700"
                    : "bg-secondary text-muted-foreground";
              return (
                <li
                  key={a.id}
                  className={`p-4 flex items-start gap-4 ${a.read_at ? "opacity-70" : ""}`}
                >
                  <span
                    className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${sevCls}`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                        {a.severity}
                      </span>
                      {!a.read_at && (
                        <span className="text-[9px] font-bold text-success">● NEU</span>
                      )}
                    </div>
                    <div className="font-display text-lg mt-0.5">{a.title}</div>
                    {a.message && (
                      <div className="text-sm text-muted-foreground mt-1">{a.message}</div>
                    )}
                    <div className="mt-1 text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleString(lang === "de" ? "de-DE" : "en-GB")}
                    </div>
                  </div>
                  {!a.read_at && (
                    <button
                      onClick={() => markRead(a.id)}
                      className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/70"
                    >
                      <CheckCircle2 size={12} className="inline mr-1" />
                      {t("Gelesen", "Read")}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
