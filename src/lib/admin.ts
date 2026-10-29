import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { createClient } from "./supabase/server";
import { MEDIA_BUCKET, SUPABASE_URL, isSupabaseConfigured } from "./supabase/env";

type CachedAdminSession = {
  user: User;
  expiresAt: number;
};

// In-memory cache for verified admin user sessions (TTL: 60s)
// Eliminates remote Supabase Auth & RPC latency on rapid tab switches
const adminSessionCache = new Map<string, CachedAdminSession>();

export function clearAdminSessionCache(tokenKey?: string) {
  if (tokenKey) {
    adminSessionCache.delete(tokenKey);
  } else {
    adminSessionCache.clear();
  }
}

function getAuthTokenSignature(cookieList: { name: string; value: string }[]) {
  return cookieList
    .filter((c) => c.name.includes("-auth-token"))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => `${c.name}=${c.value}`)
    .join(";");
}

/** Use at the top of every admin page and server action. */
export const requireAdmin = cache(async () => {
  if (!isSupabaseConfigured) redirect("/admin/login");

  const cookieStore = await cookies();
  const tokenSignature = getAuthTokenSignature(cookieStore.getAll());
  if (!tokenSignature) redirect("/admin/login");

  const supabase = await createClient();
  const now = Date.now();

  const cached = adminSessionCache.get(tokenSignature);
  if (cached && cached.expiresAt > now) {
    return { supabase, user: cached.user };
  }

  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    adminSessionCache.delete(tokenSignature);
    redirect("/admin/login");
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");
  if (rpcError || !isAdmin) {
    adminSessionCache.delete(tokenSignature);
    redirect("/admin/login?error=not-admin");
  }

  adminSessionCache.set(tokenSignature, {
    user: auth.user,
    expiresAt: now + 60_000,
  });

  return { supabase, user: auth.user };
});

/** Refresh every public page after content changes. */
export function refreshSite() {
  revalidatePath("/", "layout");
}

const PUBLIC_PREFIX = `${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/`;

/** Returns the storage path for URLs that point into our own bucket, else null. */
export function storagePathFromUrl(url: string | null | undefined) {
  if (!url || !url.startsWith(PUBLIC_PREFIX)) return null;
  return decodeURIComponent(url.slice(PUBLIC_PREFIX.length).split("?")[0]);
}

/** Deletes uploaded files that are no longer used. Never throws. */
export async function removeMedia(supabase: Awaited<ReturnType<typeof createClient>>, urls: (string | null | undefined)[]) {
  const paths = Array.from(new Set(urls.map(storagePathFromUrl).filter(Boolean))) as string[];
  if (!paths.length) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  if (error) console.warn("[media] could not delete", paths, error.message);
}

export function friendlyDbError(message: string) {
  if (message.includes("rooms_available_le_total")) return "Available beds cannot be more than total beds.";
  if (message.includes("violates check constraint")) return "One of the values is out of range. Please check the form.";
  if (message.includes("row-level security")) return "You don't have permission to do that.";
  return message;
}
