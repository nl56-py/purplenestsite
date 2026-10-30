import type { SiteSettings } from "@/lib/types";

/** Round badge with the hostel's initial, or the uploaded logo. */
export function LogoMark({ settings, size = 48 }: { settings: SiteSettings; size?: number }) {
  const logoSrc = settings.logo_url || "/images/purple-nest-logo.png";
  
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={logoSrc}
      alt={settings.hostel_name || "The Purple Nest Hostel"}
      style={{ height: size, width: size }}
      className="rounded-xl object-contain shrink-0 drop-shadow-sm bg-white/95 p-1 border border-brand/10"
    />
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
