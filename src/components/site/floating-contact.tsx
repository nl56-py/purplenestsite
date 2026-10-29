"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import type { SiteSettings } from "@/lib/types";
import { whatsappHref } from "@/lib/format";
import { WhatsappIcon } from "@/lib/icons";

export function FloatingContact({ settings }: { settings: SiteSettings }) {
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col items-center gap-3">
      {settings.whatsapp && (
        <a
          href={whatsappHref(settings.whatsapp, `Namaste! I want to know about ${settings.hostel_name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid size-13 place-items-center rounded-full bg-[#25d366] text-white shadow-lg transition hover:scale-105"
        >
          <WhatsappIcon className="size-7" />
        </a>
      )}
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`grid size-11 place-items-center rounded-full bg-ink text-white shadow transition hover:bg-brand ${showTop ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ChevronUp className="size-5" />
      </button>
    </div>
  );
}
