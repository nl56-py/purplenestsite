import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { getResource } from "@/lib/resources";
import { PageHeader } from "@/components/admin/ui";
import { ResourceForm } from "@/components/admin/resource-form";

export default async function ResourceEditPage({ params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  const res = getResource(resource);
  if (!res) notFound();
  const { supabase } = await requireAdmin();

  const isNew = id === "new";
  let row: Record<string, unknown> | null = null;
  if (!isNew) {
    if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
    const { data } = await supabase.from(res.table).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    row = data;
  }

  return (
    <>
      <Link href={`/admin/${res.key}`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand">
        <ArrowLeft className="size-4" /> {res.title}
      </Link>
      <PageHeader title={isNew ? `Add ${res.singular}` : `Edit ${res.singular}`} />
      <ResourceForm resourceKey={res.key} id={isNew ? null : id} initial={row} />
    </>
  );
}
