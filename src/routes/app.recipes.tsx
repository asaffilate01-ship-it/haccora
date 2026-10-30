import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { recipeMoney, matchesRecipeSubmission } from "@/lib/recipe-input";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Wheat, Loader2, Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/app/recipes")({ component: RecipesPage });

const ALLERGENS = [
  "gluten",
  "crustacean",
  "egg",
  "fish",
  "peanut",
  "soy",
  "milk",
  "nuts",
  "celery",
  "mustard",
  "sesame",
  "sulphite",
  "lupin",
  "mollusc",
] as const;
type AllergenKey = (typeof ALLERGENS)[number];

interface Row {
  id: string;
  name: string;
  category: string | null;
  allergens: string[];
  cost_eur: number;
  price_eur: number;
  flagged: boolean;
}

function RecipesPage() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const role = user?.role ?? "staff";
  const canCost = can(role, "recipes.cost");
  const canEdit = can(role, "menu.editAllergens");

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const generation = useRef(0);
  const removing = useRef<string | null>(null);
  const identity = `${user?.id ?? ""}:${user?.organizationId ?? ""}`;
  const currentIdentity = useRef(identity);
  currentIdentity.current = identity;
  const [loadedIdentity, setLoadedIdentity] = useState("");
  const organizationId = user?.organizationId;

  const load = useCallback(async () => {
    const version = ++generation.current;
    setLoading(true);
    setLoadError(false);
    setRows([]);
    if (!organizationId) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false })
        .order("id")
        .range(page * 100, page * 100 + 99);
      if (version !== generation.current || currentIdentity.current !== identity) return;
      if (error || !Array.isArray(data)) throw Error("Recipe lookup failed");
      setRows(data as Row[]);
      setLoadedIdentity(identity);
    } catch {
      if (version === generation.current && currentIdentity.current === identity)
        setLoadError(true);
    } finally {
      if (version === generation.current && currentIdentity.current === identity) setLoading(false);
    }
  }, [identity, organizationId, page]);
  useEffect(() => {
    setPage(0);
    setShowForm(false);
    setSaving(false);
    setDeleteError(false);
    setDeleting(null);
  }, [identity]);
  useEffect(() => {
    generation.current += 1;
    void load();
    return () => {
      generation.current += 1;
    };
  }, [load]);

  const remove = async (id: string) => {
    if (
      !canEdit ||
      !organizationId ||
      removing.current === identity ||
      currentIdentity.current !== identity
    )
      return;
    if (!confirm(lang === "de" ? "Rezept löschen?" : "Delete recipe?")) return;
    removing.current = identity;
    setDeleting(id);
    setDeleteError(false);
    try {
      const { data, error } = await supabase
        .from("recipes")
        .delete()
        .eq("id", id)
        .eq("organization_id", organizationId)
        .select("id");
      if (currentIdentity.current !== identity) return;
      if (error || !data?.some((row) => row.id === id)) throw Error("Delete not confirmed");
      await load();
    } catch {
      if (currentIdentity.current === identity) setDeleteError(true);
    } finally {
      if (removing.current === identity) removing.current = null;
      if (currentIdentity.current === identity) setDeleting(null);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="eyebrow">EU 1169/2011</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("recipes.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("recipes.sub")}</p>
        </div>
        {canEdit && (
          <button onClick={() => setShowForm(true)} className="btn-alert-solid text-sm">
            <Plus size={16} className="inline mr-1.5" />
            {lang === "de" ? "Rezept hinzufügen" : "Add recipe"}
          </button>
        )}
      </div>

      {deleteError && (
        <p role="alert">
          {lang === "de"
            ? "Löschung konnte nicht bestätigt werden. Rezept bleibt sichtbar; zum Prüfen aktualisieren."
            : "Deletion could not be confirmed. The recipe has been kept visible; refresh to check its current state."}
        </p>
      )}
      <div className="flex gap-3 items-center">
        <button
          className="border rounded p-3"
          disabled={loading || !!deleting}
          onClick={() => void load()}
        >
          {lang === "de" ? "Rezepte aktualisieren" : "Refresh recipes"}
        </button>
        <button
          className="border rounded p-3"
          disabled={loading || !!deleting || page === 0}
          onClick={() => setPage(page - 1)}
        >
          {lang === "de" ? "Zurück" : "Previous"}
        </button>
        <span>{page + 1}</span>
        <button
          className="border rounded p-3"
          disabled={loading || !!deleting || loadError || rows.length < 100}
          onClick={() => setPage(page + 1)}
        >
          {lang === "de" ? "Weiter" : "Next"}
        </button>
      </div>
      {loadError ? (
        <p role="alert">
          {lang === "de"
            ? "Rezepte konnten nicht geladen werden. Bitte erneut versuchen."
            : "Recipes could not be loaded. Refresh to retry."}
        </p>
      ) : !organizationId ? (
        <p>
          {lang === "de"
            ? "Zuerst einen freigegebenen Arbeitsbereich wählen."
            : "Select an approved workspace first."}
        </p>
      ) : loading || loadedIdentity !== identity ? (
        <div className="surface p-10 text-center text-sm text-muted-foreground">
          <Loader2 size={16} className="inline animate-spin mr-2" />…
        </div>
      ) : rows.length === 0 ? (
        <div className="surface p-10 text-center text-sm text-muted-foreground">
          <Wheat size={20} className="inline opacity-40 mr-2" />
          {lang === "de" ? "Noch keine Rezepte." : "No recipes yet."}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((r) => {
            const margin =
              r.price_eur > 0 ? (((r.price_eur - r.cost_eur) / r.price_eur) * 100).toFixed(0) : "—";
            return (
              <div key={r.id} className="surface p-5 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center">
                      <Wheat size={16} />
                    </div>
                    <h3 className="font-display text-lg leading-tight">{r.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.flagged && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-warning/20 text-warning-foreground border border-warning/40 px-2 py-0.5 text-[10px] font-semibold uppercase">
                        <AlertTriangle size={10} /> {t("recipes.newIngredient")}
                      </span>
                    )}
                    {canEdit && (
                      <button
                        onClick={() => void remove(r.id)}
                        disabled={!!deleting}
                        aria-label={lang === "de" ? "Rezept löschen" : "Delete recipe"}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t("recipes.allergen")}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {ALLERGENS.map((a) => {
                      const active = Array.isArray(r.allergens) && r.allergens.includes(a);
                      return (
                        <span
                          key={a}
                          className={`text-[10px] font-medium rounded-full px-2 py-0.5 border ${
                            active
                              ? "bg-accent/25 border-accent text-foreground"
                              : "border-border text-muted-foreground/60"
                          }`}
                        >
                          {t(`allergen.${a}`)}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
                  <Cell
                    label={t("recipes.cost")}
                    value={canCost ? `€${Number(r.cost_eur).toFixed(2)}` : "—"}
                  />
                  <Cell label={t("recipes.price")} value={`€${Number(r.price_eur).toFixed(2)}`} />
                  <Cell label={t("recipes.margin")} value={canCost ? `${margin}%` : "—"} accent />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && canEdit && (
        <RecipeForm
          key={identity}
          onClose={() => setShowForm(false)}
          saving={saving}
          setSaving={setSaving}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
          lang={lang}
        />
      )}
    </div>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-lg px-3 py-2 ${accent ? "bg-primary text-primary-foreground" : "bg-secondary/60"}`}
    >
      <div
        className={`text-[10px] uppercase tracking-widest ${accent ? "opacity-80" : "text-muted-foreground"}`}
      >
        {label}
      </div>
      <div className="font-display text-base mt-0.5">{value}</div>
    </div>
  );
}

function RecipeForm({
  onClose,
  saving,
  setSaving,
  onSaved,
  lang,
}: {
  onClose: () => void;
  saving: boolean;
  setSaving: (b: boolean) => void;
  onSaved: () => void;
  lang: "de" | "en";
}) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [allergens, setAllergens] = useState<AllergenKey[]>([]);
  const { user: workspaceUser } = useAuth();
  const formIdentity = `${workspaceUser?.id ?? ""}:${workspaceUser?.organizationId ?? ""}`;
  const activeIdentity = useRef(formIdentity);
  activeIdentity.current = formIdentity;
  const pending = useRef(false);
  const submissionId = useRef<string | null>(null);
  const [failure, setFailure] = useState<"values" | "save" | null>(null);
  const allowed = workspaceUser ? can(workspaceUser.role, "menu.editAllergens") : false;
  const permitted = useRef(allowed);
  permitted.current = allowed;
  useEffect(
    () => () => {
      activeIdentity.current = "";
    },
    [],
  );

  const toggle = (a: AllergenKey) =>
    setAllergens((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pending.current || !allowed || !workspaceUser?.organizationId) return;
    const parsedCost = recipeMoney(cost),
      parsedPrice = recipeMoney(price);
    if (!name.trim() || parsedCost === null || parsedPrice === null) {
      setFailure("values");
      return;
    }
    pending.current = true;
    setSaving(true);
    setFailure(null);
    try {
      const { data: auth, error: authError } = await supabase.auth.getUser();
      if (activeIdentity.current !== formIdentity || !permitted.current) return;
      if (authError || auth.user?.id !== workspaceUser.id) throw Error("Account changed");
      submissionId.current ??= crypto.randomUUID();
      const payload = {
        name: name.trim(),
        cost_eur: parsedCost,
        price_eur: parsedPrice,
        allergens,
        created_by: workspaceUser.id,
        organization_id: workspaceUser.organizationId,
        location_id: workspaceUser.locationId,
        idempotency_key: submissionId.current,
      };
      const result = await supabase.from("recipes").insert(payload).select("*").single();
      if (activeIdentity.current !== formIdentity || !permitted.current) return;
      let saved = result.data;
      if (result.error?.code === "23505") {
        const existing = await supabase
          .from("recipes")
          .select("*")
          .eq("idempotency_key", submissionId.current)
          .eq("organization_id", workspaceUser.organizationId)
          .eq("created_by", workspaceUser.id)
          .maybeSingle();
        if (existing.error) throw existing.error;
        saved = existing.data;
      } else if (result.error) throw result.error;
      if (activeIdentity.current !== formIdentity || !permitted.current) return;
      if (!matchesRecipeSubmission(saved, payload)) throw Error("Save not confirmed");
      onSaved();
    } catch {
      if (activeIdentity.current === formIdentity) setFailure("save");
    } finally {
      pending.current = false;
      if (activeIdentity.current === formIdentity) setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 backdrop-blur-sm p-4">
      <form onSubmit={save} className="surface w-full max-w-lg p-6 space-y-4">
        {failure && (
          <p role="alert">
            {failure === "values"
              ? lang === "de"
                ? "Name sowie nichtnegative Kosten und Preis mit höchstens zwei Dezimalstellen eingeben."
                : "Enter a name and non-negative cost and price with at most two decimal places."
              : lang === "de"
                ? "Speicherung nicht bestätigt. Eingaben bleiben erhalten. Unverändert erneut versuchen oder vor einem neuen Rezept das Register prüfen."
                : "Save could not be confirmed. Your entries are kept. Retry unchanged or refresh the register to check before starting another recipe."}
          </p>
        )}
        <fieldset disabled={saving} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">
              {lang === "de" ? "Neues Rezept" : "New recipe"}
            </h2>
            <button type="button" onClick={onClose} className="text-muted-foreground">
              <X size={18} />
            </button>
          </div>
          <div>
            <label
              htmlFor="recipe-name"
              className="text-[10px] uppercase tracking-widest text-muted-foreground"
            >
              {lang === "de" ? "Name" : "Name"}
            </label>
            <input
              id="recipe-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="recipe-cost"
                className="text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                {lang === "de" ? "Kosten €" : "Cost €"}
              </label>
              <input
                type="number"
                step="0.01"
                id="recipe-cost"
                min="0"
                required
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="recipe-price"
                className="text-[10px] uppercase tracking-widest text-muted-foreground"
              >
                {lang === "de" ? "Preis €" : "Price €"}
              </label>
              <input
                type="number"
                step="0.01"
                id="recipe-price"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {lang === "de" ? "Allergene" : "Allergens"}
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ALLERGENS.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggle(a)}
                  className={`text-[10px] font-medium rounded-full px-2 py-1 border ${allergens.includes(a) ? "bg-accent/25 border-accent" : "border-border text-muted-foreground"}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-sm px-4 py-2 rounded-full border border-border"
            >
              {lang === "de" ? "Abbrechen" : "Cancel"}
            </button>
            <button type="submit" disabled={saving} className="btn-alert-solid text-sm">
              {saving ? <Loader2 size={14} className="inline animate-spin mr-1" /> : null}
              {lang === "de" ? "Speichern" : "Save"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
