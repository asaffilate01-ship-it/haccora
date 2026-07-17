import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { FileArchive, FileText, Download, Upload, Search, Folder, ShieldCheck, Truck, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/documents")({
  component: DocumentsPage,
});

type Doc = {
  id: string;
  category: "haccp" | "training" | "supplier" | "cleaning" | "inspection";
  titleDe: string; titleEn: string;
  kind: "PDF" | "DOCX" | "XLSX" | "IMG";
  size: string;
  owner: string;
  updated: string;
  version: string;
};

const DOCS: Doc[] = [
  { id: "d1", category: "haccp",     titleDe: "HACCP-Plan v4.2 (Freigegeben)",           titleEn: "HACCP plan v4.2 (Approved)",             kind: "PDF",  size: "2.4 MB", owner: "Anna Weber",   updated: "14.07.2026", version: "v4.2" },
  { id: "d2", category: "haccp",     titleDe: "Gefahrenanalyse Kühlkette",                titleEn: "Hazard analysis cold chain",              kind: "DOCX", size: "1.1 MB", owner: "Omar El-Sayed",updated: "10.07.2026", version: "v2.0" },
  { id: "d3", category: "training",  titleDe: "IfSG §43 Zertifikat — Aylin Yılmaz",       titleEn: "IfSG §43 certificate — Aylin Yılmaz",     kind: "PDF",  size: "312 KB", owner: "HR",           updated: "02.06.2026", version: "—"    },
  { id: "d4", category: "training",  titleDe: "Allergenschulung 2026 (Anwesenheit)",      titleEn: "Allergen training 2026 (attendance)",     kind: "XLSX", size: "84 KB",  owner: "Marta Kowal",  updated: "28.06.2026", version: "—"    },
  { id: "d5", category: "supplier",  titleDe: "IFS Food V8 — Bio-Metzgerei Weber",        titleEn: "IFS Food V8 — Weber butchery",             kind: "PDF",  size: "1.8 MB", owner: "Einkauf",      updated: "01.07.2026", version: "V8"   },
  { id: "d6", category: "supplier",  titleDe: "Lieferantenerklärung Fischhof Nord",       titleEn: "Supplier declaration Fischhof Nord",       kind: "PDF",  size: "540 KB", owner: "Einkauf",      updated: "22.05.2026", version: "—"    },
  { id: "d7", category: "cleaning",  titleDe: "Sicherheitsdatenblatt Sanixyl Alkalisch",  titleEn: "SDS Sanixyl Alkaline",                     kind: "PDF",  size: "220 KB", owner: "Chemielager",  updated: "11.03.2026", version: "2024" },
  { id: "d8", category: "inspection",titleDe: "Amtsbericht 05/2026 (Berlin FK)",          titleEn: "Inspection report 05/2026 (Berlin FK)",   kind: "PDF",  size: "1.2 MB", owner: "Anna Weber",   updated: "18.05.2026", version: "—"    },
  { id: "d9", category: "inspection",titleDe: "Rückverfolgbarkeits-Testprotokoll",        titleEn: "Traceability drill log",                   kind: "PDF",  size: "420 KB", owner: "Marta Kowal",  updated: "09.07.2026", version: "—"    },
];

const CAT_ICON = {
  haccp: ShieldCheck,
  training: Users,
  supplier: Truck,
  cleaning: Sparkles,
  inspection: FileText,
} as const;

function DocumentsPage() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | Doc["category"]>("all");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return DOCS.filter((d) => {
      if (cat !== "all" && d.category !== cat) return false;
      if (!s) return true;
      const hay = (lang === "de" ? d.titleDe : d.titleEn).toLowerCase() + " " + d.owner.toLowerCase();
      return hay.includes(s);
    });
  }, [q, cat, lang]);

  const categoryCounts = {
    all: DOCS.length,
    haccp: DOCS.filter((d) => d.category === "haccp").length,
    training: DOCS.filter((d) => d.category === "training").length,
    supplier: DOCS.filter((d) => d.category === "supplier").length,
    cleaning: DOCS.filter((d) => d.category === "cleaning").length,
    inspection: DOCS.filter((d) => d.category === "inspection").length,
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div>
          <div className="eyebrow">{t("docs.eyebrow")}</div>
          <h1 className="mt-1 text-3xl md:text-4xl">{t("docs.title")}</h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">{t("docs.sub")}</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition">
          <Upload size={14} /> {t("docs.upload")}
        </button>
      </div>

      <div className="grid md:grid-cols-[16rem_1fr] gap-6">
        <aside className="surface p-3 h-fit">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">{t("docs.categories")}</div>
          {(["all","haccp","training","supplier","cleaning","inspection"] as const).map((k) => (
            <button key={k} onClick={() => setCat(k)}
              className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm mb-0.5 transition ${
                cat === k ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-secondary"
              }`}>
              <span className="flex items-center gap-2"><Folder size={14} /> {t(`docs.cat.${k}`)}</span>
              <span className="text-[11px] opacity-70">{categoryCounts[k]}</span>
            </button>
          ))}
        </aside>

        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <Search size={14} className="text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("docs.searchPh")}
              className="flex-1 bg-transparent outline-none text-sm" />
          </div>

          <div className="surface overflow-hidden">
            <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
              <div className="col-span-5">{t("docs.col.name")}</div>
              <div className="col-span-2">{t("docs.col.owner")}</div>
              <div className="col-span-1">{t("docs.col.version")}</div>
              <div className="col-span-2">{t("docs.col.updated")}</div>
              <div className="col-span-1">{t("docs.col.size")}</div>
              <div className="col-span-1 text-right">·</div>
            </div>
            <div className="divide-y divide-border">
              {filtered.map((d) => {
                const Icon = CAT_ICON[d.category];
                const title = lang === "de" ? d.titleDe : d.titleEn;
                return (
                  <div key={d.id} className="grid grid-cols-1 md:grid-cols-12 px-5 py-4 items-center gap-3">
                    <div className="md:col-span-5 flex items-center gap-3 min-w-0">
                      <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0"><Icon size={16} /></span>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate">{title}</div>
                        <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{d.kind} · {t(`docs.cat.${d.category}`)}</div>
                      </div>
                    </div>
                    <div className="md:col-span-2 text-xs">{d.owner}</div>
                    <div className="md:col-span-1 text-xs font-mono">{d.version}</div>
                    <div className="md:col-span-2 text-xs text-muted-foreground">{d.updated}</div>
                    <div className="md:col-span-1 text-xs text-muted-foreground">{d.size}</div>
                    <div className="md:col-span-1 md:text-right">
                      <button className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                        <Download size={12} /> {t("docs.download")}
                      </button>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                  <FileArchive size={24} className="mx-auto mb-2 opacity-40" />
                  {t("docs.empty")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
