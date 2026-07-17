import { useI18n, type Language } from "@/lib/i18n";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, setLang } = useI18n();
  const Btn = ({ code, label }: { code: Language; label: string }) => (
    <button
      onClick={() => setLang(code)}
      aria-pressed={lang === code}
      className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition ${
        lang === code
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className={`inline-flex items-center gap-0.5 p-0.5 rounded-full border border-border bg-card ${className}`}>
      <Btn code="de" label="DE" />
      <Btn code="en" label="EN" />
    </div>
  );
}
