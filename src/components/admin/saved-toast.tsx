"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

/** Shows “Saved” after a form redirects back with ?saved=1, then cleans the URL. */
export function SavedToast() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const saved = params.get("saved") === "1";

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => router.replace(path, { scroll: false }), 3000);
    return () => clearTimeout(t);
  }, [saved, path, router]);

  if (!saved) return null;
  return (
    <div className="animate-pop-in fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg" role="status">
      <CheckCircle2 className="size-4 text-emerald-400" /> Saved — the website is updated
    </div>
  );
}
