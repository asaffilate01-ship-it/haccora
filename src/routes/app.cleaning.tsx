import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Sparkles, Camera, Calendar } from "lucide-react";

export const Route = createFileRoute("/app/cleaning")({
  component: CleaningPage,
});

const schedule = [
  { area: "Küche — Boden", freq: "Täglich", chem: "Sanixyl Alkalisch", color: "Rot",   staff: "Marta", last: "Heute 06:00", photo: true },
  { area: "Arbeitsflächen",  freq: "3× / Tag", chem: "DesInfekt 70",     color: "Blau",  staff: "Chef",  last: "Heute 12:15", photo: true },
  { area: "Fritteuse",       freq: "Wöchentlich", chem: "OilClean Plus", color: "Gelb",  staff: "Omar",  last: "Mo 18:00",    photo: true },
  { area: "Kühlhaus 1",      freq: "Wöchentlich", chem: "FrostClean",    color: "Grün",  staff: "Aylin", last: "So 22:00",    photo: true },
  { area: "Toiletten Gäste", freq: "2× / Tag",    chem: "HygieneMax",    color: "Weiß",  staff: "Marta", last: "Heute 14:00", photo: true },
  { area: "Abzugshaube",     freq: "Monatlich",   chem: "Extern (Firma X)", color: "–",  staff: "Contractor", last: "01.07.",  photo: false },
];

function CleaningPage() {
  const { t } = useI18n();
  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">Cleaning & pest control</div>
        <h1 className="mt-1 text-3xl md:text-4xl">Reinigung & Schädlingskontrolle</h1>
        <p className="text-muted-foreground mt-1">Reinigungsplan · Chemikalienregister · Sicherheitsdatenblätter · Fotobeleg.</p>
      </div>

      <div className="surface overflow-hidden">
        <div className="hidden md:grid grid-cols-12 text-xs uppercase tracking-widest text-muted-foreground bg-secondary/60 px-5 py-3">
          <div className="col-span-3">Bereich</div>
          <div className="col-span-2">Häufigkeit</div>
          <div className="col-span-2">Chemikalie</div>
          <div className="col-span-1">Farbe</div>
          <div className="col-span-2">Verantwortlich</div>
          <div className="col-span-2">Letzter Nachweis</div>
        </div>
        <div className="divide-y divide-border">
          {schedule.map((r) => (
            <div key={r.area} className="grid grid-cols-1 md:grid-cols-12 px-5 py-4 items-center gap-3">
              <div className="md:col-span-3 flex items-center gap-3">
                <span className="h-9 w-9 rounded-lg bg-primary/10 text-primary grid place-items-center"><Sparkles size={16} /></span>
                <div className="font-medium text-sm">{r.area}</div>
              </div>
              <div className="md:col-span-2 text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12} /> {r.freq}</div>
              <div className="md:col-span-2 text-xs">{r.chem}</div>
              <div className="md:col-span-1 text-xs">{r.color}</div>
              <div className="md:col-span-2 text-xs">{r.staff}</div>
              <div className="md:col-span-2 text-xs text-muted-foreground flex items-center gap-1.5">
                {r.photo && <Camera size={12} className="text-success" />} {r.last}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
