import { requireAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui";
import { GalleryManager } from "@/components/admin/gallery-manager";
import type { GalleryImage } from "@/lib/types";

export default async function GalleryAdminPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("gallery_images").select("*").order("sort_order").order("created_at", { ascending: false });
  return (
    <>
      <PageHeader
        title="Photo gallery"
        description="Upload photos of rooms, dining, study areas and the building. Photos are resized automatically before upload, so phone photos are fine."
      />
      <GalleryManager images={(data ?? []) as GalleryImage[]} />
    </>
  );
}
