import type { Metadata } from "next";
import { Info, Check } from "lucide-react";
import { getSiteData } from "@/lib/data";
import { PageBanner } from "@/components/site/page-banner";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { RoomsPageListing } from "@/components/site/rooms-page-listing";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbSchema, generateRoomsPageSchema } from "@/lib/seo-schema";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const url = `${SITE_URL}/rooms`;
  const title = `Rooms & Pricing | ${settings.hostel_name}`;
  const description = `Browse single, double, triple, and 4-seater student rooms at ${settings.hostel_name} in Gwarko, Lalitpur (Kathmandu Valley). All-inclusive fees with 4 meals, Wi-Fi, solar hot water, and laundry.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: ["/images/hero-room.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-room.jpg"],
    },
  };
}

export default async function RoomsPage() {
  const { rooms, blocks, settings } = await getSiteData();

  const totalAvailable = rooms.reduce((s, r) => s + (r.available_beds || 0), 0);
  const totalBeds = rooms.reduce((s, r) => s + (r.total_beds || 0), 0);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Rooms & Pricing", path: "/rooms" },
  ]);

  const roomsSchema = generateRoomsPageSchema(rooms);

  return (
    <>
      <JsonLd id="rooms-breadcrumbs" data={breadcrumbs} />
      <JsonLd id="rooms-itemlist-schema" data={roomsSchema} />
      <PageBanner
        title="Hostel Rooms & Accommodation"
        label="3 residential blocks in gwarko, lalitpur"
        description="Spacious student rooms organized across 3 dedicated residential blocks (Block A, Block B, and Block C) at Sinpa Marg, Gwarko, Lalitpur with transparent all-inclusive fees."
      />

      {/* Live availability notice banner */}
      <section className="border-b border-line bg-sand/40 py-5">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-4 px-5">
          <div className="flex items-center gap-3">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
            </span>
            <div>
              <p className="oswald text-[12px] !tracking-[0.16em] uppercase text-ink font-semibold">
                Live Status: {settings.admission_open ? "Admissions Open" : "Waitlist Active"}
              </p>
              <p className="text-xs text-muted">
                {totalAvailable} of {totalBeds} total beds currently available across all blocks.
              </p>
            </div>
          </div>

          <a href="#book" className="tbtn tbtn-brand py-2.5 px-6 text-xs !tracking-[0.16em]">
            Book a room below
          </a>
        </div>
      </section>

      {/* Interactive Room Listing Grid with Block & Floor Filtering */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-[1200px] px-5">
          <RoomsPageListing rooms={rooms} blocks={blocks} settings={settings} />
        </div>
      </section>

      {/* Transparent Fees Policy Section */}
      <section className="py-14 bg-sand/30 border-y border-line">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="rounded-3xl bg-white border border-line p-8 md:p-12 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand/10 text-brand">
                <Info className="size-6" />
              </div>
              <div>
                <h3 className="oswald text-[22px] font-medium text-ink">What is included in the monthly fee?</h3>
                <p className="mt-2 text-sm text-muted font-serif leading-relaxed">
                  {settings.price_note || "Our monthly room fees are strictly 100% all-inclusive. You will never be billed for electricity, Wi-Fi, drinking water, or hot water."}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  <div className="flex items-center gap-2.5 text-xs text-ink font-semibold">
                    <Check className="size-4 text-leaf shrink-0" />
                    <span>4 Fresh Nutritious Meals Daily</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-ink font-semibold">
                    <Check className="size-4 text-leaf shrink-0" />
                    <span>High-Speed Dual Fiber Wi-Fi</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-ink font-semibold">
                    <Check className="size-4 text-leaf shrink-0" />
                    <span>24/7 Solar & Geyser Hot Water</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-ink font-semibold">
                    <Check className="size-4 text-leaf shrink-0" />
                    <span>Full Inverter Power Backup</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-ink font-semibold">
                    <Check className="size-4 text-leaf shrink-0" />
                    <span>Daily Room Cleaning & Trash Disposal</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-ink font-semibold">
                    <Check className="size-4 text-leaf shrink-0" />
                    <span>Weekly Personal Clothes Laundry</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Booking & Enquiry Section */}
      <section id="book" className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-[800px] px-5">
          <div className="text-center">
            <p className="oswald text-[11px] !tracking-[0.25em] text-brand uppercase font-semibold">
              Reserve or Inquire
            </p>
            <h2 className="display mt-2 text-[clamp(2.4rem,4vw,3.4rem)] text-ink">
              Book Your Bed Today
            </h2>
            <p className="mt-3 text-muted font-serif">
              Submit your room preference and contact details. Our hostel warden will reach out within 2 hours to confirm bed availability and schedule your visit.
            </p>
          </div>

          <div className="mt-10 rounded-3xl border border-line bg-sand/20 p-6 sm:p-10 shadow-sm">
            <EnquiryForm rooms={rooms} />
          </div>
        </div>
      </section>
    </>
  );
}
