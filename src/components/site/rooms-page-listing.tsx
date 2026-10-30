"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BedDouble, Check, Users, Building2, Sparkles, AlertCircle } from "lucide-react";
import type { Block, Room, SiteSettings } from "@/lib/types";
import { formatRs, availabilityLabel } from "@/lib/format";
import { BookRoomButton } from "./book-room-button";

export function RoomsPageListing({
  rooms,
  blocks = [],
  settings,
}: {
  rooms: Room[];
  blocks?: Block[];
  settings: SiteSettings;
}) {
  const [selectedBlock, setSelectedBlock] = useState<string>("all");
  const [selectedFloor, setSelectedFloor] = useState<string>("all");

  // Distinct blocks
  const blockOptions = useMemo(() => {
    const list: { id: string; name: string; free: number; total: number; desc: string }[] = [];
    const names = new Set<string>();

    for (const b of blocks) {
      if (b.name) names.add(b.name);
    }
    for (const r of rooms) {
      if (r.block_name) names.add(r.block_name);
    }

    if (names.size === 0) {
      names.add("Block A");
      names.add("Block B");
      names.add("Block C");
    }

    for (const name of names) {
      const bRooms = rooms.filter((r) => (r.block_name || "").toLowerCase() === name.toLowerCase());
      const free = bRooms.reduce((s, r) => s + (r.available_beds || 0), 0);
      const total = bRooms.reduce((s, r) => s + (r.total_beds || 0), 0);
      const bDef = blocks.find((b) => b.name.toLowerCase() === name.toLowerCase());
      list.push({ id: name, name, free, total, desc: bDef?.description || "" });
    }

    return list;
  }, [blocks, rooms]);

  // Distinct floors for selected block
  const floorOptions = useMemo(() => {
    const floors = new Set<string>();
    const sourceRooms = selectedBlock === "all"
      ? rooms
      : rooms.filter((r) => (r.block_name || "").toLowerCase() === selectedBlock.toLowerCase());

    for (const r of sourceRooms) {
      if (r.floor_name) floors.add(r.floor_name);
    }
    return Array.from(floors);
  }, [rooms, selectedBlock]);

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchBlock = selectedBlock === "all" || (r.block_name || "").toLowerCase() === selectedBlock.toLowerCase();
      const matchFloor = selectedFloor === "all" || (r.floor_name || "").toLowerCase() === selectedFloor.toLowerCase();
      return matchBlock && matchFloor;
    });
  }, [rooms, selectedBlock, selectedFloor]);

  const totalAllFree = useMemo(() => rooms.reduce((s, r) => s + (r.available_beds || 0), 0), [rooms]);
  const totalAllBeds = useMemo(() => rooms.reduce((s, r) => s + (r.total_beds || 0), 0), [rooms]);

  return (
    <div>
      {/* 3 Blocks Campus Summary */}
      <div className="mb-8 rounded-2xl border border-line bg-sand/30 p-5 sm:p-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand mb-2">
          <Building2 className="size-3.5" />
          <span>3 Dedicated Blocks (Block A, Block B & Block C)</span>
        </div>
        <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted leading-relaxed">
          Rooms are organized across our 3 residential blocks at Sinpa Marg, Gwarko, Lalitpur, all sharing the same safe, high-standard student living environment and full amenities.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-sand/20 p-4">
        {/* Block Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="oswald text-xs font-bold uppercase tracking-wider text-muted mr-1">Filter Block:</span>
          <button
            type="button"
            onClick={() => {
              setSelectedBlock("all");
              setSelectedFloor("all");
            }}
            className={`oswald rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
              selectedBlock === "all" ? "bg-brand text-white" : "border border-line bg-white hover:bg-sand"
            }`}
          >
            All Blocks ({totalAllFree} free)
          </button>
          {blockOptions.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setSelectedBlock(b.name);
                setSelectedFloor("all");
              }}
              className={`oswald rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                selectedBlock === b.name ? "bg-brand text-white" : "border border-line bg-white hover:bg-sand"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        {/* Floor selector if available */}
        {floorOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="oswald text-xs font-bold uppercase tracking-wider text-muted mr-1">Floor:</span>
            <button
              type="button"
              onClick={() => setSelectedFloor("all")}
              className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                selectedFloor === "all" ? "bg-ink text-white" : "border border-line bg-white text-muted hover:text-ink"
              }`}
            >
              All Floors
            </button>
            {floorOptions.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedFloor(f)}
                className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                  selectedFloor === f ? "bg-ink text-white" : "border border-line bg-white text-muted hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Room Listing Grid */}
      {filteredRooms.length === 0 ? (
        <div className="my-16 rounded-3xl border border-line bg-sand/30 p-12 text-center">
          <AlertCircle className="mx-auto size-12 text-muted" />
          <p className="mt-3 text-lg font-bold text-ink">No rooms match your filter.</p>
          <p className="text-xs text-muted mt-1">Try resetting the Block or Floor filter to view all rooms.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedBlock("all");
              setSelectedFloor("all");
            }}
            className="oswald mt-4 rounded-full bg-brand px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-2">
          {filteredRooms.map((room) => {
            const status = availabilityLabel(room.available_beds, room.total_beds);
            const toneClasses = {
              ok: "bg-emerald-100 text-emerald-800 border-emerald-200",
              low: "bg-rose-100 text-rose-700 border-rose-200 font-bold",
              full: "bg-stone-200 text-stone-700 border-stone-300",
            }[status.tone];

            const photo = room.images?.[0] || "/images/hero-room.jpg";
            const blockLabel = room.block_name || "Block A";
            const floorLabel = room.floor_name;
            const roomNumber = room.room_number;

            return (
              <article
                key={room.id}
                className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-brand/40"
              >
                {/* Photo area */}
                <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo}
                    alt={room.name}
                    className="size-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Bed capacity badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                    <Users className="size-3.5 text-sun" />
                    <span>{room.beds_per_room} {room.beds_per_room === 1 ? "Person" : "Seater"}</span>
                  </div>

                  {/* Block & Floor Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span className="rounded-full bg-black/75 backdrop-blur px-3 py-1.5 text-xs font-bold text-white border border-white/20">
                      {blockLabel}{floorLabel ? ` · ${floorLabel}` : ""}
                    </span>
                    <div className={`rounded-full border px-3 py-1.5 text-xs backdrop-blur ${toneClasses}`}>
                      {status.text}
                    </div>
                  </div>

                  {/* Fee banner over photo */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
                    <div className="flex items-baseline justify-between">
                      <span className="oswald text-[12px] !tracking-[0.18em] uppercase text-sun">All Inclusive Fee</span>
                      <div className="text-right">
                        <span className="display text-2xl text-white">{formatRs(room.monthly_fee)}</span>
                        <span className="text-xs text-white/80"> / month</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Room details */}
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <h2 className="oswald text-[24px] font-medium text-ink transition group-hover:text-brand">
                        {room.name}
                      </h2>
                      {roomNumber && (
                        <span className="rounded bg-sand border border-line px-2 py-0.5 text-xs font-bold text-muted">
                          Rm {roomNumber}
                        </span>
                      )}
                    </div>
                    {room.admission_fee ? (
                      <span className="text-xs text-muted">
                        Admission: {formatRs(room.admission_fee)}
                      </span>
                    ) : null}
                  </div>

                  {room.description && (
                    <p className="mt-3 text-sm text-muted leading-relaxed font-serif">
                      {room.description}
                    </p>
                  )}

                  {/* Features list */}
                  {room.features && room.features.length > 0 && (
                    <div className="mt-6 border-t border-line/60 pt-5">
                      <p className="oswald text-[11px] !tracking-[0.18em] uppercase text-muted font-semibold">
                        Room Amenities
                      </p>
                      <div className="mt-3 grid grid-cols-2 gap-2.5">
                        {room.features.map((feat, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-ink/85">
                            <Check className="size-3.5 text-leaf shrink-0" />
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Room gallery thumbnails if multiple photos */}
                  {room.images && room.images.length > 1 && (
                    <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                      {room.images.map((img, idx) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          key={idx}
                          src={img}
                          alt=""
                          className="size-16 rounded-xl object-cover border border-line shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="mt-auto pt-8 flex items-center justify-between gap-4">
                    <div className="text-xs text-muted">
                      <span className="font-semibold text-ink">{room.available_beds}</span> of {room.total_beds} beds free
                    </div>
                    <BookRoomButton roomId={room.id} full={status.tone === "full"} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
