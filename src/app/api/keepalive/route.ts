import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

/**
 * Called once a day by Vercel Cron (see vercel.json). Supabase pauses free projects
 * after a week without database activity; this tiny query keeps the project awake.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!isSupabaseConfigured) return Response.json({ ok: false, reason: "not configured" }, { status: 500 });
  const { error } = await createPublicClient().from("site_settings").select("id").limit(1);
  if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
  return Response.json({ ok: true, at: new Date().toISOString() });
}
