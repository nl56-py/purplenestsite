"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, AlertCircle, BedDouble, Calendar, Users, MessageCircle, Phone, Sparkles, ArrowRight } from "lucide-react";
import type { Room } from "@/lib/types";
import { formatRs, telHref, whatsappHref } from "@/lib/format";
import { adToBs, formatDualDate } from "@/lib/nepali-date";
import { selectRoom } from "./room-events";

interface CheckAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRoomId: string;
  moveInDate: string;
  persons: string;
  rooms: Room[];
  whatsapp?: string | null;
  phone?: string | null;
}

export function CheckAvailabilityModal({
  isOpen,
  onClose,
  selectedRoomId,
  moveInDate,
  persons,
  rooms: initialRooms,
  whatsapp,
  phone,
}: CheckAvailabilityModalProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [loading, setLoading] = useState(true);

  // Sync / verify live data from /api/availability whenever opened
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    fetch("/api/availability", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (data?.ok && Array.isArray(data.rooms)) {
          setRooms((prev) =>
            prev.map((r) => {
              const live = data.rooms.find((lr: { id: string }) => lr.id === r.id);
              return live ? { ...r, available_beds: live.available_beds, total_beds: live.total_beds } : r;
            })
          );
        }
      })
      .catch(() => {})
      .finally(() => {
        setTimeout(() => setLoading(false), 200);
      });
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);
  const availableRooms = rooms.filter((r) => r.available_beds > 0);
  const totalAvailableBeds = rooms.reduce((s, r) => s + (r.available_beds || 0), 0);

  function handleBook(targetRoomId: string) {
    onClose();
    selectRoom({
      roomId: targetRoomId,
      moveIn: moveInDate,
      persons: persons || "1",
    });
  }

  const requestedPersons = persons ? `${persons} ${persons === "1" ? "Person" : "Persons"}` : "1 Person";
  const bsInfo = adToBs(moveInDate);
  const formattedDate = moveInDate
    ? bsInfo
      ? `${bsInfo.formattedBsEn} BS (${new Date(moveInDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })})`
      : new Date(moveInDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Immediate / Flexible (तत्काल)";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="availability-modal-title"
    >
      <div
        className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-line bg-sand/40 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="oswald text-[11px] !tracking-[0.2em] uppercase text-ink font-semibold">
              Live Availability Verification
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="grid size-8 place-items-center rounded-full text-muted transition hover:bg-white hover:text-ink"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="size-10 animate-spin rounded-full border-4 border-brand border-t-transparent" />
              <p className="oswald mt-4 text-sm !tracking-[0.16em] uppercase text-muted">
                Checking live room database...
              </p>
            </div>
          ) : selectedRoom ? (
            /* A SPECIFIC ROOM WAS SELECTED */
            <div>
              {/* Status Header */}
              {selectedRoom.available_beds > 0 ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="size-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 id="availability-modal-title" className="oswald text-lg font-bold text-emerald-950">
                        Bed Available for Your Move-In!
                      </h3>
                      <p className="mt-1 text-xs text-emerald-800 font-serif leading-relaxed">
                        Great news! We have confirmed open vacancy in <strong className="font-sans font-bold">{selectedRoom.name}</strong> for {formattedDate}.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="size-6 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h3 id="availability-modal-title" className="oswald text-lg font-bold text-rose-950">
                        {selectedRoom.name} is Currently Fully Booked
                      </h3>
                      <p className="mt-1 text-xs text-rose-800 font-serif leading-relaxed">
                        All beds in this room type are occupied right now. You can join the waiting list or choose one of our other available rooms below.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Selected Room Card Details */}
              <div className="mt-6 rounded-2xl border border-line bg-sand/20 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="display text-2xl text-ink">{selectedRoom.name}</h4>
                    <p className="text-xs text-muted mt-0.5">
    {selectedRoom.beds_per_room} Person Seater Room
    {selectedRoom.block_name ? ` · ${selectedRoom.block_name}${selectedRoom.floor_name ? ` (${selectedRoom.floor_name})` : ""}` : ""}
  </p>
                  </div>
                  <div className="text-right">
                    <span className="display text-2xl text-brand">{formatRs(selectedRoom.monthly_fee)}</span>
                    <span className="text-xs text-muted block">/ month (all meals incl.)</span>
                  </div>
                </div>

                {/* Info Pills */}
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line/60 pt-4 text-center">
                  <div className="rounded-xl bg-white p-2.5 border border-line/60">
                    <span className="oswald text-[10px] uppercase text-muted block">Free Beds</span>
                    <span className={`oswald text-base font-bold ${selectedRoom.available_beds > 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {selectedRoom.available_beds} / {selectedRoom.total_beds}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white p-2.5 border border-line/60">
                    <span className="oswald text-[10px] uppercase text-muted block">Move-in Date</span>
                    <span className="oswald text-xs font-semibold text-ink truncate block mt-0.5">
                      {formattedDate}
                    </span>
                  </div>
                  <div className="rounded-xl bg-white p-2.5 border border-line/60">
                    <span className="oswald text-[10px] uppercase text-muted block">Group Size</span>
                    <span className="oswald text-xs font-semibold text-ink block mt-0.5">
                      {requestedPersons}
                    </span>
                  </div>
                </div>
              </div>

              {/* Included Amenities Checklist */}
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted font-serif">
                <span>✓ 4 Fresh Meals Daily</span>
                <span>✓ High-Speed Wi-Fi</span>
                <span>✓ 24/7 Solar Hot Water</span>
                <span>✓ Electricity & Inverter Backup</span>
              </div>

              {/* Primary Actions */}
              <div className="mt-6 space-y-3">
                {selectedRoom.available_beds > 0 ? (
                  <button
                    type="button"
                    onClick={() => handleBook(selectedRoom.id)}
                    className="tbtn tbtn-brand w-full justify-center py-4 text-sm !tracking-[0.16em] shadow-lg"
                  >
                    Proceed to Reserve This Bed <ArrowRight className="size-4 ml-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleBook(selectedRoom.id)}
                    className="tbtn tbtn-dark w-full justify-center py-4 text-sm !tracking-[0.16em]"
                  >
                    Join Priority Waiting List for {selectedRoom.name}
                  </button>
                )}

                {/* Secondary Actions (WhatsApp & Call) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {whatsapp && (
                    <a
                      href={whatsappHref(
                        whatsapp,
                        `Hello! I just checked availability on your website for ${selectedRoom.name} (${selectedRoom.available_beds > 0 ? "Beds Available" : "Full"}). Move-in date: ${formattedDate}, Persons: ${persons || 1}. Can you provide booking assistance?`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 py-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
                    >
                      <MessageCircle className="size-4 text-emerald-600" />
                      <span>WhatsApp Warden</span>
                    </a>
                  )}

                  {phone && (
                    <a
                      href={telHref(phone)}
                      className="flex items-center justify-center gap-2 rounded-xl border border-line bg-sand/30 py-3 text-xs font-semibold text-ink transition hover:bg-sand"
                    >
                      <Phone className="size-4 text-sun-dark" />
                      <span>Call {phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Alternative Available Rooms (if selected room is full or low) */}
              {selectedRoom.available_beds === 0 && availableRooms.length > 0 && (
                <div className="mt-8 border-t border-line pt-6">
                  <p className="oswald text-[11px] !tracking-[0.18em] uppercase text-muted font-bold">
                    Other Rooms Available Right Now:
                  </p>
                  <div className="mt-3 space-y-2">
                    {availableRooms.map((alt) => (
                      <div
                        key={alt.id}
                        className="flex items-center justify-between rounded-xl border border-line bg-white p-3 transition hover:border-brand"
                      >
                        <div>
                          <p className="oswald text-sm font-semibold text-ink">
    {alt.name}
    {alt.block_name ? <span className="ml-1 text-xs text-brand font-medium">({alt.block_name})</span> : null}
  </p>
                          <p className="text-xs text-emerald-700 font-medium">
                            {alt.available_beds} beds free • {formatRs(alt.monthly_fee)}/mo
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleBook(alt.id)}
                          className="tbtn tbtn-brand py-2 px-4 text-xs !tracking-[0.14em]"
                        >
                          Book this instead
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* NO SPECIFIC ROOM WAS SELECTED - SHOW COMPLETE BREAKDOWN */
            <div>
              <div className="text-center">
                <h3 id="availability-modal-title" className="display text-2xl text-ink">
                  Current Room Availability
                </h3>
                <p className="mt-1 text-xs text-muted font-serif">
                  {totalAvailableBeds} beds currently available for the upcoming academic session.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                {rooms.map((room) => {
                  const isAvailable = room.available_beds > 0;
                  return (
                    <div
                      key={room.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                        isAvailable ? "border-line bg-white hover:border-brand" : "border-line/60 bg-sand/30 opacity-70"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`grid size-10 place-items-center rounded-xl ${isAvailable ? "bg-brand/10 text-brand" : "bg-stone-200 text-stone-500"}`}>
                          <BedDouble className="size-5" />
                        </div>
                        <div>
                          <h4 className="oswald text-base font-semibold text-ink">{room.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-brand">{formatRs(room.monthly_fee)}/mo</span>
                            <span className="text-xs text-muted">•</span>
                            <span className={`text-xs font-semibold ${isAvailable ? "text-emerald-700" : "text-rose-700"}`}>
                              {isAvailable ? `${room.available_beds} beds free` : "Full"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBook(room.id)}
                        className={`tbtn w-full sm:w-auto py-2.5 px-6 text-xs !tracking-[0.14em] ${
                          isAvailable ? "tbtn-brand" : "tbtn-dark"
                        }`}
                      >
                        {isAvailable ? "Book Bed" : "Waitlist"}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-line pt-4 text-center">
                <p className="text-xs text-muted">
                  Questions? Call the hostel warden directly at{" "}
                  <a href={telHref(phone || "")} className="font-semibold text-brand hover:underline">
                    {phone || "+977 9801234567"}
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
