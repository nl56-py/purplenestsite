"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";

/**
 * Swipeable row of cards with round page dots (scroll-snap, no library).
 * `itemClass` sets how many cards are visible per breakpoint.
 */
export function Carousel({ children, itemClass, label }: { children: React.ReactNode; itemClass: string; label: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const p = Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
    setPages(p);
    setPage(Math.min(p - 1, Math.round(el.scrollLeft / el.clientWidth)));
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    const ro = new ResizeObserver(measure);
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  const goTo = (i: number) => {
    const el = track.current;
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={track} onScroll={measure} className="no-scrollbar -mx-3 flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
        {Children.map(children, (child) => (
          <div className={`shrink-0 snap-start px-3 ${itemClass}`}>{child}</div>
        ))}
      </div>
      {pages > 1 && (
        <div className="mt-10 flex justify-center gap-3">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show page ${i + 1}`}
              aria-current={i === page}
              onClick={() => goTo(i)}
              className={`size-3 rounded-full border-2 transition ${i === page ? "border-sun bg-transparent ring-2 ring-sun/30" : "border-line bg-line hover:border-muted"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
