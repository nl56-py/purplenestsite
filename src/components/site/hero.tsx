"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { HeroSlide, Room, SiteSettings } from "@/lib/types";
import { formatRs } from "@/lib/format";
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
        className="relative h-[calc(100svh-104px)] min-h-[560px] max-h-[860px] overflow-hidden bg-[#ececec]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-[1200ms] ${i === index ? "opacity-100" : "opacity-0"}`} aria-hidden={i !== index}>
            {s.image ? (
              <picture className="size-full">
                {s.desktop_image && (
                  <source media="(min-width: 768px)" srcSet={s.desktop_image} />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.title || ""}
                  className={`size-full object-cover transition-transform duration-[8000ms] ease-out ${i === index ? "scale-[1.05]" : "scale-100"}`}
                  fetchPriority={i === 0 ? "high" : "low"}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </picture>
            ) : (
              <div className="size-full bg-[radial-gradient(circle_at_75%_30%,var(--color-brand)_0%,var(--color-ink)_65%)]" />
            )}
          </div>
        ))}

        <div className="relative mx-auto flex h-full max-w-[1200px] items-start sm:items-center px-5 pt-6 pb-8 sm:py-8">
          {slides.map(
            (s, i) =>
              i === index && (
                <div
                  key={i}
                  className="max-w-2xl py-4 animate-fade-up"
                >
                  {/* Location & 3 Blocks Badge */}
                  <div className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-brand/30 bg-white/95 px-4 py-1.5 text-xs font-bold text-brand shadow-sm">
                    <span className="flex items-center gap-1.5 text-brand">
                      <MapPin className="size-3.5 shrink-0 text-brand" />
                      <span>Sinpa Marg, Gwarko, Lalitpur</span>
                    </span>
                    <span className="text-brand/40">•</span>
                    <span className="flex items-center gap-1.5 text-brand">
                      <Building2 className="size-3.5 shrink-0 text-brand" />
                      <span>3 Dedicated Blocks (A, B, C)</span>
                    </span>
                  </div>

                  <h1 className="display text-[clamp(2.8rem,7vw,5.5rem)] leading-[0.98] text-brand [text-shadow:0_1px_3px_rgba(255,255,255,0.95),0_0_15px_rgba(255,255,255,0.7)]">
                    {s.title}
                  </h1>

                  {cheapest > 0 && (
                    <p className="label-caps mt-4 flex flex-wrap items-baseline gap-x-3 text-[13px] !tracking-[0.32em] text-brand/85 [text-shadow:0_1px_2px_rgba(255,255,255,0.9)]">
                      from{" "}
                      <span className="oswald text-[2.6rem] sm:text-[3.2rem] font-bold normal-case leading-none !tracking-normal text-brand drop-shadow-[0_2px_10px_rgba(255,255,255,0.85)]">
                        {formatRs(cheapest)}
                      </span>{" "}
                      a month
                    </p>
                  )}

                  {s.subtitle && (
                    <p className="mt-3.5 text-[15.5px] sm:text-[17px] font-medium leading-relaxed text-ink [text-shadow:0_1px_2px_rgba(255,255,255,0.95)]">
                      {s.subtitle}
                    </p>
                  )}

                  {/* Quick highlights pill strip */}
                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-brand/25 bg-white/95 px-3 py-1.5 font-bold text-brand shadow-xs">
                      <Building2 className="size-3.5 text-brand" />
                      <span>Block A • Block B • Block C</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-brand/25 bg-white/95 px-3 py-1.5 font-bold text-brand shadow-xs">
                      <MapPin className="size-3.5 text-brand" />
                      <span>Near Gwarko Chowk</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-brand/25 bg-white/95 px-3 py-1.5 font-bold text-brand shadow-xs">
                      <span>🍲 4 Fresh Meals Daily</span>
                    </span>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-3.5">
                    <a href="#rooms" className="tbtn tbtn-sun shadow-lg font-bold text-brand">
                      View 3 Blocks & Rooms
                    </a>
                    <a
                      href="#contact"
                      className="tbtn border-2 border-brand bg-white/95 text-brand hover:bg-brand hover:text-white font-bold shadow-md transition"
                    >
                      Visit Us in Gwarko
                    </a>
                  </div>
                </div>
              ),
          )}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous slide"
              className="absolute left-5 top-1/2 hidden size-14 -translate-y-1/2 place-items-center rounded-full border-2 border-brand/40 bg-white/90 text-brand shadow-md transition hover:border-brand hover:bg-brand hover:text-white md:grid"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next slide"
              className="absolute right-5 top-1/2 hidden size-14 -translate-y-1/2 place-items-center rounded-full border-2 border-brand/40 bg-white/90 text-brand shadow-md transition hover:border-brand hover:bg-brand hover:text-white md:grid"
            >
              <ChevronRight className="size-6" />
            </button>
            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => setIndex(i)}
                  className={`size-3.5 rounded-full border-2 transition ${
                    i === index ? "border-brand bg-brand scale-110" : "border-brand/50 bg-white/80 hover:bg-brand/30"
                  }`}
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
  const [selectedBlock, setSelectedBlock] = useState("");
  const [roomId, setRoomId] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [persons, setPersons] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Available blocks from rooms
  const blockNames = Array.from(new Set(rooms.map((r) => r.block_name).filter(Boolean))) as string[];
  const blocksToOffer = blockNames.length > 0 ? blockNames : ["Block A", "Block B", "Block C"];

  const filteredRooms = selectedBlock
    ? rooms.filter((r) => (r.block_name || "").toLowerCase() === selectedBlock.toLowerCase())
    : rooms;

  return (
    <>
      <div className="bg-leaf">
        <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-5 py-12 lg:grid-cols-[280px_1fr] lg:py-14">
          <div>
            <h2 className="display text-[clamp(2.2rem,3.8vw,2.8rem)] text-white">Book your bed!</h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {admissionOpen && <p className="label-caps text-white/85">admissions open</p>}
              <span className="text-white/40">•</span>
              <span className="oswald text-[11px] uppercase tracking-wider text-sun">Gwarko, Lalitpur (3 Blocks)</span>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsModalOpen(true);
            }}
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.1fr_1.3fr_1.1fr_0.8fr_auto]"
          >
            {/* Block select */}
            <label className="sr-only" htmlFor="bb-block">Select Block</label>
            <select
              id="bb-block"
              className="tfield"
              value={selectedBlock}
              onChange={(e) => {
                setSelectedBlock(e.target.value);
                setRoomId("");
              }}
            >
              <option value="">All 3 Blocks</option>
              {blocksToOffer.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {/* Room type select */}
            <label className="sr-only" htmlFor="bb-room">Room type</label>
            <select id="bb-room" className="tfield" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
              <option value="">Any Room Type</option>
              {filteredRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} {r.block_name ? `(${r.block_name})` : ""} {r.available_beds > 0 ? `(${r.available_beds} free)` : "(full)"}
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
