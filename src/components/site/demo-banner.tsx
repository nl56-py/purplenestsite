"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, ExternalLink, HelpCircle, X, CheckCircle2, ChevronRight, Image as ImageIcon, Sliders, Palette } from "lucide-react";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("hostel_demo_banner_dismissed");
    if (!isDismissed) {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("hostel_demo_banner_dismissed", "1");
  };

  if (dismissed) {
    return (
      <>
        {/* Floating pill to reopen guide when dismissed */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="fixed bottom-20 left-4 z-40 hidden sm:flex items-center gap-2 rounded-full border border-sun/60 bg-ink/95 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xl backdrop-blur transition hover:scale-105 hover:bg-black"
          title="See what is editable from Admin Panel"
        >
          <Sparkles className="size-3.5 text-sun animate-pulse" />
          <span>Demo CMS Guide</span>
        </button>

        {showModal && <EditableGuideModal onClose={() => setShowModal(false)} />}
      </>
    );
  }

  return (
    <>
      <div className="relative z-40 border-b border-amber-300/80 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/90 px-4 py-2 text-ink shadow-xs">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 font-bold uppercase tracking-wider text-[10px] text-amber-900 border border-amber-300">
              <Sparkles className="size-3 text-amber-700" />
              Live CMS Demo
            </span>
            <span className="hidden sm:inline font-medium text-stone-700">
              Every section, room, bed counter, 7-day food menu, photo, and theme color is <strong className="text-stone-900 font-bold">100% editable in real time</strong> from the Admin Panel.
            </span>
            <span className="sm:hidden font-medium text-stone-700">
              Content & photos are editable via Admin Panel.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 font-semibold text-stone-800 shadow-xs border border-amber-200/90 transition hover:bg-amber-50 hover:text-amber-900"
            >
              <HelpCircle className="size-3.5 text-amber-600" />
              <span>What's Editable?</span>
            </button>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1 rounded-md bg-[var(--brand,#fd7444)] px-3 py-1 font-bold text-white shadow-xs transition hover:opacity-90"
            >
              <span>Admin Panel</span>
              <ExternalLink className="size-3" />
            </Link>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss demo banner"
              className="ml-1 rounded p-1 text-stone-500 hover:bg-amber-200/60 hover:text-stone-800 transition"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {showModal && <EditableGuideModal onClose={() => setShowModal(false)} />}
    </>
  );
}

const EDITABLE_SECTIONS = [
  {
    category: "Branding & Colors",
    adminTab: "Website Settings",
    adminUrl: "/admin/settings",
    icon: Palette,
    items: [
      { name: "Hostel Name & Tagline", desc: "Shown across top header, footer, page titles and meta SEO tags." },
      { name: "Main & Secondary Colors", desc: "Change the brand color (buttons, headings) and band color (booking bar) with 1 click." },
      { name: "Hostel Logo", desc: "Upload custom logo image or display clean typography." },
      { name: "Admissions Open Badge", desc: "Toggle the admissions status badge on/off instantly." },
    ],
  },
  {
    category: "Hero Slideshow & Photos",
    adminTab: "Website Settings",
    adminUrl: "/admin/settings",
    icon: ImageIcon,
    items: [
      { name: "Home Page Slideshow", desc: "Add, reorder or remove up to 8 full-width hero photos with headlines and subtitles." },
      { name: "About Us Photo & Text", desc: "Upload warden/building photo, greeting (e.g. 'Namaste!'), and full hostel story." },
      { name: "Middle Promo Photo Banner", desc: "Full-width background image with custom callout badge (e.g. '4 Fresh Meals Daily')." },
    ],
  },
  {
    category: "Rooms & Real-Time Beds",
    adminTab: "Rooms & beds",
    adminUrl: "/admin/rooms",
    icon: Sliders,
    items: [
      { name: "Live Bed Counters", desc: "Change 'Available Beds' with a simple + / − stepper. The live availability popup updates immediately." },
      { name: "Room Types & Pricing", desc: "Add/edit Single, Double, Triple, Four Seater rooms, monthly fees, and admission deposits." },
      { name: "Room Gallery Photos", desc: "Upload multiple high-res photos for each room type." },
      { name: "Room Amenities & Features", desc: "Bullet points for attached bath, balconies, Wi-Fi, study desks." },
    ],
  },
  {
    category: "Food Menu & Dining",
    adminTab: "Food menu",
    adminUrl: "/admin/menu",
    icon: CheckCircle2,
    items: [
      { name: "7-Day Weekly Meal Schedule", desc: "Full table covering Sunday through Saturday: Morning tea, Day meal, Evening snacks, and Dinner." },
      { name: "Today's Meal Auto-Highlight", desc: "Website automatically detects the current day and highlights today's active menu." },
      { name: "Instant Menu Updates", desc: "Change weekly specials (e.g., Saturday Momo, Chicken Curry, Paneer) anytime from admin." },
    ],
  },
  {
    category: "Gallery & Facilities",
    adminTab: "Photo gallery & Facilities",
    adminUrl: "/admin/gallery",
    icon: ImageIcon,
    items: [
      { name: "Photo Gallery", desc: "Upload unlimited photos with captions and category tags (Rooms, Dining, Study Hall, Exterior)." },
      { name: "Hostel Facilities", desc: "Manage Wi-Fi, solar heating, 24/7 CCTV, library hall, with custom icons and detailed pages." },
    ],
  },
  {
    category: "Notices, Reviews & Rules",
    adminTab: "Notices, Testimonials, Rules",
    adminUrl: "/admin/notices",
    icon: CheckCircle2,
    items: [
      { name: "Popup Announcement Banner", desc: "Create special notices that greet visitors with a high-visibility popup." },
      { name: "Student Testimonials", desc: "Add student reviews, college names, star ratings, and student profile photos." },
      { name: "Hostel Rules & Code of Conduct", desc: "Categorized rules for Gate Timings, Mess Etiquette, Visitors, and Fees." },
      { name: "Frequently Asked Questions (FAQs)", desc: "Add/edit questions and answers with accordion toggles." },
    ],
  },
  {
    category: "Contact & Location",
    adminTab: "Website Settings",
    adminUrl: "/admin/settings",
    icon: CheckCircle2,
    items: [
      { name: "Phones & WhatsApp", desc: "Direct calling and instant WhatsApp chat with warden." },
      { name: "Address & Office Hours", desc: "Gwarko/Lalitpur location and visiting times." },
      { name: "Google Map Embed", desc: "Embed real interactive Google Map showing hostel location." },
      { name: "Social Media Links", desc: "Facebook, Instagram, TikTok, and YouTube links in header and footer." },
    ],
  },
];

function EditableGuideModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="CMS Editable Content Guide"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line bg-stone-50 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-amber-500/15 text-amber-800">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-ink">Demo Showcase: What is Editable via Admin Panel?</h3>
              <p className="text-xs text-muted">All changes appear live on the public website within seconds.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="grid size-8 place-items-center rounded-lg text-muted hover:bg-sand hover:text-ink transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold">Admin Credentials for Demo:</span>
              <div className="font-mono mt-0.5 text-stone-700">Email: <strong>hostelweb@nexa.com</strong> | Password: <strong>12345678</strong></div>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand,#fd7444)] px-3.5 py-2 font-bold text-white text-xs shadow-sm hover:opacity-90 transition shrink-0"
            >
              <span>Open Admin Panel</span>
              <ExternalLink className="size-3.5" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {EDITABLE_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <div key={sec.category} className="rounded-xl border border-line bg-white p-4.5 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 border-b border-line pb-2.5">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4 text-[var(--brand,#fd7444)]" />
                        <h4 className="font-bold text-sm text-ink">{sec.category}</h4>
                      </div>
                      <Link
                        href={sec.adminUrl}
                        className="text-[11px] font-semibold text-muted hover:text-brand flex items-center gap-0.5 transition"
                      >
                        <span>{sec.adminTab}</span>
                        <ChevronRight className="size-3" />
                      </Link>
                    </div>

                    <ul className="mt-3 space-y-2.5">
                      {sec.items.map((item) => (
                        <li key={item.name} className="text-xs">
                          <span className="font-bold text-stone-900 block">• {item.name}</span>
                          <span className="text-muted block pl-3">{item.desc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line bg-stone-50 px-6 py-3.5 flex items-center justify-between">
          <p className="text-xs text-muted">Try changing any bed count or text in the Admin Panel to see it update immediately!</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-line bg-white px-4 py-1.5 text-xs font-semibold text-ink hover:bg-sand transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
