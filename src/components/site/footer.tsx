import Link from "next/link";
import { Phone, MapPin, Mail, Clock, ShieldCheck } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { telHref } from "@/lib/format";
import { Logo } from "./logo";
import { SocialLinks } from "./social-links";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-cream pt-16 pb-12">
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" aria-label={`${settings.hostel_name} home`}>
              <Logo settings={settings} />
            </Link>
            <p className="text-xs text-muted font-serif leading-relaxed">
              {settings.tagline || "A safe, clean, and modern living home located centrally at Sinpa Marg, Gwarko, Lalitpur (Kathmandu Valley)."}
            </p>
            <div className="pt-2">
              <span className="oswald text-[12px] !tracking-[0.16em] uppercase text-ink font-semibold block mb-2">Connect</span>
              <SocialLinks
                settings={settings}
                className="gap-2.5"
                iconClass="size-8 rounded-full bg-sun p-1.5 text-ink transition hover:bg-brand hover:text-white"
              />
            </div>
          </div>

          {/* Quick Links Col */}
          <div>
            <h4 className="oswald text-[14px] !tracking-[0.18em] uppercase text-ink font-bold border-b border-line/60 pb-2">
              Explore Pages
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <Link href="/" className="text-muted hover:text-brand transition">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-muted hover:text-brand transition">About Our Hostel</Link>
              </li>
              <li>
                <Link href="/rooms" className="text-muted hover:text-brand transition">Rooms & Pricing</Link>
              </li>
              <li>
                <Link href="/facilities" className="text-muted hover:text-brand transition">All Facilities</Link>
              </li>
              <li>
                <Link href="/menu" className="text-muted hover:text-brand transition">Weekly Food Menu</Link>
              </li>
              <li>
                <Link href="/gallery" className="text-muted hover:text-brand transition">Photo Gallery</Link>
              </li>
              <li>
                <Link href="/rules" className="text-muted hover:text-brand transition">Rules & Guidelines</Link>
              </li>
              <li>
                <Link href="/notices" className="text-muted hover:text-brand transition">Notice Board</Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted hover:text-brand transition">Contact & Location</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details Col */}
          <div>
            <h4 className="oswald text-[14px] !tracking-[0.18em] uppercase text-ink font-bold border-b border-line/60 pb-2">
              Get in Touch
            </h4>
            <ul className="mt-4 space-y-3 text-xs text-muted">
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="size-4 text-sun-dark shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-start gap-2.5">
                  <Phone className="size-4 text-sun-dark shrink-0 mt-0.5" />
                  <a href={telHref(settings.phone)} className="hover:text-brand font-medium text-ink">
                    {settings.phone}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex items-start gap-2.5">
                  <Mail className="size-4 text-sun-dark shrink-0 mt-0.5" />
                  <a href={`mailto:${settings.email}`} className="hover:text-brand break-all">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.office_hours && (
                <li className="flex items-start gap-2.5">
                  <Clock className="size-4 text-sun-dark shrink-0 mt-0.5" />
                  <span>{settings.office_hours}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Admissions / Hours Col */}
          <div>
            <h4 className="oswald text-[14px] !tracking-[0.18em] uppercase text-ink font-bold border-b border-line/60 pb-2">
              Admissions Status
            </h4>
            <div className="mt-4 rounded-xl border border-line bg-white p-4">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="oswald text-[11px] !tracking-[0.16em] uppercase text-ink font-bold">
                  {settings.admission_open ? "2026 Admissions Open" : "Waitlist Active"}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-muted font-serif">
                Single, 2-seater, 3-seater & 4-seater rooms with 4 meals included.
              </p>
              <Link href="/rooms" className="tbtn tbtn-brand mt-3 w-full justify-center py-2 text-[11px] !tracking-[0.16em]">
                View Room Fees
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line/80 pt-6 text-xs text-muted">
          <p>
            {settings.hostel_name} © {year}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-brand">Location Map</Link>
            <span>•</span>
            <Link href="/rules" className="hover:text-brand">Hostel Rules</Link>
            <span>•</span>
            <Link href="/admin" className="text-muted/70 hover:text-brand font-mono">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
