import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./env";

/**
 * Cookie-less client for the public website. Because it never touches cookies,
 * pages that use it can be statically generated and cached (fast + free-tier friendly).
 */
export function createPublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
