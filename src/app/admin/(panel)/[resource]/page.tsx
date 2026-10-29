import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Pencil, Pin, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { getResource } from "@/lib/resources";
import { formatDate, formatRs } from "@/lib/format";
import { PageHeader } from "@/components/admin/ui";
import { RowActions } from "@/components/admin/row-actions";
import { BedStepper } from "@/components/admin/bed-stepper";
import { SavedToast } from "@/components/admin/saved-toast";

export default async function ResourceListPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const res = getResource(resource);
  if (!res) notFound();
  const { supabase } = await requireAdmin();

  let query = supabase.from(res.table).select("*");
  for (const o of res.order) query = query.order(o.column, { ascending: o.ascending });
  const { data, error } = await query;
  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <>
      <Suspense>
        <SavedToast />
      </Suspense>
      <PageHeader title={res.title} description={res.description}>
        <Link href={`/admin/${res.key}/new`} className="btn btn-primary">
          <Plus className="size-4" /> Add {res.singular}
        </Link>
      </PageHeader>
      {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error.message}</p>}
      <div className="card divide-y divide-line">
        {rows.map((row, i) => {
          const id = String(row.id);
          const published = res.publishField ? Boolean(row[res.publishField]) : true;
          return (
            <div key={id} className={`flex flex-wrap items-center gap-4 p-4 ${published ? "" : "bg-sand/60"}`}>
              {res.key === "rooms" && (
                <div className="img-fallback size-16 shrink-0 overflow-hidden rounded-lg">
                  {(row.images as string[])?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={(row.images as string[])[0]} alt="" className="size-full object-cover" />
                  )}
                </div>
              )}
              <div className="min-w-0 flex-1 basis-60">
                <Link href={`/admin/${res.key}/${id}`} className="flex items-center gap-2 font-bold hover:text-brand">
                  {Boolean(row.is_pinned) && <Pin className="size-3.5 shrink-0 text-accent" />}
                  <span className="line-clamp-2">{res.label(row)}</span>
                </Link>
                <p className="mt-0.5 line-clamp-1 text-sm text-muted">
                  {res.key === "rooms" && `${formatRs(Number(row.monthly_fee))}/month · ${row.beds_per_room} per room`}
                  {res.key === "notices" && (
                    <>
                      {formatDate(String(row.published_at))}
                      {Boolean(row.show_as_popup) && (
                        <span className="ml-2 rounded bg-accent/25 px-1.5 py-0.5 text-[11px] font-bold text-accent-dark">
                          POPUP{row.popup_until ? ` until ${formatDate(String(row.popup_until))}` : ""}
                        </span>
                      )}
                    </>
                  )}
                  {res.sub?.(row)}
                </p>
                {!published && <span className="mt-1 inline-block rounded bg-line px-1.5 py-0.5 text-[11px] font-bold text-muted">HIDDEN</span>}
              </div>
              {res.key === "rooms" && <BedStepper id={id} value={Number(row.available_beds)} max={Number(row.total_beds)} />}
              <div className="flex items-center gap-2">
                <Link href={`/admin/${res.key}/${id}`} className="btn btn-ghost py-1.5 text-xs"><Pencil className="size-3.5" /> Edit</Link>
                <RowActions
                  resourceKey={res.key}
                  id={id}
                  sortable={res.sortable}
                  first={i === 0}
                  last={i === rows.length - 1}
                  publishable={Boolean(res.publishField)}
                  published={published}
                />
              </div>
            </div>
          );
        })}
        {!rows.length && (
          <div className="p-10 text-center text-sm text-muted">
            Nothing here yet.{" "}
            <Link href={`/admin/${res.key}/new`} className="font-bold text-brand">Add the first {res.singular}</Link>
          </div>
        )}
      </div>
    </>
  );
}
