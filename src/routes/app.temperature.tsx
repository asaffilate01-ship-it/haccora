import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { Thermometer, QrCode, Bluetooth, Camera, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/temperature")({
  component: TemperaturePage,
});

const equipment = [
  { id: "kh1", name: "Kühlhaus 1",  min: 0, max: 5,  last: 3.8,  method: "Sensor",    at: "vor 12 Min",  ok: true },
  { id: "kh2", name: "Kühlhaus 2",  min: 0, max: 5,  last: 6.4,  method: "Sensor",    at: "vor 4 Min",   ok: false },
  { id: "gk",  name: "Gefrierkombi", min: -22, max: -18, last: -19.8, method: "Manuell", at: "vor 2 Std", ok: true },
  { id: "hh",  name: "Heißhaltung Buffet", min: 65, max: 90, last: 71.2, method: "Sonde",   at: "vor 30 Min", ok: true },
  { id: "ea",  name: "Eintauch-Anzeige", min: 0, max: 5, last: 4.1, method: "QR + Foto", at: "vor 1 Std",  ok: true },
];

function TemperaturePage() {
  const { t } = useI18n();
  const [selected, setSelected] = useState(equipment[0]);
  const [value, setValue] = useState<string>("");
  const [toast, setToast] = useState<string>("");

  const submit = () => {
    const v = parseFloat(value);
    if (Number.isNaN(v)) return;
    const ok = v >= selected.min && v <= selected.max;
    setToast(ok ? "Temperatur gespeichert" : "Abweichung — Maßnahme erstellt");
    setValue("");
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div>
        <div className="eyebrow">Monitoring</div>
        <h1 className="mt-1 text-3xl md:text-4xl">{t("temp.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("temp.sub")}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 surface p-6">
          <h2 className="font-display text-xl">Geräte · Equipment</h2>
          <div className="mt-4 divide-y divide-border">
            {equipment.map((e) => (
              <button
                key={e.id}
                onClick={() => setSelected(e)}
                className={`w-full text-left py-3 flex items-center gap-4 rounded-lg px-2 transition ${selected.id === e.id ? "bg-secondary" : "hover:bg-secondary/50"}`}
              >
                <div className={`h-10 w-10 rounded-lg grid place-items-center ${e.ok ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                  {e.ok ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.method} · {e.at}</div>
                </div>
                <div className="text-right">
                  <div className={`font-display text-lg ${e.ok ? "" : "text-destructive"}`}>{e.last.toFixed(1)} °C</div>
                  <div className="text-[10px] text-muted-foreground">{e.min}–{e.max} °C</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="surface p-6">
          <h2 className="font-display text-xl">{t("temp.record")}</h2>
          <p className="text-xs text-muted-foreground mt-1">{selected.name} · {selected.min}–{selected.max} °C</p>

          <div className="mt-5">
            <label className="text-xs font-medium text-muted-foreground">{t("temp.value")} (°C)</label>
            <input
              type="number"
              step="0.1"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="3.8"
              className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-lg font-display focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button onClick={submit} className="btn-primary w-full mt-4"><Thermometer size={16} /> Speichern</button>

          <div className="mt-6 grid grid-cols-3 gap-2 text-[11px]">
            {[
              { i: QrCode,     l: "QR" },
              { i: Bluetooth,  l: "Bluetooth" },
              { i: Camera,     l: "Foto" },
            ].map(({ i: Icon, l }) => (
              <button key={l} className="rounded-lg border border-border bg-secondary/50 py-2.5 flex flex-col items-center gap-1 hover:bg-secondary">
                <Icon size={16} /> {l}
              </button>
            ))}
          </div>

          {toast && (
            <div className="mt-4 rounded-lg bg-primary/10 text-primary text-xs px-3 py-2">{toast}</div>
          )}
        </div>
      </div>
    </div>
  );
}
