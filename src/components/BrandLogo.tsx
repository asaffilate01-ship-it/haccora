import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import logoDe from "@/assets/haccora-logo-de.png.asset.json";
import logoEn from "@/assets/haccora-logo-en.png.asset.json";

interface BrandLogoProps {
  className?: string;
  imgClassName?: string;
  to?: string;
  ariaLabel?: string;
  /** Wrap the logo in a white plate so it stays legible on dark backgrounds. */
  onDark?: boolean;
}

/**
 * Haccora wordmark. The German lock-up ("Sicher. Sauber. Nachweisbar.") is the
 * default; the English lock-up ("Safe. Clean. Compliant.") is shown when the
 * site language is English.
 */
export function BrandLogoImage({
  className = "h-10 w-auto",
  alt = "Haccora",
}: {
  className?: string;
  alt?: string;
}) {
  const { lang } = useI18n();
  const asset = lang === "en" ? logoEn : logoDe;
  return <img src={asset.url} alt={alt} className={className} decoding="async" />;
}

export function BrandLogo({
  className = "",
  imgClassName = "h-24 w-auto",
  to = "/",
  ariaLabel = "Haccora",
  onDark = false,
}: BrandLogoProps) {
  const artwork = <BrandLogoImage className={imgClassName} alt={ariaLabel} />;
  const wrapped = onDark ? (
    <span className="inline-flex items-center rounded-2xl bg-white px-3 py-1.5">{artwork}</span>
  ) : (
    artwork
  );
  if (!to) return <span className={`inline-flex items-center ${className}`}>{wrapped}</span>;
  return (
    <Link to={to} aria-label={ariaLabel} className={`inline-flex items-center ${className}`}>
      {wrapped}
    </Link>
  );
}
