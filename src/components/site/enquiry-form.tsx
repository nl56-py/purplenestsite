"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Room } from "@/lib/types";
import { submitEnquiry, type EnquiryState } from "@/app/actions/enquiry";
import { SELECT_ROOM_EVENT, type SelectRoomDetail } from "./room-events";
import { NepaliDatePicker } from "./nepali-date-picker";

export function EnquiryForm({ rooms }: { rooms: Room[] }) {
  const [state, run, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, null);
  const [roomId, setRoomId] = useState("");
  const [moveIn, setMoveIn] = useState("");
  const [message, setMessage] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check URL parameters on mount
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const r = sp.get("room");
      const m = sp.get("moveIn");
      const p = sp.get("persons");
      if (r) setRoomId(r);
      if (m) setMoveIn(m);
      if (p) setMessage((prev) => (prev.includes("person") ? prev : `We are ${p} ${p === "1" ? "person" : "persons"}. ${prev}`.trim()));
    }

    const onSelect = (e: Event) => {
      const d = (e as CustomEvent<SelectRoomDetail>).detail;
      if (d.roomId !== undefined) setRoomId(d.roomId);
      if (d.moveIn) setMoveIn(d.moveIn);
      if (d.persons) setMessage((m) => (m.includes("persons") ? m : `We are ${d.persons} ${d.persons === "1" ? "person" : "persons"}. ${m}`.trim()));
      setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 700);
    };
    window.addEventListener(SELECT_ROOM_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_ROOM_EVENT, onSelect);
  }, []);

  if (state?.ok) {
    return (
      <div className="mt-8 flex flex-col items-center bg-white px-6 py-12 text-center" role="status">
        <CheckCircle2 className="size-14 text-leaf" />
        <p className="oswald mt-5 text-[16px] font-medium text-ink">{state.message}</p>
      </div>
    );
  }

  const selected = rooms.find((r) => r.id === roomId);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => run(data));
      }}
      className="mt-8 grid gap-3 sm:grid-cols-2"
    >
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <input type="hidden" name="room_name" value={selected?.name ?? ""} />
      <label className="block">
        <span className="sr-only">Full name</span>
        <input ref={nameRef} name="name" required minLength={2} maxLength={100} className="tfield" placeholder="Full name *" autoComplete="name" />
      </label>
      <label className="block">
        <span className="sr-only">Phone</span>
        <input name="phone" required type="tel" inputMode="tel" maxLength={20} className="tfield" placeholder="Phone *" autoComplete="tel" />
      </label>
      <label className="block">
        <span className="sr-only">Email</span>
        <input name="email" type="email" maxLength={150} className="tfield" placeholder="Email" autoComplete="email" />
      </label>
      <div className="block">
        <label className="sr-only" htmlFor="ef-move-in">Move-in date</label>
        <input type="hidden" name="move_in_date" value={moveIn} />
        <NepaliDatePicker
          id="ef-move-in"
          value={moveIn}
          onChange={setMoveIn}
          placeholder="Move-in date (नेपाली / AD)"
        />
      </div>
      <label className="block sm:col-span-2">
        <span className="sr-only">Room type</span>
        <select name="room_id" className="tfield" value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="">Room type — not sure yet</option>
          {rooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
              {r.available_beds === 0 ? " (full — waiting list)" : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="sr-only">Message</span>
        <textarea name="message" rows={4} maxLength={1500} className="tfield" placeholder="Your college, questions, preferred visit time…" value={message} onChange={(e) => setMessage(e.target.value)} />
      </label>
      {state && !state.ok && (
        <p className="bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 sm:col-span-2" role="alert">
          {state.message}
        </p>
      )}
      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className="tbtn tbtn-dark w-full sm:w-auto sm:px-16">
          {pending ? "Sending…" : "Send enquiry"}
        </button>
      </div>
    </form>
  );
}
