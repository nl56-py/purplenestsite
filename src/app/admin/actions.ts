"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { clearAdminSessionCache, friendlyDbError, refreshSite, removeMedia, requireAdmin } from "@/lib/admin";
import { getResource, type Field } from "@/lib/resources";
import { fromKtmInput } from "@/lib/format";
import type { HeroSlide } from "@/lib/types";

export type FormState = { ok: boolean; message: string } | null;

const UUID = /^[0-9a-f-]{36}$/i;
const str = (v: FormDataEntryValue | null) => (typeof v === "string" ? v.trim() : "");

/* ------------------------------------------------------------------ auth */

export async function login(_prev: FormState, form: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) {
    return {
      ok: false,
      message: "Supabase API key missing: Please add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local (found in Supabase Dashboard -> Project Settings -> API).",
    };
  }

  const supabase = await createClient();
  const email = str(form.get("email"));
  const password = String(form.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("[admin login error]:", error.message);
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      return { ok: false, message: "Invalid email or password. Please verify the credentials." };
    }
    return { ok: false, message: error.message };
  }

  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) {
    await supabase.auth.signOut();
    return { ok: false, message: "This account is authenticated, but is not listed in admin_users." };
  }
  redirect("/admin");
}

export async function logout() {
  clearAdminSessionCache();
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changePassword(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const password = String(form.get("password") ?? "");
  if (password.length < 8) return { ok: false, message: "Use at least 8 characters." };
  if (password !== String(form.get("confirm") ?? "")) return { ok: false, message: "The two passwords don't match." };
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, message: error.message };
  return { ok: true, message: "Password changed." };
}

/* ------------------------------------------------- generic content types */

function parseField(f: Field, form: FormData): { value?: unknown; error?: string } {
  const raw = form.get(f.name);
  switch (f.type) {
    case "checkbox":
      return { value: raw === "on" };
    case "number": {
      const s = str(raw);
      if (!s) return f.required ? { error: `${f.label} is required.` } : { value: f.nullable ? null : 0 };
      const n = Number(s);
      if (!Number.isInteger(n)) return { error: `${f.label} must be a whole number.` };
      if (f.min !== undefined && n < f.min) return { error: `${f.label} must be at least ${f.min}.` };
      if (f.max !== undefined && n > f.max) return { error: `${f.label} must be at most ${f.max}.` };
      return { value: n };
    }
    case "tags":
      return { value: str(raw).split("\n").map((t) => t.trim()).filter(Boolean).slice(0, 20) };
    case "images": {
      try {
        const arr = JSON.parse(str(raw) || "[]");
        return { value: Array.isArray(arr) ? arr.filter((u) => typeof u === "string").slice(0, 12) : [] };
      } catch {
        return { value: [] };
      }
    }
    case "datetime": {
      const s = str(raw);
      if (!s) return f.required ? { error: `${f.label} is required.` } : { value: null };
      const iso = fromKtmInput(s);
      return iso ? { value: iso } : { error: `${f.label} is not a valid date.` };
    }
    case "select":
    case "icon": {
      const s = str(raw);
      return f.options?.includes(s) ? { value: s } : { value: f.default ?? f.options?.[0] };
    }
    case "image": {
      const s = str(raw);
      return { value: s || null };
    }
    default: {
      const s = str(raw).slice(0, f.maxLength ?? 5000);
      if (f.required && !s) return { error: `${f.label} is required.` };
      return { value: s || (f.nullable ? null : "") };
    }
  }
}

function mediaUrls(fields: Field[], row: Record<string, unknown> | null | undefined) {
  if (!row) return [] as string[];
  return fields.flatMap((f) =>
    f.type === "image" ? [row[f.name] as string] : f.type === "images" ? ((row[f.name] as string[]) ?? []) : [],
  );
}

export async function saveResource(key: string, id: string | null, _prev: FormState, form: FormData): Promise<FormState> {
  const res = getResource(key);
  if (!res) return { ok: false, message: "Unknown content type." };
  if (id && !UUID.test(id)) return { ok: false, message: "Invalid item." };
  const { supabase } = await requireAdmin();

  const row: Record<string, unknown> = {};
  for (const f of res.fields) {
    const { value, error } = parseField(f, form);
    if (error) return { ok: false, message: error };
    row[f.name] = value;
  }
  const invalid = res.validate?.(row);
  if (invalid) return { ok: false, message: invalid };

  if (id) {
    const { data: before } = await supabase.from(res.table).select("*").eq("id", id).maybeSingle();
    if (res.table === "rooms") row.updated_at = new Date().toISOString();
    const { error } = await supabase.from(res.table).update(row).eq("id", id);
    if (error) return { ok: false, message: friendlyDbError(error.message) };
    const now = new Set(mediaUrls(res.fields, row));
    await removeMedia(supabase, mediaUrls(res.fields, before).filter((u) => !now.has(u)));
  } else {
    if (res.sortable) {
      const { data: last } = await supabase.from(res.table).select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
      row.sort_order = (last?.sort_order ?? 0) + 1;
    }
    const { error } = await supabase.from(res.table).insert(row);
    if (error) return { ok: false, message: friendlyDbError(error.message) };
  }
  refreshSite();
  redirect(`/admin/${key}?saved=1`);
}

