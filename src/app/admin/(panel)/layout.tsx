import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { AdminNav } from "@/components/admin/nav";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

type LayoutCache = {
  hostelName: string;
  themeColor: string | null;
  expiresAt: number;
};
let cachedLayout: LayoutCache | null = null;

export function invalidateAdminLayoutCache() {
  cachedLayout = null;
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { supabase, user } = await requireAdmin();

  const now = Date.now();
  let hostelName = "Hostel";
  let themeColor: string | null = null;

  if (cachedLayout && cachedLayout.expiresAt > now) {
    hostelName = cachedLayout.hostelName;
    themeColor = cachedLayout.themeColor;
    const { count } = await supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new");
    const brand = /^#[0-9a-f]{6}$/i.test(themeColor ?? "") ? themeColor! : undefined;

    return (
      <div className="min-h-screen bg-sand/60 lg:flex" style={brand ? { ["--brand" as string]: brand } : undefined}>
        <AdminNav hostelName={hostelName} email={user.email ?? ""} newEnquiries={count ?? 0} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
    );
  }

  const [{ count }, { data: settings }] = await Promise.all([
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("site_settings").select("hostel_name, theme_color").eq("id", 1).maybeSingle(),
  ]);

  hostelName = settings?.hostel_name ?? "Hostel";
  themeColor = settings?.theme_color ?? null;
  cachedLayout = { hostelName, themeColor, expiresAt: now + 30_000 };

  const brand = /^#[0-9a-f]{6}$/i.test(themeColor ?? "") ? themeColor! : undefined;

  return (
    <div className="min-h-screen bg-sand/60 lg:flex" style={brand ? { ["--brand" as string]: brand } : undefined}>
      <AdminNav hostelName={hostelName} email={user.email ?? ""} newEnquiries={count ?? 0} />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
