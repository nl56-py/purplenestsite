"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BellRing, X } from "lucide-react";
import type { Notice } from "@/lib/types";
import { formatDate } from "@/lib/format";

const KEY = "hostel-popup-dismissed";

/**
 * Shows the newest notice marked "show as popup" once per browser session.
 * Expiry is checked here in the browser because the page itself is cached.
 */
export function NoticePopup({ notices }: { notices: Notice[] }) {
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const now = Date.now();
    const candidate = notices.find((n) => n.show_as_popup && (!n.popup_until || new Date(n.popup_until).getTime() > now));
    if (!candidate) return;
    let dismissed: string | null = null;
    try {
      dismissed = sessionStorage.getItem(KEY);
    } catch {}
    if (dismissed === candidate.id) return;
    const t = setTimeout(() => setNotice(candidate), 900);
    return () => clearTimeout(t);
  }, [notices]);

  useEffect(() => {
    if (!notice) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notice]);

  function close() {
    if (notice) {
      try {
        sessionStorage.setItem(KEY, notice.id);
      } catch {}
    }
    setNotice(null);
  }

  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={close} role="dialog" aria-modal="true" aria-labelledby="popup-title">
      <div className="animate-pop-in relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={close} aria-label="Close notice" className="absolute right-0 top-0 z-10 grid size-11 place-items-center bg-sun text-ink hover:bg-white">
          <X className="size-5" />
        </button>
        {notice.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={notice.image_url} alt="" className="max-h-80 w-full object-cover" />
        ) : (
          <div className="flex items-center gap-3 bg-brand px-8 py-6 text-white">
            <BellRing className="size-6 text-sun" />
            <span className="label-caps">Notice</span>
          </div>
        )}
        <div className="p-8">
          <p className="oswald text-[11px] !tracking-[0.2em] text-muted">{formatDate(notice.published_at)}</p>
          <h2 id="popup-title" className="display mt-3 text-[2.2rem] text-brand">{notice.title}</h2>
          {notice.body && <p className="mt-4 whitespace-pre-line">{notice.body}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={close} className="tbtn tbtn-dark px-8 py-4">Got it</button>
            <Link href="/notices" onClick={close} className="tbtn tbtn-sun px-8 py-4">All notices</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
