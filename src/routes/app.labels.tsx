import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { supabase } from "@/integrations/supabase/client";
import {
  readyLabelRecipe,
  sameLabelRecipe,
  validLabelDates,
  renderLabelDocument,
  type LabelRecipe,
} from "@/lib/label-draft";

export const Route = createFileRoute("/app/labels")({ component: LabelsPage });

function LabelsPage() {
  const { lang } = useI18n();
  const { user } = useAuth();
  const de = lang === "de";
  const t = (en: string, german: string) => (de ? german : en);
  const organizationId = user?.organizationId;
  const identity = `${user?.id ?? ""}:${organizationId ?? ""}`;
  const account = useRef(identity);
  account.current = identity;
  const request = useRef(0);
  const pending = useRef(false);
  const [recipes, setRecipes] = useState<LabelRecipe[]>([]);
  const [page, setPage] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const [prepared, setPrepared] = useState("");
  const [useBy, setUseBy] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<"changed" | "error" | "opened" | null>(null);
  const canPrint = user ? can(user.role, "labels.print") : false;
  const printPermission = useRef(canPrint);
  printPermission.current = canPrint;
  const selected = recipes.find((r) => r.id === selectedId);
  const load = useCallback(async () => {
    const version = ++request.current;
    setLoading(true);
    setFailed(false);
    setRecipes([]);
    setSelectedId("");
    setReviewed(false);
    setMessage(null);
    if (!organizationId) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("id,name,allergens,flagged,updated_at,organization_id")
        .eq("organization_id", organizationId)
        .order("name")
        .range(page * 100, page * 100 + 99);
      if (version !== request.current || account.current !== identity) return;
      if (error || !Array.isArray(data)) throw Error("Recipe lookup failed");
      setRecipes(data as LabelRecipe[]);
    } catch {
      if (version === request.current && account.current === identity) setFailed(true);
    } finally {
      if (version === request.current && account.current === identity) setLoading(false);
    }
  }, [organizationId, identity, page]);
  useEffect(() => {
    setPage(0);
  }, [identity]);
  useEffect(() => {
    setPrepared("");
    setUseBy("");
    request.current += 1;
    void load();
    return () => {
      request.current += 1;
    };
  }, [load]);
  const ready =
    !loading &&
    !failed &&
    !!organizationId &&
    !!selected &&
    readyLabelRecipe(selected, organizationId) &&
    validLabelDates(prepared, useBy) &&
    reviewed &&
    canPrint;

  const printDraft = async () => {
    if (pending.current || !ready || !selected || !organizationId) return;
    pending.current = true;
    setBusy(true);
    setMessage(null);
    const version = request.current;
    // Open synchronously from the click so popup blockers do not reject a later async open.
    const preview = window.open("", "_blank", "width=520,height=650");
    if (!preview) {
      pending.current = false;
      setBusy(false);
      setMessage("error");
      return;
    }
    preview.opener = null;
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("id,name,allergens,flagged,updated_at,organization_id")
        .eq("organization_id", organizationId)
        .eq("id", selected.id)
        .maybeSingle();
      if (version !== request.current || account.current !== identity || !printPermission.current) {
        preview.close();
        return;
      }
      if (error) throw error;
      if (!readyLabelRecipe(data, organizationId) || !sameLabelRecipe(selected, data)) {
        preview.close();
        await load();
        setMessage("changed");
        return;
      }
      renderLabelDocument(preview.document, [
        t("DRAFT — NOT FOR FOOD USE", "ENTWURF — NICHT FÜR LEBENSMITTEL"),
        data.name,
        `${t("Prepared", "Zubereitet")}: ${prepared}`,
        `${t("Proposed use-by", "Vorgeschlagenes Verbrauchsdatum")}: ${useBy}`,
        `${t("Recorded allergens", "Erfasste Allergene")}: ${data.allergens.length ? data.allergens.join(", ") : t("None recorded — this is not an allergen-free claim", "Keine erfasst — keine Aussage über Allergenfreiheit")}`,
        `${t("Recipe reference", "Rezeptreferenz")}: ${data.id}`,
        t(
          "For internal review. No shelf life is calculated. Not a PPDS or retail label.",
          "Zur internen Prüfung. Keine Haltbarkeit berechnet. Kein Verkaufsetikett.",
        ),
      ]);
      preview.focus();
      preview.print();
      setMessage("opened");
    } catch {
      preview.close();
      if (version === request.current && account.current === identity) setMessage("error");
    } finally {
      pending.current = false;
      if (account.current === identity) setBusy(false);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-6 max-w-4xl">
      <h1 className="text-3xl">{t("Recipe label drafts", "Rezeptetiketten vorbereiten")}</h1>
      <p>
        {t(
          "Prepare a draft from your recipe register. Enter dates approved for your process; Haccora does not calculate shelf life. Final approval, printer confirmation and label withdrawal are not yet available.",
          "Entwurf aus Ihrem Rezeptregister erstellen. Für Ihren Prozess freigegebene Daten eingeben; Haccora berechnet keine Haltbarkeit. Endfreigabe, Druckerbestätigung und Etikettenrücknahme sind noch nicht verfügbar.",
        )}
      </p>
      <button onClick={() => void load()} disabled={busy} className="btn-alert-solid">
        {t("Refresh recipes", "Rezepte aktualisieren")}
      </button>
      {loading ? (
        <p role="status">{t("Loading recipes…", "Rezepte werden geladen…")}</p>
      ) : failed ? (
        <p role="alert">
          {t(
            "Recipes could not be loaded. Retry before preparing a label.",
            "Rezepte konnten nicht geladen werden. Bitte erneut versuchen.",
          )}
        </p>
      ) : !organizationId ? (
        <p>
          {t(
            "Select an approved workspace first.",
            "Zuerst einen freigegebenen Arbeitsbereich wählen.",
          )}
        </p>
      ) : recipes.length === 0 ? (
        <p>
          {t(
            "No recipes found. Add and review a recipe in the recipe register first.",
            "Keine Rezepte gefunden. Zuerst ein Rezept im Register anlegen und prüfen.",
          )}
        </p>
      ) : (
        <>
          <label className="block space-y-2">
            <span>{t("Recipe", "Rezept")}</span>
            <select
              className="block w-full border rounded p-3 bg-background"
              value={selectedId}
              disabled={busy}
              onChange={(e) => {
                setSelectedId(e.target.value);
                setReviewed(false);
                setMessage(null);
              }}
            >
              <option value="">{t("Choose a recipe", "Rezept auswählen")}</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                  {r.flagged ? t(" — review required", " — Prüfung erforderlich") : ""}
                </option>
              ))}
            </select>
          </label>
          {selected && (
            <section
              className="surface p-5 space-y-3"
              aria-label={t("Recipe review", "Rezeptprüfung")}
            >
              <h2 className="text-xl">{selected.name}</h2>
              <p>
                {t("Recorded allergens", "Erfasste Allergene")}:{" "}
                {selected.allergens?.length
                  ? selected.allergens.join(", ")
                  : t(
                      "None recorded — verify ingredients and cross-contact",
                      "Keine erfasst — Zutaten und Kreuzkontakt prüfen",
                    )}
              </p>
              {!readyLabelRecipe(selected, organizationId) && (
                <p role="alert">
                  {t(
                    "This recipe needs review before a draft can be printed.",
                    "Dieses Rezept muss vor dem Entwurfsdruck geprüft werden.",
                  )}
                </p>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <label>
                  {t("Prepared date", "Zubereitungsdatum")}
                  <input
                    type="date"
                    value={prepared}
                    disabled={busy}
                    onChange={(e) => {
                      setPrepared(e.target.value);
                      setReviewed(false);
                    }}
                    className="block border rounded p-3 w-full"
                  />
                </label>
                <label>
                  {t("Proposed use-by date", "Vorgeschlagenes Verbrauchsdatum")}
                  <input
                    type="date"
                    min={prepared || undefined}
                    value={useBy}
                    disabled={busy}
                    onChange={(e) => {
                      setUseBy(e.target.value);
                      setReviewed(false);
                    }}
                    className="block border rounded p-3 w-full"
                  />
                </label>
              </div>
              {prepared && useBy && !validLabelDates(prepared, useBy) && (
                <p role="alert">
                  {t(
                    "Use-by must be a valid date on or after preparation.",
                    "Verbrauchsdatum muss gültig sein und am oder nach dem Zubereitungstag liegen.",
                  )}
                </p>
              )}
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={reviewed}
                  disabled={busy}
                  onChange={(e) => setReviewed(e.target.checked)}
                />
                <span>
                  {t(
                    "I have reviewed the recipe, recorded allergens and proposed dates for this draft.",
                    "Ich habe Rezept, erfasste Allergene und vorgeschlagene Daten für diesen Entwurf geprüft.",
                  )}
                </span>
              </label>
            </section>
          )}
          <button
            onClick={() => void printDraft()}
            disabled={!ready || busy}
            className="btn-alert-solid disabled:opacity-40"
          >
            {busy
              ? t("Checking recipe…", "Rezept wird geprüft…")
              : t("Print review draft", "Prüfentwurf drucken")}
          </button>
        </>
      )}
      {organizationId && !loading && !failed && (
        <div className="flex gap-3 items-center">
          <button
            className="border rounded p-3 disabled:opacity-40"
            disabled={busy || page === 0}
            onClick={() => setPage(page - 1)}
          >
            {t("Previous recipes", "Vorherige Rezepte")}
          </button>
          <span>
            {t("Page", "Seite")} {page + 1}
          </span>
          <button
            className="border rounded p-3 disabled:opacity-40"
            disabled={busy || recipes.length < 100}
            onClick={() => setPage(page + 1)}
          >
            {t("Next recipes", "Weitere Rezepte")}
          </button>
        </div>
      )}
      {!canPrint && (
        <p>
          {t(
            "Your role cannot print label drafts.",
            "Ihre Rolle darf keine Etikettenentwürfe drucken.",
          )}
        </p>
      )}
      {message && (
        <p role={message === "opened" ? "status" : "alert"}>
          {message === "changed"
            ? t(
                "The recipe changed or is no longer available. Select it again and repeat the review.",
                "Das Rezept wurde geändert oder ist nicht verfügbar. Erneut auswählen und prüfen.",
              )
            : message === "error"
              ? t(
                  "The draft could not be opened or verified. Allow popups and retry. No print record was created.",
                  "Entwurf konnte nicht geöffnet oder geprüft werden. Popups erlauben und erneut versuchen. Kein Druckdatensatz wurde erstellt.",
                )
              : t(
                  "Draft opened for printing. This does not confirm a physical print; no operational print record was created.",
                  "Entwurf zum Drucken geöffnet. Dies bestätigt keinen physischen Druck; kein betrieblicher Druckdatensatz wurde erstellt.",
                )}
        </p>
      )}
    </div>
  );
}
