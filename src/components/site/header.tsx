"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Phone, X } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { telHref } from "@/lib/format";
import { SocialLinks } from "./social-links";
import { Logo } from "./logo";

export function SiteHeader({ settings, hasNotices }: { settings: SiteSettings; hasNotices: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/rooms", label: "Rooms" },
    { href: "/facilities", label: "Facilities" },
    { href: "/menu", label: "Food menu" },
    { href: "/gallery", label: "Gallery" },
    ...(hasNotices ? [{ href: "/notices", label: "Notices" }] : []),
    { href: "/rules", label: "Rules" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white transition-shadow ${scrolled ? "shadow-[0_4px_20px_-8px_rgba(0,0,0,0.18)]" : ""}`}>
        <div className={`mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-5 transition-all duration-300 ${scrolled ? "py-3" : "py-5 md:py-7"}`}>
          <Link href="/" className="min-w-0" aria-label={`${settings.hostel_name} home`}>
            <Logo settings={settings} />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-5 xl:flex" aria-label="Desktop">
            <Link href="/about" className="oswald text-[12px] !tracking-[0.18em] text-ink transition hover:text-brand">About</Link>
            <Link href="/rooms" className="oswald text-[12px] !tracking-[0.18em] text-ink transition hover:text-brand">Rooms</Link>
            <Link href="/facilities" className="oswald text-[12px] !tracking-[0.18em] text-ink transition hover:text-brand">Facilities</Link>
            <Link href="/menu" className="oswald text-[12px] !tracking-[0.18em] text-ink transition hover:text-brand">Menu</Link>
            <Link href="/gallery" className="oswald text-[12px] !tracking-[0.18em] text-ink transition hover:text-brand">Gallery</Link>
            <Link href="/rules" className="oswald text-[12px] !tracking-[0.18em] text-ink transition hover:text-brand">Rules</Link>
            <Link href="/contact" className="oswald text-[12px] !tracking-[0.18em] text-ink transition hover:text-brand">Contact</Link>
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            {settings.phone && (
              <a href={telHref(settings.phone)} className="hidden items-center gap-2 md:flex">
                <Phone className="size-4 text-sun" aria-hidden />
                <span className="oswald text-[13px] text-ink">Call</span>
                <span className="oswald text-[14px] tracking-wider text-sun-dark">{settings.phone}</span>
              </a>
            )}
            <Link href="/rooms" className="tbtn tbtn-brand hidden py-3 px-6 text-[11px] !tracking-[0.18em] sm:inline-flex">
              Book a bed
            </Link>
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className={`grid shrink-0 place-items-center bg-ink text-white transition hover:bg-brand ${scrolled ? "size-12" : "size-14"}`}
            >
              <span className="flex w-6 flex-col gap-[5px]" aria-hidden>
                <span className="h-[3px] w-full rounded bg-current" />
                <span className="h-[3px] w-full rounded bg-current" />
                <span className="h-[3px] w-full rounded bg-current" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-[#2f2e33]/[0.97] transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <div className="mx-auto flex w-full max-w-[1200px] justify-end px-5 py-5 md:py-7">
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-14 place-items-center bg-sun text-ink transition hover:bg-white">
            <X className="size-7" strokeWidth={2.5} />
          </button>
        </div>
        <nav className="flex flex-1 flex-col items-center justify-center gap-1 overflow-y-auto pb-6" aria-label="Main">
          {links.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
              className={`oswald py-1.5 text-[clamp(1.4rem,3.4vw,2rem)] tracking-[0.15em] text-white transition-all duration-500 hover:text-sun ${
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center gap-4 pb-10">
          {settings.phone && (
            <a href={telHref(settings.phone)} tabIndex={open ? 0 : -1} className="oswald text-lg tracking-widest text-sun">
              {settings.phone}
            </a>
          )}
          <SocialLinks settings={settings} className="gap-3" iconClass="size-10 rounded-full bg-sun p-2.5 text-ink transition hover:bg-white" />
        </div>
      </div>
    </>
  );
}
