import type { SiteSettings } from "@/lib/types";

/** Round badge with the hostel's initial, or the uploaded logo. */
export function LogoMark({ settings, size = 48 }: { settings: SiteSettings; size?: number }) {
  if (settings.logo_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={settings.logo_url}
        alt={settings.hostel_name}
        style={{ height: size, width: size }}
        className="rounded-xl object-contain shrink-0 shadow-xs"
      />
    );
  }
  const letter = settings.hostel_name.trim()[0]?.toUpperCase() ?? "H";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden className="shrink-0">
      <circle cx="32" cy="32" r="32" fill="var(--brand)" />
      <circle cx="32" cy="32" r="23" fill="none" stroke="#fff" strokeWidth="2.5" />
      <text x="32" y="42" textAnchor="middle" fill="#fff" fontFamily="Sansita, Georgia, serif" fontStyle="italic" fontWeight="800" fontSize="28">
        {letter}
      </text>
    </svg>
  );
}

export function Logo({ settings, light = false }: { settings: SiteSettings; light?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark settings={settings} />
      <span className="min-w-0 leading-none">
        <span className={`display block truncate text-[22px] ${light ? "text-white" : "text-ink"}`}>{settings.hostel_name}</span>
        <span className={`label-caps mt-1.5 block truncate !text-[11px] !tracking-[0.3em] ${light ? "text-white/60" : "text-muted"}`}>
            {settings.hostel_type}
          </span>
      </span>
    </span>
  );
}
