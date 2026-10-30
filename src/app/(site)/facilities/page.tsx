import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { getFacilities, getSiteData } from "@/lib/data";
import { FacilityIcon } from "@/lib/icons";
import { SectionHeading } from "@/components/site/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbSchema } from "@/lib/seo-schema";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const url = `${SITE_URL}/facilities`;
  const title = `Hostel Facilities & Amenities | ${settings.hostel_name}`;
  const description = `Explore all student facilities at ${settings.hostel_name}: High-speed Wi-Fi, 4 fresh meals daily, 24/7 CCTV & biometric security, solar hot water, study hall, and laundry.`;

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

export default async function FacilitiesIndexPage() {
  const [facilities, siteData] = await Promise.all([getFacilities(), getSiteData()]);
  const published = facilities.filter((f) => f.is_published);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Facilities", path: "/facilities" },
  ]);

  const facilitiesListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Purple Nest Hostel Facilities & Services",
    description: "Amenities provided to student residents at The Purple Nest Hostel.",
    numberOfItems: published.length,
    itemListElement: published.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: f.title,
        description: f.description,
        url: `${SITE_URL}/facilities/${f.slug || f.id}`,
      },
    })),
  };

  return (
    <div className="py-16 md:py-24 bg-sand/30">
      <JsonLd id="facilities-breadcrumbs" data={breadcrumbs} />
      <JsonLd id="facilities-list-schema" data={facilitiesListSchema} />

      <div className="mx-auto max-w-[1200px] px-5">
        <SectionHeading title="Our Facilities" label="amenities across all 3 blocks in gwarko, lalitpur" />
        <p className="mx-auto mt-6 max-w-2xl text-center text-[16px] text-muted font-serif leading-relaxed">
          Designed specifically for college scholars and exam aspirants living across our three blocks at Sinpa Marg, Gwarko, Lalitpur. Every facility is maintained daily to the highest standards.
        </p>

        {/* Facilities Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((f) => (
            <article
              key={f.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-line shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-brand/40"
            >
              {/* Card Photo / Visual */}
              <div className="img-fallback relative aspect-[16/10] overflow-hidden bg-sand">
                {f.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.image_url}
                    alt={f.title}
                    className="size-full object-cover transition duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="grid size-full place-items-center bg-gradient-to-br from-sun/20 to-brand/10">
                    <FacilityIcon name={f.icon} className="size-16 text-brand stroke-[1.2]" />
                  </div>
                )}
                {/* Floating Icon Badge */}
                <div className="absolute bottom-3 left-4 grid size-12 place-items-center rounded-full bg-sun text-ink shadow-md transition duration-300 group-hover:bg-brand group-hover:text-white">
                  <FacilityIcon name={f.icon} className="size-6 stroke-[1.5]" />
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h2 className="oswald text-[20px] font-medium text-ink transition group-hover:text-brand">
                  <Link href={`/facilities/${f.slug || f.id}`}>{f.title}</Link>
                </h2>
                <p className="mt-2.5 text-[14px] text-muted line-clamp-2 leading-relaxed">
                  {f.description}
                </p>

                {/* Highlights preview */}
                {f.highlights && f.highlights.length > 0 && (
                  <div className="mt-4 space-y-1.5 border-t border-line/60 pt-4">
                    {f.highlights.slice(0, 3).map((h, i) => (
                      <p key={i} className="flex items-center gap-2 text-xs text-ink/80">
                        <Check className="size-3 text-leaf shrink-0" />
                        <span className="truncate">{h}</span>
                      </p>
                    ))}
                  </div>
                )}

                {/* Link Action */}
                <div className="mt-auto pt-6 border-t border-line/60 flex items-center justify-between">
                  <Link
                    href={`/facilities/${f.slug || f.id}`}
                    className="oswald inline-flex items-center gap-2 text-[12px] !tracking-[0.18em] text-brand transition group-hover:text-ink"
                  >
                    View details <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                  </Link>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted/70">Included</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-20 rounded-2xl bg-leaf p-8 md:p-12 text-center text-white shadow-md">
          <Sparkles className="mx-auto size-8 text-sun mb-3" />
          <h3 className="display text-[clamp(2.2rem,4vw,3.2rem)]">All facilities are included in your monthly fee</h3>
          <p className="mt-3 max-w-xl mx-auto text-white/90 text-[16px]">
            No hidden costs or extra surprise charges for water, Wi-Fi, electricity, or laundry. Visit {siteData.settings.hostel_name} today!
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/rooms" className="tbtn tbtn-sun px-10">Choose a room</Link>
            <Link href="/contact" className="tbtn tbtn-dark px-10">Contact hostel</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
