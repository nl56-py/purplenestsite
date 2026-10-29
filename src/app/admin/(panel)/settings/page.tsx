import { requireAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";
import type { SiteSettings } from "@/lib/types";

export default async function SettingsPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  return (
    <>
      <PageHeader title="Website settings" description="Hostel details, contact information, slideshow, about section and colours." />
      <SettingsForm settings={data as SiteSettings} />
    </>
  );
}
