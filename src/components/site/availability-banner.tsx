"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { BedDouble, MessageCircle, X, ChevronUp, ChevronDown, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { formatRs, whatsappHref } from "@/lib/format";

interface RoomAvailability {
  id: string;
  name: string;
  beds_per_room: number;
  total_beds: number;
  available_beds: number;
  monthly_fee: number;
}

interface AvailabilityBannerProps {
  initialRooms: {
    id: string;
    name: string;
    beds_per_room: number;
    total_beds: number;
    available_beds: number;
    monthly_fee: number;
  }[];
  initialAdmissionOpen: boolean;
  whatsapp?: string | null;
}

export function AvailabilityBanner({
  initialRooms,
  initialAdmissionOpen,
  whatsapp,
}: AvailabilityBannerProps) {
  const [rooms, setRooms] = useState<RoomAvailability[]>(initialRooms);
  const [admissionOpen, setAdmissionOpen] = useState<boolean>(initialAdmissionOpen);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [lastUpdatedNotice, setLastUpdatedNotice] = useState<boolean>(false);
  const prevDataRef = useRef<string>("");

  const totalAvailable = rooms.reduce((s, r) => s + (r.available_beds || 0), 0);
  const totalBeds = rooms.reduce((s, r) => s + (r.total_beds || 0), 0);

  // Initial delayed pop-in so visitor gets pleasant entry
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && (window.innerWidth < 768 || window.matchMedia("(max-width: 767px)").matches);
    const delay = isMobile ? 1800 : 1200;
    const t = setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => clearTimeout(t);
  }, []);

  // Poll for real-time changes
  useEffect(() => {
    let isMounted = true;

    async function checkAvailability() {
      try {
        const res = await fetch("/api/availability", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (!data || !data.ok || !isMounted) return;

        const signature = JSON.stringify({
          open: data.admission_open,
          beds: data.rooms?.map((r: RoomAvailability) => `${r.id}:${r.available_beds}`),
        });

        if (prevDataRef.current && prevDataRef.current !== signature) {
          // Changed!
          setLastUpdatedNotice(true);
          setTimeout(() => {
            if (isMounted) setLastUpdatedNotice(false);
          }, 3500);
        }
        prevDataRef.current = signature;

        setAdmissionOpen(Boolean(data.admission_open));
        if (Array.isArray(data.rooms)) {
          setRooms(data.rooms);
        }
      } catch {
        // Silently retry on next interval
      }
    }

    // Set initial signature
    prevDataRef.current = JSON.stringify({
      open: initialAdmissionOpen,
      beds: initialRooms.map((r) => `${r.id}:${r.available_beds}`),
    });

    const interval = setInterval(checkAvailability, 10000);

    const onFocus = () => checkAvailability();
    window.addEventListener("focus", onFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [initialAdmissionOpen, initialRooms]);

  if (hidden || !visible) return null;

  // Minimized pill
  if (minimized) {
    return (
      <div className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-40 animate-bounce-subtle">
        <button
          type="button"
          onClick={() => setMinimized(false)}
          className="flex items-center gap-2 sm:gap-3 rounded-full bg-ink px-3.5 py-2 sm:px-4 sm:py-2.5 text-white shadow-2xl ring-2 ring-sun/80 backdrop-blur transition-all duration-300 hover:scale-105 hover:bg-black"
          aria-label="Expand availability banner"
        >
          <span className="relative flex size-2.5 sm:size-3">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${admissionOpen && totalAvailable > 0 ? "bg-emerald-400" : "bg-rose-400"}`} />
            <span className={`relative inline-flex size-2.5 sm:size-3 rounded-full ${admissionOpen && totalAvailable > 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
          </span>
          <span className="oswald text-[11px] sm:text-[12px] !tracking-[0.14em] sm:!tracking-[0.16em]">
            {admissionOpen && totalAvailable > 0 ? (
              <>
                <span className="text-sun font-bold">{totalAvailable} Beds</span> Available
              </>
            ) : (
              <span className="text-rose-300">Waitlist Only</span>
            )}
          </span>
          <ChevronUp className="size-3.5 sm:size-4 text-sun" />
        </button>
      </div>
    );
  }

  // Expanded banner
  return (
    <aside
      aria-label="Live Room Availability"
      className="fixed bottom-3 inset-x-3 sm:bottom-6 sm:right-6 sm:inset-x-auto sm:w-[calc(100vw-2rem)] sm:max-w-md z-40 animate-slide-up rounded-2xl border-2 border-sun/60 bg-white p-3.5 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 border-b border-line pb-2 sm:pb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${admissionOpen && totalAvailable > 0 ? "bg-emerald-400" : "bg-rose-400"}`} />
            <span className={`relative inline-flex size-2.5 rounded-full ${admissionOpen && totalAvailable > 0 ? "bg-emerald-500" : "bg-rose-500"}`} />
          </span>
          <span className="oswald text-[10px] sm:text-[11px] !tracking-[0.18em] sm:!tracking-[0.2em] text-ink font-semibold uppercase">
            Live Availability
          </span>
          {lastUpdatedNotice && (
            <span className="inline-flex items-center gap-1 rounded bg-sun/20 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-900 animate-pulse">
              <Sparkles className="size-3" /> Updated
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMinimized(true)}
            aria-label="Minimize banner"
            className="grid size-6 sm:size-7 place-items-center rounded-md text-muted transition hover:bg-sand hover:text-ink"
          >
            <ChevronDown className="size-3.5 sm:size-4" />
          </button>
          <button
            type="button"
            onClick={() => setHidden(true)}
            aria-label="Close banner"
            className="grid size-6 sm:size-7 place-items-center rounded-md text-muted transition hover:bg-rose-50 hover:text-rose-600"
          >
            <X className="size-3.5 sm:size-4" />
          </button>
        </div>
      </div>

      {/* Headline & status */}
      <div className="mt-2.5 sm:mt-3.5">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className="display text-[1.2rem] sm:text-[1.45rem] leading-tight text-ink">
            {admissionOpen ? "Admissions Open" : "Currently Full"}
          </h4>
          <span className="oswald text-[11.5px] sm:text-[13px] font-bold tracking-wider text-brand">
            {totalAvailable} / {totalBeds} Beds Free
          </span>
        </div>
        <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-muted leading-snug sm:leading-normal line-clamp-2 sm:line-clamp-none">
          {admissionOpen && totalAvailable > 0
            ? "Seats filling fast for the upcoming academic session. Lock your room before admissions close."
            : "All standard beds are currently occupied. Contact warden to join the priority waiting list."}
        </p>
      </div>

      {/* Room breakdown cards */}
      <div className="mt-2.5 sm:mt-3.5 grid grid-cols-2 gap-1.5 sm:gap-2 max-h-36 sm:max-h-48 overflow-y-auto pr-0.5">
        {rooms.map((room) => {
          const isUrgent = room.available_beds > 0 && room.available_beds <= 2;
          const isFull = room.available_beds === 0;

          return (
            <div
              key={room.id}
              className={`flex flex-col justify-between rounded-lg sm:rounded-xl border p-2 sm:p-2.5 transition-colors ${
                isFull
                  ? "border-line bg-sand/40 opacity-70"
                  : isUrgent
                  ? "border-amber-300 bg-amber-50/60"
                  : "border-line bg-white hover:border-sun"
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <span className="font-semibold text-[11px] sm:text-xs text-ink truncate" title={room.name}>
                  {room.name}
                </span>
                <BedDouble className="size-3 sm:size-3.5 shrink-0 text-muted" />
              </div>

              <div className="mt-1.5 sm:mt-2 flex items-baseline justify-between gap-1">
                <span className="oswald text-[10px] sm:text-[11px] text-muted">
                  {formatRs(room.monthly_fee)}/m
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded px-1 sm:px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold ${
                    isFull
                      ? "bg-stone-200 text-stone-700"
                      : isUrgent
                      ? "bg-rose-100 text-rose-700 font-extrabold"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {isFull ? "Full" : isUrgent ? `⚡ ${room.available_beds} left` : `${room.available_beds} free`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="mt-3 sm:mt-4 flex items-center gap-2">
        <Link
          href="/contact#enquiry"
          className="tbtn tbtn-brand flex-1 justify-center py-2 sm:py-2.5 text-[10.5px] sm:text-[11px] !tracking-[0.14em] sm:!tracking-[0.16em] rounded-lg sm:rounded-none"
        >
          Book / Enquire
        </Link>

        {whatsapp && (
          <a
            href={whatsappHref(whatsapp, "Hello, I want to inquire about current bed availability at The Purple Nest.")}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-line bg-emerald-50 px-2.5 py-2 sm:px-3 sm:py-2.5 text-[11px] sm:text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
            title="Chat with Warden on WhatsApp"
          >
            <MessageCircle className="size-3.5 sm:size-4 text-emerald-600" />
            <span className="hidden xs:inline sm:inline">WhatsApp</span>
          </a>
        )}
      </div>
    </aside>
  );
}
