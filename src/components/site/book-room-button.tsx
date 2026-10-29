"use client";

import { selectRoom } from "./room-events";

export function BookRoomButton({ roomId, full }: { roomId: string; full: boolean }) {
  return (
    <button type="button" onClick={() => selectRoom({ roomId })} className={`tbtn ${full ? "tbtn-sun" : "tbtn-dark"} px-9 py-5`}>
      {full ? "Waiting list" : "Book now"}
    </button>
  );
}
