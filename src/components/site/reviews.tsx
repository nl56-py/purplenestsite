"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export function Reviews({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (items.length < 2 || paused) return;
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length, paused]);

  if (!items.length) return null;
  const avg = items.reduce((s, t) => s + t.rating, 0) / items.length;
  const t = items[i];
  const initials = t.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");

  return (
    <section className="bg-leaf" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-5 py-20 md:py-24 lg:grid-cols-[220px_1fr_300px]">
        <div className="flex flex-col items-center text-center">
          <div className="grid size-[190px] place-items-center rounded-full bg-white">
            <span className="oswald text-[64px] font-medium !tracking-normal text-leaf">{avg.toFixed(1)}</span>
          </div>
          <p className="oswald mt-6 text-[14px] leading-relaxed text-white">
            Rating from {items.length}
            <br />
            {items.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="min-h-[300px]">
          <h2 className="display text-[clamp(3rem,6vw,4.6rem)] text-white">Students say:</h2>
          <div key={t.id} className="animate-fade-up">
            <p className="oswald mt-8 text-[13px] !tracking-[0.2em] text-sun">
              {t.name}
              {t.role && <span className="text-white/75">, {t.role}</span>}
            </p>
            <div className="mt-2 flex gap-1" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className={`size-4 ${k < t.rating ? "fill-sun text-sun" : "text-white/40"}`} />
              ))}
            </div>
            <blockquote className="mt-5 max-w-xl text-[17px] leading-[1.8] text-white">“{t.message}”</blockquote>
          </div>
          {items.length > 1 && (
            <div className="mt-8 flex gap-3">
              {items.map((x, k) => (
                <button
                  key={x.id}
                  type="button"
                  aria-label={`Show review by ${x.name}`}
                  aria-current={k === i}
                  onClick={() => setI(k)}
                  className={`size-3 rounded-full border-2 border-white transition ${k === i ? "bg-white" : "bg-transparent hover:bg-white/50"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mx-auto hidden size-[300px] overflow-hidden rounded-full border-[10px] border-white/25 lg:block">
          {t.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={t.id} src={t.photo_url} alt={t.name} className="size-full animate-fade-up object-cover" loading="lazy" />
          ) : (
            <div className="display grid size-full place-items-center bg-white/15 text-[96px] text-white">{initials}</div>
          )}
        </div>
      </div>
    </section>
  );
}
