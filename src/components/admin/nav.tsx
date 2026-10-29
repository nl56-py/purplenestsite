"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BedDouble, CircleHelp, ExternalLink, Images, Inbox, LayoutDashboard, Loader2, LogOut, Megaphone, Menu, MessageSquareQuote,
  ScrollText, Settings, Sparkles, UserRound, UtensilsCrossed, X,
} from "lucide-react";
import { logout } from "@/app/admin/actions";

const LINKS = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/rooms", label: "Rooms & beds", Icon: BedDouble },
  { href: "/admin/notices", label: "Notices & popup", Icon: Megaphone },
  { href: "/admin/enquiries", label: "Enquiries", Icon: Inbox, badge: true },
  { href: "/admin/gallery", label: "Photo gallery", Icon: Images },
  { href: "/admin/facilities", label: "Facilities", Icon: Sparkles },
  { href: "/admin/rules", label: "Hostel rules", Icon: ScrollText },
  { href: "/admin/menu", label: "Food menu", Icon: UtensilsCrossed },
  { href: "/admin/testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { href: "/admin/faqs", label: "FAQs", Icon: CircleHelp },
  { href: "/admin/settings", label: "Website settings", Icon: Settings },
  { href: "/admin/account", label: "My account", Icon: UserRound },
];

export function AdminNav({ hostelName, email, newEnquiries }: { hostelName: string; email: string; newEnquiries: number }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setPendingHref(null);
  }, [path]);

  const active = (href: string) => (href === "/admin" ? path === href : path.startsWith(href));

  return (
    <>
      {/* Top glowing progress bar during tab transitions */}
      {pendingHref && (
        <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-brand shadow-[0_0_8px_var(--brand,#fd7444)] animate-pulse" />
      )}

      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
        <p className="truncate font-extrabold">{hostelName}</p>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="rounded-lg p-2">
          <Menu className="size-6" />
        </button>
      </div>
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-white transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="min-w-0">
            <p className="truncate font-extrabold">{hostelName}</p>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Website admin</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-lg p-1 lg:hidden">
            <X className="size-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
          {LINKS.map(({ href, label, Icon, badge }) => {
            const isTarget = pendingHref === href;
            const isCurrent = active(href);
            return (
              <Link
                key={href}
                href={href}
                prefetch={true}
                onClick={() => {
                  setOpen(false);
                  if (path !== href) setPendingHref(href);
                }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isCurrent || isTarget
                    ? "bg-brand text-white shadow-sm"
                    : "text-ink/75 hover:bg-brand-soft hover:text-brand"
                }`}
              >
                {isTarget ? (
                  <Loader2 className="size-4.5 shrink-0 animate-spin" />
                ) : (
                  <Icon className="size-4.5 shrink-0" />
                )}
                <span className="flex-1">{label}</span>
                {badge && newEnquiries > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      isCurrent || isTarget ? "bg-white text-brand" : "bg-accent text-ink"
                    }`}
                  >
                    {newEnquiries}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-line p-3">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink/75 hover:bg-brand-soft hover:text-brand">
            <ExternalLink className="size-4.5" /> View website
          </a>
          <form action={logout}>
            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink/75 hover:bg-red-50 hover:text-red-700">
              <LogOut className="size-4.5" /> Sign out
            </button>
          </form>
          <p className="truncate px-3 pt-1 text-xs text-muted">{email}</p>
        </div>
      </aside>
    </>
  );
}
