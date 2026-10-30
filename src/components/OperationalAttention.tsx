import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { operationalDay } from "@/lib/operational-day";

type ShiftCounts = {
  checksDone: number;
  checksOpen: number;
  checksBacklog: number;
  temperatures: number;
  exceptions: number;
  actionsOpen: number;
  incidentsOpen: number;
};

const emptyCounts: ShiftCounts = {
  checksDone: 0,
  checksOpen: 0,
  checksBacklog: 0,
  temperatures: 0,
  exceptions: 0,
  actionsOpen: 0,
  incidentsOpen: 0,
};

export function OperationalAttention() {
  const { lang } = useI18n();
  const de = lang === "de";
  const [counts, setCounts] = useState(emptyCounts);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { user } = useAuth();
  const organizationId = user?.organizationId;
  const locationId = user?.locationId;
  const identity = `${user?.id ?? ""}:${organizationId ?? ""}:${locationId ?? ""}`;
  const activeIdentity = useRef(identity);
  activeIdentity.current = identity;
  const generation = useRef(0);
  const [loadedIdentity, setLoadedIdentity] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const load = useCallback(async () => {
    const version = ++generation.current;
    setLoading(true);
    setLoadError("");
    setLoadedIdentity("");
    if (!organizationId) {
      setLoadError(
        de
          ? "Bitte zuerst einen freigegebenen Arbeitsbereich auswählen."
          : "Select an approved workspace to load the summary.",
      );
      setLoading(false);
      return;
    }
    try {
      const day = operationalDay(new Date(), "Europe/Berlin");
      const query = (table: "checks" | "temperature_logs" | "corrective_actions" | "incidents") => {
        const q = supabase
          .from(table)
          .select("id", { count: "exact", head: true })
          .eq("organization_id", organizationId);
        return locationId ? q.eq("location_id", locationId) : q;
      };
      const results = await Promise.all([
        query("checks")
          .eq("status", "completed")
          .gte("created_at", day.start)
          .lt("created_at", day.end),
        query("checks")
          .neq("status", "completed")
          .gte("created_at", day.start)
          .lt("created_at", day.end),
        query("temperature_logs").gte("logged_at", day.start).lt("logged_at", day.end),
        query("temperature_logs")
          .in("status", ["out_of_range", "alert"])
          .gte("logged_at", day.start)
          .lt("logged_at", day.end),
        query("corrective_actions").neq("status", "closed"),
        query("incidents").neq("status", "closed"),
        query("checks").neq("status", "completed").lt("created_at", day.start),
      ]);
      if (generation.current !== version || activeIdentity.current !== identity) return;
      if (
        results.some(
          (result) => result.error || !Number.isInteger(result.count) || result.count! < 0,
        )
      )
        throw Error("Unconfirmed summary");
      const [
        checksDone,
        checksOpen,
        temperatures,
        exceptions,
        actionsOpen,
        incidentsOpen,
        checksBacklog,
      ] = results.map((result) => result.count!);
      setCounts({
        checksDone,
        checksOpen,
        temperatures,
        exceptions,
        actionsOpen,
        incidentsOpen,
        checksBacklog,
      });
      setLoadedIdentity(identity);
      setUpdatedAt(
        new Date().toLocaleString(de ? "de-DE" : "en-GB", { timeZone: "Europe/Berlin" }),
      );
    } catch {
      if (generation.current === version && activeIdentity.current === identity)
        setLoadError(
          de
            ? "Einige Nachweise konnten nicht geladen werden. Bitte erneut laden."
            : "Some compliance records could not be loaded. Refresh to retry.",
        );
    } finally {
      if (generation.current === version && activeIdentity.current === identity) setLoading(false);
    }
  }, [identity, organizationId, locationId, de]);

  useEffect(() => {
    void load();
    return () => {
      generation.current += 1;
    };
  }, [load]);

  const ready = !loading && !loadError && loadedIdentity === identity;
  const needsAttention =
    counts.exceptions +
    counts.actionsOpen +
    counts.incidentsOpen +
    counts.checksOpen +
    counts.checksBacklog;
  const totalChecks = counts.checksDone + counts.checksOpen;
  const completion = totalChecks ? Math.round((counts.checksDone / totalChecks) * 100) : 0;
  const attention = [
    {
      label: de ? "Temperaturabweichungen heute" : "Temperature exceptions today",
      count: counts.exceptions,
      to: "/app/temperature",
    },
    {
      label: de ? "Offene Korrekturmaßnahmen" : "Open corrective actions",
      count: counts.actionsOpen,
      to: "/app/control-centre",
    },
    {
      label: de ? "Offene Vorfälle" : "Open incidents",
      count: counts.incidentsOpen,
      to: "/app/incidents",
    },
    {
      label: de ? "Offene Prüfungen von heute" : "Unfinished checks created today",
      count: counts.checksOpen,
      to: "/app/checks",
    },
    {
      label: de ? "Offene Prüfungen früherer Tage" : "Unfinished checks from earlier days",
      count: counts.checksBacklog,
      to: "/app/checks",
    },
  ];
  return (
    <section
      className="surface p-5 space-y-4"
      aria-label={de ? "Handlungsbedarf" : "Needs attention"}
    >
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-xl font-bold">{de ? "Handlungsbedarf" : "Needs attention"}</h2>
        <button
          type="button"
          disabled={loading}
          onClick={() => void load()}
          aria-label={de ? "Übersicht aktualisieren" : "Refresh attention summary"}
          className="min-h-11 border rounded-lg px-4 disabled:opacity-50"
        >
          {de ? "Aktualisieren" : "Refresh"}
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        {locationId
          ? de
            ? "Aktueller Standort"
            : "Current site"
          : de
            ? "Aktuelle Organisation"
            : "Current organisation"}{" "}
        · {de ? "Für Ihr Konto sichtbare Datensätze" : "Records visible to your account"} ·
        Europe/Berlin
      </p>
      {loadError ? (
        <p role="alert">{loadError}</p>
      ) : !ready ? (
        <p role="status">{de ? "Übersicht wird geladen…" : "Loading current workspace summary…"}</p>
      ) : (
        <>
          <p className="font-semibold">
            {de ? `${needsAttention} Hinweise zur Prüfung` : `${needsAttention} attention signals`}
          </p>
          <ul className="divide-y divide-border">
            {attention.map((item) => (
              <li key={item.to + item.label}>
                <Link
                  to={item.to as never}
                  className="flex justify-between items-center gap-3 py-3 min-h-12"
                >
                  <span>{item.label}</span>
                  <span className="font-bold tabular-nums">{item.count}</span>
                </Link>
              </li>
            ))}
          </ul>
          {totalChecks > 0 && (
            <div>
              <p className="text-sm">
                {de
                  ? "Fortschritt der heute erfassten Prüfungen"
                  : "Completion of checks created today"}
                : {completion}%
              </p>
              <progress
                aria-label={de ? "Prüfungsfortschritt" : "Check completion"}
                value={completion}
                max={100}
                className="w-full"
              />
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            {de
              ? `Stand: ${updatedAt} (Berlin). Hinweise können sich auf denselben Vorgang beziehen. Nach Änderungen aktualisieren.`
              : `Updated ${updatedAt} (Berlin). Signals can refer to the same event. Refresh after recording new work.`}
          </p>
        </>
      )}
    </section>
  );
}
