"use client";

export const SELECT_ROOM_EVENT = "hostel:select-room";

export type SelectRoomDetail = { roomId?: string; moveIn?: string; persons?: string };

/** Pre-fills the enquiry form and scrolls to it, or redirects to /contact if not on page. */
export function selectRoom(detail: SelectRoomDetail) {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent<SelectRoomDetail>(SELECT_ROOM_EVENT, { detail }));

  const el = document.getElementById("enquiry");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    el.classList.add("ring-4", "ring-[var(--brand,#fd7444)]", "ring-offset-4", "transition-all", "duration-500");
    setTimeout(() => {
      el.classList.remove("ring-4", "ring-[var(--brand,#fd7444)]", "ring-offset-4");
    }, 3000);
    // Focus the name input
    const input = el.querySelector("input[name='name']") as HTMLInputElement | null;
    if (input) {
      setTimeout(() => input.focus({ preventScroll: true }), 600);
    }
  } else {
    // Navigate to /contact with parameters
    const params = new URLSearchParams();
    if (detail.roomId) params.set("room", detail.roomId);
    if (detail.moveIn) params.set("moveIn", detail.moveIn);
    if (detail.persons) params.set("persons", detail.persons);
    window.location.href = `/contact?${params.toString()}#enquiry`;
  }
}