export async function deleteResource(key: string, id: string) {
  const res = getResource(key);
  if (!res || !UUID.test(id)) return;
  const { supabase } = await requireAdmin();
  const { data: before } = await supabase.from(res.table).select("*").eq("id", id).maybeSingle();
  const { error } = await supabase.from(res.table).delete().eq("id", id);
  if (!error) await removeMedia(supabase, mediaUrls(res.fields, before));
  refreshSite();
  redirect(`/admin/${key}`);
}

async function reorder(table: string, id: string, dir: -1 | 1) {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from(table).select("id").order("sort_order").order("created_at");
  const ids = (data ?? []).map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await Promise.all(ids.map((rid, idx) => supabase.from(table).update({ sort_order: idx + 1 }).eq("id", rid)));
  refreshSite();
}

export async function moveResource(key: string, id: string, dir: -1 | 1) {
  const res = getResource(key);
  if (!res?.sortable || !UUID.test(id)) return;
  await reorder(res.table, id, dir);
}

export async function togglePublished(key: string, id: string, value: boolean) {
  const res = getResource(key);
  if (!res?.publishField || !UUID.test(id)) return;
  const { supabase } = await requireAdmin();
  await supabase.from(res.table).update({ [res.publishField]: value }).eq("id", id);
  refreshSite();
}

/* ------------------------------------------------------ bed availability */

