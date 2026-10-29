import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Pin } from "lucide-react";
import { getSiteData } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { SectionHeading } from "@/components/site/section-heading";

export const revalidate = 300;
export const metadata: Metadata = { title: "Notices" };

export default async function NoticesPage() {
  const { notices } = await getSiteData();
  return (
    <div className="bg-sand">
      <div className="mx-auto max-w-4xl px-5 py-20 md:py-24">
        <SectionHeading title="Notices" label="announcements from the hostel office" />
        <div className="mt-12 space-y-4">
          {notices.length === 0 && <p className="text-center text-muted">No notices right now.</p>}
          {notices.map((n) => (
            <Link key={n.id} href={`/notices/${n.id}`} className="group flex gap-5 bg-white p-6 transition hover:shadow-md">
              <div className="w-16 shrink-0 bg-brand py-3 text-center text-white">
                <p className="oswald text-2xl font-medium leading-none">{formatDate(n.published_at, { day: "numeric" })}</p>
                <p className="oswald mt-1 text-xs">{formatDate(n.published_at, { month: "short" })}</p>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="oswald flex items-center gap-2 text-[17px] font-medium text-ink group-hover:text-brand">
                  {n.is_pinned && <Pin className="size-4 shrink-0 text-brand" aria-label="Pinned" />}
                  {n.title}
                </h2>
                <p className="mt-1 line-clamp-2">{n.body}</p>
              </div>
              <ArrowRight className="mt-1 size-5 shrink-0 text-muted transition group-hover:translate-x-1 group-hover:text-brand" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
