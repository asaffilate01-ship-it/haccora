import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ShieldCheck, AlertCircle, CheckCircle2, GraduationCap, BookOpen, Award, PlayCircle } from "lucide-react";

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

const COURSES = [
  { id:"c1", deT:"IfSG §43 Erstbelehrung",  enT:"IfSG §43 Initial briefing", mins:35, modules:5, enrolled:12, done:8,  reqDe:"Pflicht", reqEn:"Required" },
  { id:"c2", deT:"HACCP-Grundlagen",         enT:"HACCP fundamentals",         mins:60, modules:8, enrolled:14, done:11, reqDe:"Pflicht", reqEn:"Required" },
  { id:"c3", deT:"Allergene (LMIV)",         enT:"Allergens (EU 1169/2011)",   mins:25, modules:4, enrolled:14, done:9,  reqDe:"Pflicht", reqEn:"Required" },
  { id:"c4", deT:"Küchenhygiene & Reinigung",enT:"Kitchen hygiene & cleaning",  mins:40, modules:6, enrolled:10, done:6,  reqDe:"Empfohlen", reqEn:"Recommended" },
  { id:"c5", deT:"Arbeitssicherheit",        enT:"Workplace safety",            mins:30, modules:5, enrolled:14, done:12, reqDe:"Pflicht", reqEn:"Required" },
];

const CERTS = [
  { name:"Aylin Yılmaz",   deC:"HACCP Grundlagen", enC:"HACCP fundamentals",  issued:"03.06.2025", valid:"03.06.2027" },
  { name:"Aylin Yılmaz",   deC:"IfSG §43",         enC:"IfSG §43",             issued:"01.03.2025", valid:"01.03.2027" },
  { name:"Marta Kowalska", deC:"HACCP Grundlagen", enC:"HACCP fundamentals",  issued:"18.01.2025", valid:"18.01.2027" },
  { name:"Ioana Popescu",  deC:"Allergene",         enC:"Allergens",           issued:"12.04.2025", valid:"12.04.2027" },
];

const QUIZ = [
  {
    deQ:"Bei welcher Kerntemperatur ist Geflügel sicher gegart?",
    enQ:"At which core temperature is poultry safely cooked?",
    deA:["63 °C","70 °C","74 °C","82 °C"], enA:["63 °C","70 °C","74 °C","82 °C"], correct:2,
  },
  {
    deQ:"Wie viele EU-Hauptallergene müssen deklariert werden?",
    enQ:"How many EU main allergens must be declared?",
    deA:["8","10","12","14"], enA:["8","10","12","14"], correct:3,
  },
  {
    deQ:"Kaltbuffet – welche maximale Temperatur ist erlaubt?",
    enQ:"Cold buffet — what maximum temperature is allowed?",
    deA:["4 °C","7 °C","10 °C","12 °C"], enA:["4 °C","7 °C","10 °C","12 °C"], correct:1,
  },
];

