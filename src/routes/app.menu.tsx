import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { UtensilsCrossed, AlertTriangle, Leaf, Wheat, Fish, Egg, Milk, Nut, Search } from "lucide-react";

export const Route = createFileRoute("/app/menu")({
  component: MenuPage,
});

// EU 1169/2011 – 14 allergens
const ALLERGENS = [
  { code: "gluten",   de: "Gluten",       en: "Gluten",       icon: Wheat },
  { code: "crust",    de: "Krebstiere",   en: "Crustaceans",  icon: Fish },
  { code: "egg",      de: "Ei",           en: "Egg",          icon: Egg },
  { code: "fish",     de: "Fisch",        en: "Fish",         icon: Fish },
  { code: "peanut",   de: "Erdnuss",      en: "Peanut",       icon: Nut },
  { code: "soy",      de: "Soja",         en: "Soy",          icon: Leaf },
  { code: "milk",     de: "Milch",        en: "Milk",         icon: Milk },
  { code: "nut",      de: "Schalenfr.",   en: "Tree nuts",    icon: Nut },
  { code: "celery",   de: "Sellerie",     en: "Celery",       icon: Leaf },
  { code: "mustard",  de: "Senf",         en: "Mustard",      icon: Leaf },
  { code: "sesame",   de: "Sesam",        en: "Sesame",       icon: Leaf },
  { code: "sulph",    de: "Sulfite",      en: "Sulphites",    icon: AlertTriangle },
  { code: "lupin",    de: "Lupine",       en: "Lupin",        icon: Leaf },
  { code: "mollusc",  de: "Weichtiere",   en: "Molluscs",     icon: Fish },
] as const;

type Dish = {
  id: string; de: string; en: string; price: number;
  categoryDe: string; categoryEn: string;
  allergens: string[]; vegan?: boolean; vegetarian?: boolean;
};

const DISHES: Dish[] = [
  { id: "d1", de: "Königsberger Klopse", en: "Königsberg meatballs", price: 16.5, categoryDe: "Hauptgericht", categoryEn: "Mains",  allergens: ["gluten","egg","milk","mustard"] },
  { id: "d2", de: "Rote-Bete-Risotto",   en: "Beetroot risotto",     price: 14.0, categoryDe: "Hauptgericht", categoryEn: "Mains",  allergens: ["milk","celery","sulph"], vegetarian: true },
  { id: "d3", de: "Buddha-Bowl",         en: "Buddha bowl",          price: 12.5, categoryDe: "Hauptgericht", categoryEn: "Mains",  allergens: ["soy","sesame"], vegan: true, vegetarian: true },
  { id: "d4", de: "Kabeljau in Senfsauce",en:"Cod in mustard sauce", price: 19.0, categoryDe: "Hauptgericht", categoryEn: "Mains",  allergens: ["fish","milk","mustard","gluten"] },
  { id: "d5", de: "Käsekuchen",          en: "Cheesecake",           price: 6.5,  categoryDe: "Dessert",      categoryEn: "Dessert",allergens: ["gluten","egg","milk"], vegetarian: true },
  { id: "d6", de: "Bruschetta",          en: "Bruschetta",           price: 8.0,  categoryDe: "Vorspeise",    categoryEn: "Starters",allergens: ["gluten"], vegan: true, vegetarian: true },
];

function MenuPage() {
  const { lang } = useI18n();
  const t = (de: string, en: string) => (lang === "de" ? de : en);
  const [filter, setFilter] = useState<string[]>([]);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => DISHES.filter((d) => {
    const nameHit = (lang === "de" ? d.de : d.en).toLowerCase().includes(q.toLowerCase());
    const allergenHit = filter.length === 0 || !filter.some((f) => d.allergens.includes(f));
    return nameHit && allergenHit;
  }), [q, filter, lang]);

  const toggle = (c: string) => setFilter((f) => f.includes(c) ? f.filter((x) => x !== c) : [...f, c]);

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">LMIV · EU 1169/2011</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("Speisekarte & Allergene", "Menu & allergens")}</h1>
        <p className="text-muted-foreground mt-1">
          {t("14 EU-Allergene, Zusatzstoffe und vegane/vegetarische Kennzeichnung – gastraum-ready.",
             "14 EU allergens, additives and vegan/vegetarian tagging — guest-ready.")}
        </p>
      </div>

      {/* Filters */}
      <div className="surface p-5 space-y-4">
        <div className="flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-2">
          <Search size={14} className="text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={t("Gericht suchen…", "Search dish…")}
            className="bg-transparent outline-none text-sm flex-1"
          />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            {t("Gäste-Filter: ausschließen", "Guest filter: exclude")}
          </div>
          <div className="flex flex-wrap gap-2">
            {ALLERGENS.map((a) => {
              const on = filter.includes(a.code);
              return (
                <button key={a.code} onClick={() => toggle(a.code)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition ${
                    on ? "bg-destructive text-destructive-foreground border-destructive" : "bg-card hover:bg-secondary border-border"
                  }`}>
                  <a.icon size={12} /> {lang === "de" ? a.de : a.en}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dishes */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((d) => (
          <div key={d.id} className="surface p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {lang === "de" ? d.categoryDe : d.categoryEn}
                </div>
                <div className="font-display text-lg leading-tight mt-0.5">{lang === "de" ? d.de : d.en}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-display text-lg">€ {d.price.toFixed(2)}</div>
                <div className="flex gap-1 justify-end mt-1">
                  {d.vegan && <span className="text-[9px] font-bold bg-success/15 text-success px-1.5 py-0.5 rounded">VEGAN</span>}
                  {d.vegetarian && !d.vegan && <span className="text-[9px] font-bold bg-success/15 text-success px-1.5 py-0.5 rounded">VEG</span>}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {d.allergens.map((c) => {
                const a = ALLERGENS.find((x) => x.code === c)!;
                return (
                  <span key={c} className="inline-flex items-center gap-1 rounded-full bg-warning/15 text-warning-foreground px-2 py-0.5 text-[10px] font-semibold">
                    <a.icon size={10} /> {lang === "de" ? a.de : a.en}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full surface p-10 text-center text-sm text-muted-foreground">
            <UtensilsCrossed size={24} className="mx-auto mb-2 opacity-50" />
            {t("Keine Gerichte entsprechen den Filtern.", "No dishes match the current filters.")}
          </div>
        )}
      </div>
    </div>
  );
}
