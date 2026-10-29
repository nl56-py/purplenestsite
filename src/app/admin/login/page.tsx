import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin login", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  if (isSupabaseConfigured) {
    // Already signed in as an admin? Go straight to the dashboard.
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (isAdmin) redirect("/admin");
    }
  }
  return (
    <div className="grid min-h-screen place-items-center bg-sand px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand text-xl font-extrabold text-white">A</span>
          <h1 className="mt-4 text-2xl font-extrabold">Website admin</h1>
          <p className="mt-1 text-sm text-muted">Sign in to update rooms, notices and photos.</p>
        </div>
        {!isSupabaseConfigured ? (
          <p className="card p-5 text-sm text-red-700">Supabase is not configured. Add the environment variables and redeploy.</p>
        ) : (
          <LoginForm notAdmin={error === "not-admin"} />
        )}
      </div>
    </div>
  );
}
