import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Pin } from "lucide-react";
import { getSiteData } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { SectionHeading } from "@/components/site/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbSchema } from "@/lib/seo-schema";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const url = `${SITE_URL}/notices`;
  const title = `Notices & Announcements | ${settings.hostel_name}`;
  const description = `Latest official notices, admission updates, holiday schedules, and event announcements from ${settings.hostel_name} administration.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: ["/images/og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/og-image.jpg"],
    },
  };
}

export default async function NoticesPage() {
  const { notices, settings } = await getSiteData();

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Notices", path: "/notices" },
  ]);

  const noticesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${settings.hostel_name} Official Notices`,
    description: "Official announcements from the hostel administration.",
    numberOfItems: notices.length,
    itemListElement: notices.map((n, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "NewsArticle",
        headline: n.title,
        datePublished: n.published_at || new Date().toISOString(),
        url: `${SITE_URL}/notices/${n.id}`,
      },
    })),
  };

  return (
    <div className="bg-sand">
      <JsonLd id="notices-breadcrumbs" data={breadcrumbs} />
      <JsonLd id="notices-list-schema" data={noticesListSchema} />

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