function TrainingPage() {
  const { t, lang } = useI18n();
  const tt = (de: string, en: string) => (lang === "de" ? de : en);
  const [tab, setTab] = useState<"team" | "courses" | "quiz" | "certs">("team");

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">IfSG §§42–43 · LMHV · LMS</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("training.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("training.sub")}</p>
      </div>

      <div className="inline-flex flex-wrap rounded-full border border-border bg-card p-1 text-sm">
        <TabBtn on={tab==="team"}    onClick={() => setTab("team")}    icon={ShieldCheck}   label={tt("Team","Team")} />
        <TabBtn on={tab==="courses"} onClick={() => setTab("courses")} icon={BookOpen}      label={tt("Kurse","Courses")} />
        <TabBtn on={tab==="quiz"}    onClick={() => setTab("quiz")}    icon={GraduationCap} label={tt("Wissenstest","Knowledge test")} />
        <TabBtn on={tab==="certs"}   onClick={() => setTab("certs")}   icon={Award}         label={tt("Zertifikate","Certificates")} />
      </div>

      {tab === "team" && (
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
      )}

      {tab === "courses" && (
        <div className="grid md:grid-cols-2 gap-4">
          {COURSES.map((c) => {
            const pct = Math.round((c.done / c.enrolled) * 100);
            return (
              <div key={c.id} className="surface p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {c.mins} min · {c.modules} {tt("Module","modules")}
                    </div>
                    <div className="font-display text-lg leading-tight mt-0.5">{lang==="de"?c.deT:c.enT}</div>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${c.reqDe==="Pflicht" ? "bg-destructive/15 text-destructive" : "bg-secondary text-muted-foreground"}`}>
                    {lang==="de"?c.reqDe:c.reqEn}
                  </span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>{c.done}/{c.enrolled} {tt("abgeschlossen","completed")}</span>
                  <button className="text-primary font-semibold inline-flex items-center gap-1"><PlayCircle size={12} />{tt("Starten","Start")}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "quiz" && <QuizView tt={tt} lang={lang} />}

      {tab === "certs" && (
        <div className="surface overflow-hidden">
          <div className="grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
            <div className="col-span-4">{tt("Mitarbeiter","Staff")}</div>
            <div className="col-span-4">{tt("Zertifikat","Certificate")}</div>
            <div className="col-span-2">{tt("Ausgestellt","Issued")}</div>
            <div className="col-span-2">{tt("Gültig bis","Valid to")}</div>
          </div>
          <ul className="divide-y divide-border">
            {CERTS.map((c, i) => (
              <li key={i} className="grid grid-cols-12 items-center px-5 py-3 text-sm">
                <div className="col-span-4 flex items-center gap-2"><Award size={14} className="text-primary" />{c.name}</div>
                <div className="col-span-4">{lang==="de"?c.deC:c.enC}</div>
                <div className="col-span-2 text-xs text-muted-foreground font-mono">{c.issued}</div>
                <div className="col-span-2 text-xs font-mono">{c.valid}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="surface p-5 flex items-center gap-3">
        <ShieldCheck size={20} className="text-primary" />
        <p className="text-xs text-muted-foreground">{t("training.privacy")}</p>
      </div>
    </div>
  );
}

function TabBtn({ on, onClick, icon: Icon, label }: { on: boolean; onClick: () => void; icon: typeof BookOpen; label: string }) {
  return (
    <button onClick={onClick} className={`px-4 py-1.5 rounded-full ${on ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
      <Icon size={14} className="inline mr-1.5" />{label}
    </button>
  );
}

function QuizView({ tt, lang }: { tt: (a: string, b: string) => string; lang: "de" | "en" }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const q = QUIZ[i];
  const done = i >= QUIZ.length;

  if (done) {
    return (
      <div className="surface p-10 text-center">
        <Award size={40} className="mx-auto text-primary mb-2" />
        <div className="font-display text-2xl">{tt("Ergebnis","Result")}: {score}/{QUIZ.length}</div>
        <p className="text-sm text-muted-foreground mt-2">
          {score === QUIZ.length ? tt("Zertifikat wird erstellt.","Certificate is being issued.") : tt("Wiederhole den Test, um zu bestehen.","Retake the test to pass.")}
        </p>
        <button className="btn-alert-solid mt-4" onClick={() => { setI(0); setPicked(null); setScore(0); }}>
          {tt("Neu starten","Restart")}
        </button>
      </div>
    );
  }

  return (
    <div className="surface p-6 space-y-4 max-w-2xl">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{tt("Frage","Question")} {i+1} / {QUIZ.length}</div>
      <div className="font-display text-xl">{lang==="de"?q.deQ:q.enQ}</div>
      <div className="grid gap-2">
        {(lang==="de"?q.deA:q.enA).map((a, idx) => {
          const isPicked = picked === idx;
          const isCorrect = picked !== null && idx === q.correct;
          const isWrong = isPicked && idx !== q.correct;
          return (
            <button key={idx} disabled={picked !== null} onClick={() => setPicked(idx)}
              className={`text-left px-4 py-3 rounded-xl border text-sm transition ${
                isCorrect ? "border-success bg-success/10" :
                isWrong ? "border-destructive bg-destructive/10" :
                "border-border hover:bg-secondary/60"
              }`}>
              {a}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <button className="btn-alert-solid" onClick={() => {
          if (picked === q.correct) setScore((s) => s + 1);
          setPicked(null); setI((n) => n + 1);
        }}>{tt("Weiter","Next")}</button>
      )}
    </div>
  );
}
