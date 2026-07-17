import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Sparkles, Camera, Calendar } from "lucide-react";

export const Route = createFileRoute("/app/cleaning")({
  component: CleaningPage,
});

type Sched = { areaK: string; freqK: string; chem: string; colorK: string; staff?: string; staffK?: string; lastK: string; photo: boolean };
const schedule: Sched[] = [
  { areaK: "cleaning.area.floor",    freqK: "cleaning.freq.daily",       chem: "Sanixyl Alkalisch", colorK: "cleaning.color.red",    staff: "Marta", lastK: "cleaning.last.today06", photo: true },
  { areaK: "cleaning.area.surfaces", freqK: "cleaning.freq.thriceDaily", chem: "DesInfekt 70",      colorK: "cleaning.color.blue",   staff: "Chef",  lastK: "cleaning.last.today12", photo: true },
  { areaK: "cleaning.area.fryer",    freqK: "cleaning.freq.weekly",      chem: "OilClean Plus",     colorK: "cleaning.color.yellow", staff: "Omar",  lastK: "cleaning.last.mon18",   photo: true },
  { areaK: "cleaning.area.coldRoom", freqK: "cleaning.freq.weekly",      chem: "FrostClean",        colorK: "cleaning.color.green",  staff: "Aylin", lastK: "cleaning.last.sun22",   photo: true },
  { areaK: "cleaning.area.wc",       freqK: "cleaning.freq.twiceDaily",  chem: "HygieneMax",        colorK: "cleaning.color.white",  staff: "Marta", lastK: "cleaning.last.today14", photo: true },
  { areaK: "cleaning.area.hood",     freqK: "cleaning.freq.monthly",     chem: "—",                 colorK: "cleaning.color.none",   staffK: "cleaning.staff.contractor", lastK: "cleaning.last.jul01", photo: false },
];

function CleaningPage() {
  const { t } = useI18n();
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">{t("cleaning.eyebrow")}</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("cleaning.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("cleaning.sub")}</p>
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
          <div className="col-span-3">{t("cleaning.col.area")}</div>
          <div className="col-span-2">{t("cleaning.col.freq")}</div>
          <div className="col-span-2">{t("cleaning.col.chem")}</div>
          <div className="col-span-1">{t("cleaning.col.color")}</div>
          <div className="col-span-2">{t("cleaning.col.staff")}</div>
          <div className="col-span-2">{t("cleaning.col.last")}</div>
        </div>
        <div className="divide-y divide-border">
          {schedule.map((r) => (
            <div key={r.areaK} className="grid grid-cols-1 md:grid-cols-12 px-5 py-4 items-center gap-3">
              <div className="md:col-span-3 flex items-center gap-3">
                <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><Sparkles size={16} /></span>
                <div className="font-medium text-sm">{t(r.areaK)}</div>
              </div>
              <div className="md:col-span-2 text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12} /> {t(r.freqK)}</div>
              <div className="md:col-span-2 text-xs">{r.chem}</div>
              <div className="md:col-span-1 text-xs">{t(r.colorK)}</div>
              <div className="md:col-span-2 text-xs">{r.staffK ? t(r.staffK) : r.staff}</div>
              <div className="md:col-span-2 text-xs text-muted-foreground flex items-center gap-1.5">
                {r.photo && <Camera size={12} className="text-success" />} {t(r.lastK)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
