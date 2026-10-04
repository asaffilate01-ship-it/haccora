import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  FileSearch2,
  Loader2,
  Network,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/app/ai-assistant")({
  component: AiEvidenceAssistant,
});

type BridgeStatus = {
  connected: boolean;
  countryCode: string;
  mode?: string;
  generatedAt?: string;
  entitlements: Record<string, { enabled?: boolean; status?: string }>;
};

type RunPayload = {
  run?: { id?: string; status?: string; result?: unknown };
  steps?: Array<{
    step_no: number;
    step_type: string;
    response?: unknown;
    source_refs?: string[];
    status: string;
  }>;
  proposals?: Array<{
    id: string;
    action_key: string;
    rationale: string;
    status: string;
  }>;
  reviewRequired?: boolean;
};

type StartPayload = {
  runId?: unknown;
  status?: unknown;
};

const reviewKinds = [
  ["compliance_question", "Compliance question", "Compliance-Frage"],
  ["inspection_readiness", "Inspection readiness", "Prüfungsvorbereitung"],
  ["allergen_review", "Allergen review", "Allergen-Prüfung"],
  ["corrective_action_review", "Corrective action review", "Korrekturmaßnahmen prüfen"],
  ["haccp_review", "HACCP review", "HACCP prüfen"],
  ["regulatory_question", "Regulatory question", "Regulatorische Frage"],
] as const;

type ReviewKind = (typeof reviewKinds)[number][0];

function answerText(payload: RunPayload | null) {
  const value = payload?.run?.result;
  if (typeof value === "string") return value;

  if (value && typeof value === "object") {
    const result = value as Record<string, unknown>;
    for (const key of ["answer", "summary", "text", "final"]) {
      if (typeof result[key] === "string") return result[key];
    }
    if (Object.keys(result).length) return JSON.stringify(result, null, 2);
  }

  const final = [...(payload?.steps ?? [])]
    .reverse()
    .find((step) => step.step_type === "final");

  if (typeof final?.response === "string") return final.response;
  if (final?.response && typeof final.response === "object") {
    const response = final.response as Record<string, unknown>;
    if (typeof response.text === "string") return response.text;
    if (typeof response.answer === "string") return response.answer;
  }
  return "";
}

