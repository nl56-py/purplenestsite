"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HeroSlide, Room, SiteSettings } from "@/lib/types";
import { formatRs } from "@/lib/format";
import { selectRoom } from "./room-events";
import { CheckAvailabilityModal } from "./check-availability-modal";
import { NepaliDatePicker } from "./nepali-date-picker";

export function Hero({ settings, rooms }: { settings: SiteSettings; rooms: Room[] }) {
  const slides: HeroSlide[] = settings.hero_slides.length
    ? settings.hero_slides
    : [{ image: "", title: settings.hostel_name, subtitle: settings.tagline }];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const t = setInterval(() => go(1), 6500);
    return () => clearInterval(t);
  }, [go, paused, slides.length]);

  const fees = rooms.map((r) => r.monthly_fee).filter((f) => f > 0);
  const cheapest = fees.length ? Math.min(...fees) : 0;

  return (
    <section id="top" aria-roledescription="carousel" aria-label="Highlights">
      <div
        className="relative h-[calc(100svh-104px)] min-h-[520px] max-h-[860px] overflow-hidden bg-ink"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-[1200ms] ${i === index ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== index}>
            {s.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={s.image}
                alt=""
                className={`size-full object-cover transition-transform duration-[8000ms] ease-out ${i === index ? "scale-[1.06]" : "scale-100"}`}
                fetchPriority={i === 0 ? "high" : "low"}
                loading={i === 0 ? "eager" : "lazy"}
              />
            ) : (
              <div className="size-full bg-[radial-gradient(circle_at_75%_30%,var(--color-brand)_0%,var(--color-ink)_65%)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-black/5" />
          </div>
        ))}

        <div className="relative mx-auto flex h-full max-w-[1200px] items-center px-5">
          {slides.map(
            (s, i) =>
              i === index && (
                <div key={i} className="max-w-3xl text-white">
                  <h1 className="display animate-fade-up text-[clamp(3.2rem,9vw,7rem)] drop-shadow-[0_4px_18px_rgba(0,0,0,0.25)]">{s.title}</h1>
                  {cheapest > 0 && (
                    <p className="label-caps mt-6 flex animate-fade-up flex-wrap items-baseline gap-x-3 text-[13px] !tracking-[0.35em] text-white [animation-delay:150ms]">
                      from <span className="oswald text-[2.6rem] normal-case leading-none !tracking-normal text-brand">{formatRs(cheapest)}</span> a month
                    </p>
                  )}
                  {s.subtitle && <p className="mt-5 max-w-xl animate-fade-up text-[17px] leading-relaxed text-white/85 [animation-delay:250ms]">{s.subtitle}</p>}
                  <a href="#rooms" className="tbtn tbtn-sun mt-9 animate-fade-up [animation-delay:350ms]">
                    Book now
                  </a>
                </div>
              ),
          )}
        </div>

        {slides.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className="absolute left-5 top-1/2 hidden size-14 -translate-y-1/2 place-items-center border-2 border-white/40 text-white transition hover:border-sun hover:bg-sun hover:text-ink md:grid">
              <ChevronLeft className="size-6" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next slide" className="absolute right-5 top-1/2 hidden size-14 -translate-y-1/2 place-items-center border-2 border-white/40 text-white transition hover:border-sun hover:bg-sun hover:text-ink md:grid">
              <ChevronRight className="size-6" />
            </button>
            <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`size-3.5 rounded-full border-2 transition ${i === index ? "border-sun bg-sun" : "border-white bg-transparent hover:bg-white"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <BookingBand
        rooms={rooms}
        admissionOpen={settings.admission_open}
        whatsapp={settings.whatsapp}
        phone={settings.phone}
      />
    </section>
  );
}

function BookingBand({
  rooms,
  admissionOpen,
  whatsapp,
  phone,
}: {
  rooms: Room[];
  admissionOpen: boolean;
  whatsapp?: string | null;
  phone?: string | null;
}) {
  const [roomId, setRoomId] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [persons, setPersons] = useState("");
  const [dateType, setDateType] = useState<"text" | "date">("text");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-leaf">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-5 py-14 lg:grid-cols-[300px_1fr] lg:py-16">
          <div>
            <h2 className="display text-[clamp(2.4rem,4vw,2.9rem)] text-white">Book your bed!</h2>
            {admissionOpen && <p className="label-caps mt-3 text-white/80">admissions open</p>}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_auto]"
          >
            <label className="sr-only" htmlFor="bb-room">Room type</label>
            <select id="bb-room" className="tfield" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
              <option value="">Any Room Type</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} {r.available_beds > 0 ? `(${r.available_beds} free)` : "(full)"}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="bb-date">Move-in date</label>
            <NepaliDatePicker
              id="bb-date"
              value={moveIn}
              onChange={setMoveIn}
              placeholder="Move-in (नेपाली / AD)"
            />
            <label className="sr-only" htmlFor="bb-persons">Persons</label>
            <select id="bb-persons" className="tfield" value={persons} onChange={(e) => setPersons(e.target.value)}>
              <option value="">Persons</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={String(n)}>{n} {n === 1 ? "person" : "persons"}</option>
              ))}
            </select>
            <button
              type="submit"
              className="tbtn tbtn-dark h-[3.75rem] px-8 !tracking-[0.18em] shadow-md transition hover:scale-[1.02]"
            >
              Check availability
            </button>
          </form>
        </div>
      </div>

      <CheckAvailabilityModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedRoomId={roomId}
        moveInDate={moveIn}
        persons={persons}
        rooms={rooms}
        whatsapp={whatsapp}
        phone={phone}
      />
    </>
  );
}
