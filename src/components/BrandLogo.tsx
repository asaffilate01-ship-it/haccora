import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";

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
  const tagline = lang === "en" ? "Safe. Clean. Traceable." : "Sicher. Sauber. Nachweisbar.";

  return (
    <svg
      viewBox="0 0 440 112"
      role="img"
      aria-label={alt}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{alt}</title>
      <g transform="translate(5 5)">
        <path d="M46 0 86 23v46L46 96 6 69V23L46 0Z" fill="#c8102e" />
        <path d="M46 0v96l40-27V23L46 0Z" fill="#16375b" />
        <path d="M24 24h15v20h14V24h15v48H53V56H39v16H24V24Z" fill="white" />
      </g>
      <text
        x="104"
        y="65"
        fill="#c8102e"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="54"
        fontWeight="800"
        letterSpacing="-2"
      >
        Haccora
      </text>
      <text
        x="108"
        y="91"
        fill="#16375b"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="15"
        fontWeight="700"
        letterSpacing="0.4"
      >
        {tagline}
      </text>
    </svg>
  );
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
