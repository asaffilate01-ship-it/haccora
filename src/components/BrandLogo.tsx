import { Link } from "@tanstack/react-router";
import logo from "@/assets/haccora-logo.png.asset.json";

interface BrandLogoProps {
  className?: string;
  imgClassName?: string;
  to?: string;
  ariaLabel?: string;
}

/**
 * Haccora brand logo (shield + wordmark + slogan baked into the image).
 * Wrapped in a link by default; pass to={""} or use <BrandLogoImage/> to skip the link.
 */
export function BrandLogo({ className = "", imgClassName = "h-10 md:h-12 w-auto", to = "/", ariaLabel = "Haccora" }: BrandLogoProps) {
  const img = (
    <img
      src={logo.url}
      alt={ariaLabel}
      className={imgClassName}
      loading="eager"
      decoding="async"
    />
  );
  if (!to) return <span className={className}>{img}</span>;
  return (
    <Link to={to} aria-label={ariaLabel} className={`inline-flex items-center ${className}`}>
      {img}
    </Link>
  );
}

export function BrandLogoImage({ className = "h-10 w-auto", alt = "Haccora" }: { className?: string; alt?: string }) {
  return <img src={logo.url} alt={alt} className={className} loading="eager" decoding="async" />;
}
