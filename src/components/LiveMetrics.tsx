import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { AlertOctagon, Thermometer, Bell, ClipboardCheck, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Counts = {
  incidents: number;
  incidentsHigh: number;
  temp: number;
  tempAlert: number;
  alerts: number;
  checksDone: number;
};

export function LiveMetrics() {
  const { lang } = useI18n();
  const [c, setC] = useState<Counts | null>(null);
  const [error, setError] = useState("");
  const t = (de: string, en: string) => (lang === "de" ? de : en);

  const [refreshKey, setRefreshKey] = useState(0);
  useEffect(() => {
    let mounted = true;
    let version = 0;
    const load = async () => {
      const current = ++version;
      try {
        const [inc, incH, temp, tempA, alerts, checks] = await Promise.all([
          supabase
            .from("incidents")
            .select("id", { count: "exact", head: true })
            .neq("status", "closed"),
          supabase
            .from("incidents")
            .select("id", { count: "exact", head: true })
            .eq("severity", "high")
            .neq("status", "closed"),
          supabase
            .from("temperature_logs")
            .select("id", { count: "exact", head: true })
            .gte("logged_at", new Date(Date.now() - 86400000).toISOString()),
          supabase
            .from("temperature_logs")
            .select("id", { count: "exact", head: true })
            .eq("status", "out_of_range")
            .gte("logged_at", new Date(Date.now() - 7 * 86400000).toISOString()),
          supabase.from("alerts").select("id", { count: "exact", head: true }).is("read_at", null),
          supabase
            .from("checks")
            .select("id", { count: "exact", head: true })
            .eq("status", "completed")
            .gte("completed_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString()),
        ]);
        if (!mounted || current !== version) return;
        if (
          [inc, incH, temp, tempA, alerts, checks].some(
            (result) => result.error || result.count === null,
          )
        )
          throw new Error("Metrics unavailable");
        setError("");
        setC({
          incidents: inc.count ?? 0,
          incidentsHigh: incH.count ?? 0,
          temp: temp.count ?? 0,
          tempAlert: tempA.count ?? 0,
          alerts: alerts.count ?? 0,
          checksDone: checks.count ?? 0,
        });
      } catch {
        if (mounted && current === version)
          setError(
            lang === "de"
              ? "Kennzahlen sind nicht verfügbar. Fehlende Daten bedeuten keine Entwarnung."
              : "Live metrics are unavailable. Missing data does not mean everything is clear.",
          );
      }
    };
    load();
    const iv = setInterval(load, 30000);
    const ch = supabase
      .channel("live-metrics")
      .on("postgres_changes", { event: "*", schema: "public", table: "incidents" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "temperature_logs" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "checks" }, load)
      .subscribe();
    return () => {
      mounted = false;
      clearInterval(iv);
      supabase.removeChannel(ch);
    };
  }, [refreshKey, lang]);

  if (error)
    return (
      <div role="alert" className="surface p-5 text-sm text-destructive">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => {
            setError("");
            setC(null);
            setRefreshKey((key) => key + 1);
          }}
          className="mt-3 min-h-11 rounded-lg border px-4 font-semibold"
        >
          {t("Erneut versuchen", "Try again")}
        </button>
      </div>
    );

  if (!c)
    return (
      <div
        role="status"
        className="surface p-5 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Loader2 size={14} className="animate-spin" /> {t("Lade Live-Daten…", "Loading live data…")}
      </div>
    );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Tile
        to="/app/incidents"
        icon={<AlertOctagon size={16} />}
        label={t("Offene Vorfälle", "Open incidents")}
        value={c.incidents}
        accent={c.incidentsHigh > 0 ? "danger" : "neutral"}
        hint={
          c.incidentsHigh > 0 ? t(`${c.incidentsHigh} hoch`, `${c.incidentsHigh} high`) : undefined
        }
      />
      <Tile
        to="/app/temperature"
        icon={<Thermometer size={16} />}
        label={t("Temp-Messungen 24h", "Temp readings 24h")}
        value={c.temp}
        accent={c.tempAlert > 0 ? "warn" : "neutral"}
        hint={
          c.tempAlert > 0
            ? t(`${c.tempAlert} außer Toleranz · 7 Tage`, `${c.tempAlert} out of range · 7 days`)
            : undefined
        }
      />
      <Tile
        to="/app/alerts"
        icon={<Bell size={16} />}
        label={t("Ungelesene Alerts", "Unread alerts")}
        value={c.alerts}
        accent={c.alerts > 0 ? "warn" : "neutral"}
      />
      <Tile
        to="/app/checks"
        icon={<ClipboardCheck size={16} />}
        label={t("Checks heute", "Checks today")}
        value={c.checksDone}
        accent="ok"
      />
    </div>
  );
}

function Tile({
  to,
  icon,
  label,
  value,
  accent,
  hint,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: "danger" | "warn" | "ok" | "neutral";
  hint?: string;
}) {
  const color =
    accent === "danger"
      ? "text-[color:var(--color-alert-red)]"
      : accent === "warn"
        ? "text-amber-600"
        : accent === "ok"
          ? "text-success"
          : "text-foreground";
  return (
    <Link to={to} className="surface p-4 hover:shadow-lg transition group">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 min-w-0">
          {icon}
          {label}
        </span>
      </div>
      <div className={`font-display text-3xl mt-1 ${color}`}>{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
    </Link>
  );
}
