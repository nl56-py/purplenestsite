"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import type { GalleryImage } from "@/lib/types";
import { SectionHeading } from "./section-heading";

const PAGE = 9;

export function Gallery({ images }: { images: GalleryImage[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(images.map((i) => i.category || "General")))], [images]);
  const [cat, setCat] = useState("All");
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);

  const filtered = cat === "All" ? images : images.filter((i) => (i.category || "General") === cat);
  const visible = filtered.slice(0, limit);

  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + filtered.length) % filtered.length)), [filtered.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, step]);

  if (!images.length) return null;
  const current = open !== null ? filtered[open] : null;

  return (
    <section id="gallery" className="py-24 md:py-28">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionHeading title="Photogallery" label="our hostel" />
        {categories.length > 2 && (
          <div className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-2" role="tablist">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={c === cat}
                onClick={() => {
                  setCat(c);
                  setLimit(PAGE);
                }}
                className={`oswald border-b-2 pb-1 text-[12px] !tracking-[0.25em] transition ${c === cat ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
        <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {visible.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setOpen(i)}
              className="img-fallback group relative mb-5 block w-full break-inside-avoid overflow-hidden"
              aria-label={`Open photo${img.caption ? `: ${img.caption}` : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.image_url} alt={img.caption} loading="lazy" className="block min-h-40 w-full object-cover transition duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-brand/80 text-white opacity-0 transition duration-300 group-hover:opacity-100">
                <span className="grid size-12 place-items-center rounded-full border-2 border-white">
                  <Plus className="size-6" />
                </span>
                {img.caption && <span className="oswald px-4 text-[13px] !tracking-[0.2em]">{img.caption}</span>}
              </span>
            </button>
          ))}
        </div>
        {filtered.length > limit && (
          <div className="mt-10 text-center">
            <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="tbtn tbtn-dark px-16">
              More photos
            </button>
          </div>
        )}
      </div>

      {current && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setOpen(null)}>
          <button type="button" aria-label="Close" className="absolute right-4 top-4 grid size-12 place-items-center bg-sun text-ink" onClick={() => setOpen(null)}>
            <X className="size-6" />
          </button>
          {filtered.length > 1 && (
            <>
              <button type="button" aria-label="Previous" className="absolute left-3 grid size-12 place-items-center border-2 border-white/40 text-white hover:bg-white/15" onClick={(e) => { e.stopPropagation(); step(-1); }}>
                <ChevronLeft className="size-6" />
              </button>
              <button type="button" aria-label="Next" className="absolute right-3 grid size-12 place-items-center border-2 border-white/40 text-white hover:bg-white/15" onClick={(e) => { e.stopPropagation(); step(1); }}>
                <ChevronRight className="size-6" />
              </button>
            </>
          )}
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.image_url} alt={current.caption} className="max-h-[80vh] w-auto object-contain" />
            <figcaption className="oswald mt-4 text-center text-[12px] !tracking-[0.2em] text-white/80">
              {current.caption} <span className="text-white/40">· {open! + 1} / {filtered.length}</span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