function AiEvidenceAssistant() {
  const { lang } = useI18n();
  const de = lang === "de";
  const [bridge, setBridge] = useState<BridgeStatus | null>(null);
  const [kind, setKind] = useState<ReviewKind>("compliance_question");
  const [question, setQuestion] = useState("");
  const [runId, setRunId] = useState("");
  const [run, setRun] = useState<RunPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadStatus = useCallback(async () => {
    setError("");
    const result = await supabase.functions.invoke("omniqora-platform", {
      body: { action: "status" },
    });
    if (result.error) {
      setBridge({ connected: false, countryCode: "DE", entitlements: {} });
      setError(
        de ? "Omniqora-Status ist nicht verfügbar." : "Omniqora status is unavailable.",
      );
      return;
    }
    setBridge(result.data as BridgeStatus);
  }, [de]);

  const readRun = useCallback(
    async (id: string) => {
      if (!id) return;
      const result = await supabase.functions.invoke("omniqora-platform", {
        body: { action: "ai_status", runId: id },
      });
      if (result.error) {
        setError(
          de
            ? "Der AI-Lauf konnte nicht aktualisiert werden."
            : "The AI run could not be refreshed.",
        );
        return;
      }
      setRun(result.data as RunPayload);
    },
    [de],
  );

  async function start() {
    if (question.trim().length < 10 || busy) return;
    setBusy(true);
    setError("");
    setRun(null);

    try {
      const result = await supabase.functions.invoke("omniqora-platform", {
        body: { action: "ai_start", kind, question: question.trim() },
      });
      if (result.error) throw result.error;

      const payload = result.data as StartPayload | null;
      const id = String(payload?.runId ?? "");
      if (!id) throw new Error("No run id");

      const status = String(payload?.status ?? "queued");
      setRunId(id);
      setRun({ run: { id, status }, reviewRequired: true });
    } catch {
      setError(
        de
          ? "Die AI-Anfrage wurde nicht gestartet. Prüfen Sie Berechtigung und Provider-Konfiguration."
          : "The AI request was not started. Check the Haccora AI entitlement and Omniqora provider configuration.",
      );
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const runStatus = run?.run?.status ?? "";
  useEffect(() => {
    if (!runId || !["queued", "running"].includes(runStatus)) return;
    const timer = window.setInterval(() => void readRun(runId), 3500);
    return () => window.clearInterval(timer);
  }, [readRun, runId, runStatus]);

  const enabled = (key: string) => bridge?.entitlements?.[key]?.enabled === true;
  const sources = useMemo(
    () => Array.from(new Set((run?.steps ?? []).flatMap((step) => step.source_refs ?? []))),
    [run],
  );
  const answer = answerText(run);

  return (
    <div className="p-5 md:p-8 max-w-6xl space-y-5">
      <header>
        <div className="eyebrow">HACCORA × OMNIQORA</div>
        <h1 className="mt-1">{de ? "AI-Nachweisassistent" : "AI evidence assistant"}</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          {de
            ? "Nachweisgestützte Unterstützung mit Ihrem Haccora-Betrieb und aktivierten Omniqora-Diensten. Ergebnisse sind Entwürfe zur fachlichen Prüfung und keine Compliance-Zertifizierung."
            : "Evidence-grounded help using your Haccora workspace and enabled Omniqora services. Outputs are drafts for competent human review and do not certify compliance."}
        </p>
      </header>

      <section className="grid gap-3 md:grid-cols-4">
        <StatusCard
          icon={<BrainCircuit size={16} />}
          label="AI Copilot"
          active={enabled("haccora.ai-copilot")}
        />
        <StatusCard icon={<FileSearch2 size={16} />} label="RAG" active={enabled("haccora.rag")} />
        <StatusCard
          icon={<Network size={16} />}
          label="GraphRAG"
          active={enabled("haccora.graphrag")}
        />
        <StatusCard
          icon={<BookOpenCheck size={16} />}
          label={de ? "Regulatorische Intelligenz" : "Regulatory intelligence"}
          active={enabled("haccora.regulatory-intelligence")}
        />
      </section>

      {!bridge?.connected && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm flex gap-2">
          <AlertTriangle size={17} className="shrink-0" />
          {de
            ? "Dieser Betrieb ist derzeit nicht mit Omniqora verbunden. Haccora Core bleibt verfügbar; zentrale AI-Funktionen bleiben gesperrt."
            : "This workspace is not currently connected to Omniqora. Haccora Core remains available, but central AI is fail-closed."}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm">
          {error}
        </div>
      )}

      <section className="surface p-5 space-y-4">
        <div className="flex flex-wrap justify-between gap-3">
          <div>
            <h2 className="text-lg">
              {de ? "Fragen aus Ihren Nachweisen" : "Ask from your evidence"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {de
                ? "Standardmäßig wird nur eine begrenzte Nachweiszusammenfassung übermittelt, keine Rohdatenbanktabellen."
                : "Only a scoped evidence summary is sent by default; raw Haccora tables are not copied into the prompt."}
            </p>
          </div>
          <span className="text-xs rounded-full border border-border px-3 py-1">
            {bridge?.mode === "dishbee-addon" ? "Dishbee add-on" : "Standalone Haccora"} · DE
          </span>
        </div>

        <label className="block text-sm font-semibold">
          {de ? "Prüfart" : "Review type"}
          <select
            className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2"
            value={kind}
            onChange={(event) => setKind(event.target.value as ReviewKind)}
          >
            {reviewKinds.map(([value, enLabel, deLabel]) => (
              <option key={value} value={value}>
                {de ? deLabel : enLabel}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm font-semibold">
          {de ? "Frage" : "Question"}
          <textarea
            className="mt-1 min-h-32 w-full rounded-lg border border-border bg-background p-3 font-normal"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={
              de
                ? "Zum Beispiel: Welche Nachweislücken sollte ich vor einer Kontrolle prüfen?"
                : "For example: What evidence gaps should I review before an inspection?"
            }
          />
        </label>

        <button
          className="btn-primary px-4 py-2 text-sm inline-flex items-center gap-2"
          disabled={
            busy ||
            !bridge?.connected ||
            !enabled("haccora.ai-copilot") ||
            question.trim().length < 10
          }
          onClick={() => void start()}
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {de ? "Governed Review starten" : "Start governed review"}
        </button>
      </section>

      {runId && (
        <section className="surface p-5 space-y-4">
          <div className="flex justify-between gap-3">
            <div>
              <div className="text-xs uppercase text-muted-foreground">Run {runId.slice(0, 8)}</div>
              <h2 className="text-lg">Status: {runStatus || "queued"}</h2>
            </div>
            <button
              className="btn-secondary px-3 py-2 text-sm"
              onClick={() => void readRun(runId)}
            >
              {de ? "Aktualisieren" : "Refresh"}
            </button>
          </div>

          {answer && (
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <h3 className="font-semibold">{de ? "Entwurf" : "Draft response"}</h3>
              <div className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{answer}</div>
            </div>
          )}

          {sources.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold">
                {de ? "Nachweisreferenzen" : "Evidence references"}
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {sources.map((source) => (
                  <span
                    key={source}
                    className="rounded-full border border-border px-2 py-1 text-xs"
                  >
                    {source}
                  </span>
                ))}
              </div>
            </div>
          )}

          {(run?.proposals?.length ?? 0) > 0 && (
            <div>
              <h3 className="text-sm font-semibold">
                {de
                  ? "Vorgeschlagene Maßnahmen — Freigabe erforderlich"
                  : "Proposed actions — approval required"}
              </h3>
              <div className="mt-2 space-y-2">
                {run!.proposals!.map((proposal) => (
                  <div key={proposal.id} className="rounded-lg border border-border p-3 text-sm">
                    <div className="flex justify-between">
                      <strong>{proposal.action_key}</strong>
                      <span className="text-xs uppercase">{proposal.status}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">{proposal.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {runStatus === "completed" && (
            <p className="flex gap-2 text-xs text-muted-foreground">
              <CheckCircle2 size={14} />
              {de
                ? "Vom kontrollierten Omniqora-Runtime abgeschlossen. Vor Änderungen an freigegebenen Kontrollen fachlich prüfen."
                : "Completed by the governed Omniqora runtime. Review before changing approved controls."}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

function StatusCard({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  const { lang } = useI18n();
  const enabled = lang === "de" ? "Aktiv" : "Enabled";
  const disabled = lang === "de" ? "Nicht aktiv" : "Not enabled";

  return (
    <article className="surface p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-2 text-sm font-bold">{active ? enabled : disabled}</div>
    </article>
  );
}
