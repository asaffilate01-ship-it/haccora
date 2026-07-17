import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/app/training")({
  component: TrainingPage,
});

const staff = [
  { name: "Aylin Yılmaz",    roleK: "training.role.head",       lang: "🇹🇷 TR / DE", ifsg: "01.03.2025", ifsgOK: true,  training: 92, expires: 240 },
  { name: "Omar Haddad",     roleK: "training.role.chef",       lang: "🇸🇾 AR / DE", ifsg: "12.11.2024", ifsgOK: true,  training: 76, expires: 42 },
  { name: "Marta Kowalska",  roleK: "training.role.cleaner",    lang: "🇵🇱 PL / DE", ifsg: "05.02.2026", ifsgOK: true,  training: 88, expires: 320 },
  { name: "Ali Raza",        roleK: "training.role.apprentice", lang: "🇵🇰 UR / EN", ifsg: "—",         ifsgOK: false, training: 34, expires: 0 },
  { name: "Ioana Popescu",   roleK: "training.role.service",    lang: "🇷🇴 RO / DE", ifsg: "18.09.2025", ifsgOK: true,  training: 81, expires: 128 },
  { name: "Jonas Weber",     roleK: "training.role.manager",    lang: "🇩🇪 DE / EN", ifsg: "20.06.2023", ifsgOK: false, training: 95, expires: -12 },
];

function TrainingPage() {
  const { t } = useI18n();
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">IfSG §§42–43 · LMHV</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("training.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("training.sub")}</p>
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
          <div className="col-span-3">{t("training.col.staff")}</div>
          <div className="col-span-2">{t("training.col.role")}</div>
          <div className="col-span-2">{t("training.col.langs")}</div>
          <div className="col-span-2">{t("training.col.ifsg")}</div>
          <div className="col-span-2">{t("training.col.training")}</div>
          <div className="col-span-1">{t("training.col.expires")}</div>
        </div>
        <div className="divide-y divide-border">
          {staff.map((p) => (
            <div key={p.name} className="grid grid-cols-1 md:grid-cols-12 px-5 py-4 items-center gap-3">
              <div className="md:col-span-3 flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-semibold">
                  {p.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                </span>
                <div className="text-sm font-medium">{p.name}</div>
              </div>
              <div className="md:col-span-2 text-xs text-muted-foreground">{t(p.roleK)}</div>
              <div className="md:col-span-2 text-xs">{p.lang}</div>
              <div className="md:col-span-2 text-xs flex items-center gap-1.5">
                {p.ifsgOK ? <CheckCircle2 size={14} className="text-success" /> : <AlertCircle size={14} className="text-destructive" />}
                {p.ifsg}
              </div>
              <div className="md:col-span-2">
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${p.training}%` }} />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{p.training}%</div>
              </div>
              <div className="md:col-span-1 text-xs">
                {p.expires < 0 ? (
                  <span className="text-destructive font-semibold">{t("common.overdue")}</span>
                ) : p.expires === 0 ? (
                  <span className="text-warning-foreground font-semibold">{t("common.missing")}</span>
                ) : (
                  <span className="text-muted-foreground">{p.expires} {t("training.days")}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="surface p-5 flex items-center gap-3">
        <ShieldCheck size={20} className="text-primary" />
        <p className="text-xs text-muted-foreground">{t("training.privacy")}</p>
      </div>
    </div>
  );
}
