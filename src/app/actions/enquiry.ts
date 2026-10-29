"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type EnquiryState = { ok: boolean; message: string } | null;

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  // Honeypot: real people never see or fill this field.
  if (clean(form.get("website"), 200)) return { ok: true, message: "Thank you! We will contact you soon." };
  if (!isSupabaseConfigured) return { ok: false, message: "The website is not connected to a database yet." };

  const name = clean(form.get("name"), 100);
  const phone = clean(form.get("phone"), 20);
  const email = clean(form.get("email"), 150);
  const roomId = clean(form.get("room_id"), 36);
  const roomName = clean(form.get("room_name"), 100);
  const moveIn = clean(form.get("move_in_date"), 10);
  const message = clean(form.get("message"), 1500);

  if (name.length < 2) return { ok: false, message: "Please enter your name." };
  if (!/^[+\d][\d\s-]{6,19}$/.test(phone)) return { ok: false, message: "Please enter a valid phone number." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: "Please enter a valid email or leave it blank." };
  if (moveIn && !/^\d{4}-\d{2}-\d{2}$/.test(moveIn)) return { ok: false, message: "Please pick a valid move-in date." };

  const { error } = await createPublicClient()
    .from("enquiries")
    .insert({
      name,
      phone,
      email: email || null,
      room_id: /^[0-9a-f-]{36}$/i.test(roomId) ? roomId : null,
      room_name: roomName || null,
      move_in_date: moveIn || null,
      message: message || null,
    });

  if (error) {
    console.error("[enquiry]", error.message);
    return { ok: false, message: "Sorry, something went wrong. Please call us instead." };
  }
  return { ok: true, message: `Thank you, ${name.split(" ")[0]}! We received your enquiry and will call you soon.` };
}
