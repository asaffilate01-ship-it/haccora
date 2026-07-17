import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { AlertTriangle, Wheat } from "lucide-react";

export const Route = createFileRoute("/app/recipes")({
  component: RecipesPage,
});

const ALLERGENS = [
  "gluten","crustacean","egg","fish","peanut","soy","milk","nuts","celery","mustard","sesame","sulphite","lupin","mollusc",
] as const;

const recipes = [
  { nameK: "recipe.currywurst",    allergens: ["gluten","mustard","sulphite"],  cost: 2.10, price: 8.5,  flagged: false },
  { nameK: "recipe.sesameNoodles", allergens: ["gluten","sesame","soy"],         cost: 1.85, price: 9.9,  flagged: true },
  { nameK: "recipe.klopse",        allergens: ["gluten","egg","milk"],           cost: 3.20, price: 12.5, flagged: false },
  { nameK: "recipe.fishSoup",      allergens: ["fish","celery","mollusc"],       cost: 4.10, price: 14.9, flagged: false },
  { nameK: "recipe.kaesespaetzle", allergens: ["gluten","egg","milk"],           cost: 2.40, price: 11.5, flagged: false },
  { nameK: "recipe.falafel",       allergens: ["sesame","mustard"],              cost: 2.60, price: 10.9, flagged: false },
] as const;

function RecipesPage() {
  const { t } = useI18n();
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">EU 1169/2011</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("recipes.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("recipes.sub")}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((r) => {
          const margin = ((r.price - r.cost) / r.price * 100).toFixed(0);
          return (
            <div key={r.nameK} className="surface p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><Wheat size={16} /></div>
                  <h3 className="font-display text-lg leading-tight">{t(r.nameK)}</h3>
                </div>
                {r.flagged && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-warning/20 text-warning-foreground border border-warning/40 px-2 py-0.5 text-[10px] font-semibold uppercase">
                    <AlertTriangle size={10} /> {t("recipes.newIngredient")}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("recipes.allergen")}</div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {ALLERGENS.map((a) => {
                    const active = (r.allergens as readonly string[]).includes(a);
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
                <Cell label={t("recipes.cost")}   value={`€${r.cost.toFixed(2)}`} />
                <Cell label={t("recipes.price")}  value={`€${r.price.toFixed(2)}`} />
                <Cell label={t("recipes.margin")} value={`${margin}%`} accent />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg px-3 py-2 ${accent ? "bg-primary text-primary-foreground" : "bg-secondary/60"}`}>
      <div className={`text-[10px] uppercase tracking-widest ${accent ? "opacity-80" : "text-muted-foreground"}`}>{label}</div>
      <div className="font-display text-base mt-0.5">{value}</div>
    </div>
  );
}
