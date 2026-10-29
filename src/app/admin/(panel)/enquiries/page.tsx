import Link from "next/link";
import { CalendarDays, Mail, Phone } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { formatDate, formatDateTime, telHref, whatsappHref } from "@/lib/format";
import { formatShortDualDate } from "@/lib/nepali-date";
import { WhatsappIcon } from "@/lib/icons";
import { PageHeader } from "@/components/admin/ui";
import { EnquiryActions } from "@/components/admin/enquiry-actions";
import type { Enquiry } from "@/lib/types";

const TABS = [
  ["all", "All"],
  ["new", "New"],
  ["contacted", "Contacted"],
  ["closed", "Closed"],
] as const;

export default async function EnquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "all" } = await searchParams;
  const { supabase } = await requireAdmin();
  let q = supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(200);
  if (status !== "all" && TABS.some(([k]) => k === status)) q = q.eq("status", status);
  const { data } = await q;
  const items = (data ?? []) as Enquiry[];

  return (
    <>
      <PageHeader title="Enquiries" description="Booking requests sent from the website form. Call or WhatsApp them, then mark as contacted." />
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map(([k, l]) => (
          <Link key={k} href={k === "all" ? "/admin/enquiries" : `/admin/enquiries?status=${k}`} className={`rounded-full px-4 py-1.5 text-sm font-bold ${status === k ? "bg-brand text-white" : "bg-white text-muted hover:text-brand"}`}>
            {l}
          </Link>
        ))}
      </div>
      <div className="space-y-3">
        {items.map((e) => (
          <article key={e.id} className={`card p-5 ${e.status === "new" ? "border-l-4 border-l-accent" : ""}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold">{e.name}</h2>
                <p className="text-xs text-muted">Received {formatDateTime(e.created_at)}</p>
              </div>
              <EnquiryActions id={e.id} status={e.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <a href={telHref(e.phone)} className="flex items-center gap-1.5 font-semibold text-brand"><Phone className="size-4" /> {e.phone}</a>
              <a href={whatsappHref(e.phone, `Namaste ${e.name.split(" ")[0]}, thank you for your enquiry.`)} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 font-semibold text-[#128c7e]"><WhatsappIcon className="size-4" /> WhatsApp</a>
              {e.email && <a href={`mailto:${e.email}`} className="flex items-center gap-1.5 text-muted hover:text-brand"><Mail className="size-4" /> {e.email}</a>}
              {e.move_in_date && (
                <span className="flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded">
                  <CalendarDays className="size-3.5 text-emerald-600" /> Move in: {formatShortDualDate(e.move_in_date)}
                </span>
              )}
              <span className="rounded bg-sand px-2 py-0.5 font-semibold">{e.room_name ?? "Any room"}</span>
            </div>
            {e.message && <p className="mt-3 whitespace-pre-line rounded-lg bg-sand/70 p-3 text-sm">{e.message}</p>}
          </article>
        ))}
        {!items.length && <div className="card p-10 text-center text-sm text-muted">No enquiries here.</div>}
      </div>
    </>
  );
}
