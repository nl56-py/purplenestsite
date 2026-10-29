import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageBannerProps {
  title: string;
  label?: string;
  description?: string;
  crumbs?: { label: string; href?: string }[];
}

export function PageBanner({ title, label, description, crumbs }: PageBannerProps) {
  return (
    <div className="relative overflow-hidden bg-brand py-12 md:py-16 text-white">
      {/* Decorative background grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-5">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/70">
          <Link href="/" className="hover:text-sun transition">
            Home
          </Link>
          {crumbs ? (
            crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-2">
                <ChevronRight className="size-3 text-sun/80" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-sun transition">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white font-medium">{c.label}</span>
                )}
              </span>
            ))
          ) : (
            <span className="flex items-center gap-2">
              <ChevronRight className="size-3 text-sun/80" />
              <span className="text-white font-medium">{title}</span>
            </span>
          )}
        </nav>

        {/* Category label */}
        {label && (
          <p className="oswald mt-4 text-[11px] !tracking-[0.25em] text-sun uppercase font-semibold">
            {label}
          </p>
        )}

        {/* Main Title */}
        <h1 className="display mt-2 text-[clamp(2.4rem,4.5vw,3.8rem)] leading-[1.08] text-white">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="mt-3 max-w-2xl text-[15px] md:text-[16px] text-white/85 font-serif leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
