import { useI18n } from "@/lib/i18n";
import { legalContent, type LegalKey } from "@/lib/legal-content";

export function LegalPage({ k }: { k: LegalKey }) {
  const { lang, t } = useI18n();
  const doc = legalContent(lang)[k];
  return (
    <article>
      <div className="text-xs font-black uppercase tracking-widest text-[color:var(--color-alert-red)]">
        {t("legal.title")}
      </div>
      <h1 className="mt-3 display-black text-4xl md:text-5xl">{doc.title}</h1>
      <p className="mt-2 text-sm text-black/50">
        {t("legal.updated")}: {doc.updated}
      </p>
      <div className="mt-8">{doc.body}</div>
    </article>
  );
}