export async function setAvailableBeds(id: string, available: number) {
  if (!UUID.test(id) || !Number.isInteger(available)) return { ok: false, message: "Invalid value" };
  const { supabase } = await requireAdmin();
  const { data: room } = await supabase.from("rooms").select("total_beds").eq("id", id).single();
  if (!room) return { ok: false, message: "Room not found" };
  const value = Math.max(0, Math.min(room.total_beds, available));
  const { error } = await supabase.from("rooms").update({ available_beds: value, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return { ok: false, message: friendlyDbError(error.message) };
  refreshSite();
  return { ok: true, message: "Saved", value };
}

/* --------------------------------------------------------------- gallery */

export async function addGalleryImages(items: { url: string }[], category: string) {
  const { supabase } = await requireAdmin();
  const cat = category.trim().slice(0, 40) || "General";
  const { data: first } = await supabase.from("gallery_images").select("sort_order").order("sort_order").limit(1).maybeSingle();
  let order = (first?.sort_order ?? 1) - items.length;
  const rows = items
    .filter((i) => typeof i.url === "string" && i.url.startsWith("http"))
    .map((i) => ({ image_url: i.url, caption: "", category: cat, sort_order: order++ }));
  if (!rows.length) return { ok: false, message: "Nothing to add" };
  const { error } = await supabase.from("gallery_images").insert(rows);
  if (error) return { ok: false, message: friendlyDbError(error.message) };
  refreshSite();
  return { ok: true, message: `${rows.length} photo${rows.length === 1 ? "" : "s"} added` };
}

export async function updateGalleryImage(id: string, caption: string, category: string) {
  if (!UUID.test(id)) return;
  const { supabase } = await requireAdmin();
  await supabase
    .from("gallery_images")
    .update({ caption: caption.trim().slice(0, 150), category: category.trim().slice(0, 40) || "General" })
    .eq("id", id);
  refreshSite();
}

export async function deleteGalleryImage(id: string) {
  if (!UUID.test(id)) return;
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("gallery_images").select("image_url").eq("id", id).maybeSingle();
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (!error) await removeMedia(supabase, [data?.image_url]);
  refreshSite();
}

export async function moveGalleryImage(id: string, dir: -1 | 1) {
  if (!UUID.test(id)) return;
  await reorder("gallery_images", id, dir);
}

/* ------------------------------------------------------------- food menu */

export async function saveMenu(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const rows = Array.from({ length: 7 }, (_, day) => ({
    day,
    breakfast: str(form.get(`${day}.breakfast`)).slice(0, 120),
    lunch: str(form.get(`${day}.lunch`)).slice(0, 120),
    snacks: str(form.get(`${day}.snacks`)).slice(0, 120),
    dinner: str(form.get(`${day}.dinner`)).slice(0, 120),
  }));
  const { error } = await supabase.from("meal_menu").upsert(rows, { onConflict: "day" });
  if (error) return { ok: false, message: friendlyDbError(error.message) };
  refreshSite();
  return { ok: true, message: "Food menu saved." };
}

/* -------------------------------------------------------------- settings */

const SETTINGS_TEXT: [string, number][] = [
  ["hostel_name", 80], ["hostel_type", 40], ["tagline", 200], ["about_title", 120], ["about_text", 4000],
  ["phone", 30], ["phone_alt", 30], ["whatsapp", 20], ["email", 150], ["address", 200], ["office_hours", 100],
  ["facebook_url", 300], ["instagram_url", 300], ["tiktok_url", 300], ["youtube_url", 300],
  ["price_note", 300], ["meta_description", 300], ["logo_url", 500], ["about_image", 500],
  ["promo_title", 60], ["promo_subtitle", 200], ["promo_image", 500], ["promo_badge_top", 20],
  ["promo_badge_value", 20], ["promo_button_label", 40], ["promo_button_link", 300],
];

/**
 * Accepts the <iframe> code from Google Maps (Share → Embed a map), an embed URL,
 * or a place name / address. Short share links can't be embedded, so for those
 * we fall back to searching the hostel address.
 */
function mapEmbedUrl(input: string, address: string | null) {
  if (!input) return null;
  const src = input.match(/src="([^"]+)"/)?.[1] ?? input;
  if (/^https:\/\/www\.google\.com\/maps\/embed/.test(src) || /^https:\/\/www\.google\.com\/maps\?.*output=embed/.test(src)) return src;
  const query = /^https?:\/\//.test(input) ? address : input;
  return query ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : null;
}

export async function saveSettings(_prev: FormState, form: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [name, max] of SETTINGS_TEXT) {
    const v = str(form.get(name)).slice(0, max);
    row[name] = v || null;
  }
  if (!row.hostel_name) return { ok: false, message: "Hostel name is required." };
  row.hostel_type = row.hostel_type ?? "Hostel";
  row.tagline = row.tagline ?? "";
  row.about_title = row.about_title ?? "Welcome";
  row.about_text = row.about_text ?? "";
  for (const url of ["facebook_url", "instagram_url", "tiktok_url", "youtube_url"]) {
    if (row[url] && !/^https?:\/\//.test(String(row[url]))) row[url] = `https://${row[url]}`;
  }
  const year = str(form.get("established_year"));
  row.established_year = /^\d{4}$/.test(year) ? Number(year) : null;
  row.admission_open = form.get("admission_open") === "on";
  const color = str(form.get("theme_color"));
  row.theme_color = /^#[0-9a-f]{6}$/i.test(color) ? color : "#fd7444";
  const color2 = str(form.get("secondary_color"));
  row.secondary_color = /^#[0-9a-f]{6}$/i.test(color2) ? color2 : "#8cbb6a";
  for (const k of ["promo_title", "promo_subtitle", "promo_badge_top", "promo_badge_value", "promo_button_label"]) row[k] = row[k] ?? "";
  const link = String(row.promo_button_link ?? "");
  row.promo_button_link = /^(#|\/(?!\/)|https:\/\/)/.test(link) ? link : "#menu";
  row.map_embed_url = mapEmbedUrl(str(form.get("map_embed_url")), (row.address as string | null) ?? null);

  let slides: HeroSlide[] = [];
  try {
    const parsed = JSON.parse(str(form.get("hero_slides")) || "[]");
    if (Array.isArray(parsed)) {
      slides = parsed
        .map((s) => ({
          image: String(s?.image ?? "").slice(0, 500),
          title: String(s?.title ?? "").slice(0, 120),
          subtitle: String(s?.subtitle ?? "").slice(0, 250),
        }))
        .filter((s) => s.image || s.title)
        .slice(0, 8);
    }
  } catch {}
  row.hero_slides = slides;

  const { data: before } = await supabase.from("site_settings").select("logo_url, about_image, promo_image, hero_slides").eq("id", 1).maybeSingle();
  const { error } = await supabase.from("site_settings").update(row).eq("id", 1);
  if (error) return { ok: false, message: friendlyDbError(error.message) };

  if (before) {
    const now = new Set([row.logo_url, row.about_image, row.promo_image, ...slides.map((s) => s.image)]);
    const old = [before.logo_url, before.about_image, before.promo_image, ...((before.hero_slides as HeroSlide[]) ?? []).map((s) => s.image)];
    await removeMedia(supabase, old.filter((u) => !now.has(u)));
  }
  refreshSite();
  return { ok: true, message: "Settings saved. The website is updated." };
}

/* ------------------------------------------------------------- enquiries */

export async function setEnquiryStatus(id: string, status: string) {
  if (!UUID.test(id) || !["new", "contacted", "closed"].includes(status)) return;
  const { supabase } = await requireAdmin();
  await supabase.from("enquiries").update({ status }).eq("id", id);
}

export async function deleteEnquiry(id: string) {
  if (!UUID.test(id)) return;
  const { supabase } = await requireAdmin();
  await supabase.from("enquiries").delete().eq("id", id);
}
