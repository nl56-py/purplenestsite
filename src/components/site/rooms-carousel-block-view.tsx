"use client";

import { useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import type { Block, Room, SiteSettings } from "@/lib/types";
import { availabilityLabel, formatRs } from "@/lib/format";
import { BookRoomButton } from "./book-room-button";
import { Carousel } from "./carousel";

export function RoomsCarouselBlockView({
  rooms,
  blocks = [],
  settings,
}: {
  rooms: Room[];
  blocks?: Block[];
  settings: SiteSettings;
}) {
  const [selectedBlock, setSelectedBlock] = useState<string>("all");

  // Determine unique blocks from blocks prop or rooms
  const blockOptions = useMemo(() => {
    const list: { id: string; name: string; free: number; total: number }[] = [];

    // Distinct block names
    const names = new Set<string>();
    for (const b of blocks) {
      if (b.name) names.add(b.name);
    }
    for (const r of rooms) {
      if (r.block_name) names.add(r.block_name);
    }

    // Default to Block A, B, C if none
    if (names.size === 0) {
      names.add("Block A");
      names.add("Block B");
      names.add("Block C");
    }

    for (const name of names) {
      const bRooms = rooms.filter((r) => (r.block_name || "").toLowerCase() === name.toLowerCase());
      const free = bRooms.reduce((s, r) => s + (r.available_beds || 0), 0);
      const total = bRooms.reduce((s, r) => s + (r.total_beds || 0), 0);
      list.push({ id: name, name, free, total });
    }

    return list;
  }, [blocks, rooms]);

  const filteredRooms = useMemo(() => {
    if (selectedBlock === "all") return rooms;
    return rooms.filter((r) => (r.block_name || "").toLowerCase() === selectedBlock.toLowerCase());
  }, [rooms, selectedBlock]);

  const totalAllFree = useMemo(() => rooms.reduce((s, r) => s + (r.available_beds || 0), 0), [rooms]);

  return (
    <div className="mt-8">
      {/* Block Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-6">
        <button
          type="button"
          onClick={() => setSelectedBlock("all")}
          className={`oswald flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
            selectedBlock === "all"
              ? "bg-brand text-white shadow-md shadow-brand/20 ring-2 ring-brand/30"
              : "border border-line bg-white text-ink hover:border-brand/40 hover:bg-sand/30"
          }`}
        >
          <span>All Blocks</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              selectedBlock === "all" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
            }`}
          >
            {totalAllFree} free
          </span>
        </button>

        {blockOptions.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setSelectedBlock(b.name)}
            className={`oswald flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition ${
              selectedBlock === b.name
                ? "bg-brand text-white shadow-md shadow-brand/20 ring-2 ring-brand/30"
                : "border border-line bg-white text-ink hover:border-brand/40 hover:bg-sand/30"
            }`}
          >
            <Building2 className="size-3.5 opacity-80" />
            <span>{b.name}</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] ${
                selectedBlock === b.name ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800 font-bold"
              }`}
            >
              {b.free} free
            </span>
          </button>
        ))}
      </div>

      {filteredRooms.length === 0 ? (
        <div className="my-12 rounded-2xl border border-line bg-sand/30 p-8 text-center">
          <p className="text-muted">No rooms currently listed under {selectedBlock}.</p>
          <button
            type="button"
            onClick={() => setSelectedBlock("all")}
            className="oswald mt-3 text-xs font-bold text-brand uppercase underline"
          >
            View all available rooms
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <Carousel label="Rooms" itemClass="w-full sm:w-1/2 lg:w-1/3">
            {filteredRooms.map((room) => {
              const status = availabilityLabel(room.available_beds, room.total_beds);
              const blockLabel = room.block_name || "Block A";
              const floorLabel = room.floor_name;
              const roomNumber = room.room_number;

              return (
                <article key={room.id} className="group flex h-full flex-col bg-cream rounded-xl overflow-hidden border border-line/60 shadow-xs">
                  <div className="img-fallback relative aspect-[4/3] overflow-hidden">
                    {room.images?.[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={room.images[0]}
                        alt={room.name}
                        loading="lazy"
                        className="size-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    )}
                    {room.description && (
                      <div className="absolute inset-0 flex items-center justify-center bg-ink/75 p-8 text-center text-[14px] leading-relaxed text-white opacity-0 transition duration-500 group-hover:opacity-100">
                        <span className="absolute size-40 rounded-full bg-brand/25" aria-hidden />
                        <span className="relative">{room.description}</span>
                      </div>
                    )}

                    {/* Bed status badge */}
                    <span
                      className={`oswald absolute left-0 top-5 px-4 py-2 text-[11px] !tracking-[0.15em] font-semibold ${
                        status.tone === "full"
                          ? "bg-ink text-white"
                          : status.tone === "low"
                          ? "bg-sun text-ink"
                          : "bg-leaf text-white"
                      }`}
                    >
                      {status.text}
                    </span>

                    {/* Block & Floor Badge */}
                    <span className="oswald absolute right-3 top-5 rounded-md bg-ink/80 backdrop-blur-xs px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-white">
                      {blockLabel}
                      {floorLabel ? ` · ${floorLabel}` : ""}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col items-center px-6 pb-9 pt-7 text-center">
                    <div className="flex items-center gap-2">
                      <h3 className="oswald text-[20px] font-medium leading-snug text-ink">{room.name}</h3>
                      {roomNumber && (
                        <span className="rounded bg-sand border border-line px-1.5 py-0.5 text-[10px] font-bold text-muted">
                          Rm {roomNumber}
                        </span>
                      )}
                    </div>

                    <p className="oswald mt-1 text-[11px] font-medium !tracking-[0.2em] text-muted">
                      {room.beds_per_room} {room.beds_per_room === 1 ? "bed" : "beds"} per room · {room.total_beds} beds total
                    </p>

                    <div className="mt-5 flex items-center gap-3">
                      <span className="text-right text-[13px] leading-tight text-muted">
                        Per month
                        <br />
                        from
                      </span>
                      <span className="oswald text-[34px] font-medium normal-case !tracking-normal text-brand">
                        {formatRs(room.monthly_fee)}
                      </span>
                    </div>

                    {room.features && room.features.length > 0 && (
                      <ul className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[13px]">
                        {room.features.slice(0, 4).map((f) => (
                          <li key={f} className="before:mr-1.5 before:text-brand before:content-['•']">
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-auto pt-7 w-full">
                      <BookRoomButton roomId={room.id} full={status.tone === "full"} />
                    </div>
                  </div>
                </article>
              );
            })}
          </Carousel>
        </div>
      )}
    </div>
  );
}
