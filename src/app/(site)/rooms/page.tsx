import type { Metadata } from "next";
import Link from "next/link";
import { BedDouble, Check, Users, Sparkles, AlertCircle, Info, ShieldCheck } from "lucide-react";
import { getSiteData } from "@/lib/data";
import { PageBanner } from "@/components/site/page-banner";
import { formatRs, availabilityLabel } from "@/lib/format";
import { EnquiryForm } from "@/components/site/enquiry-form";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  return {
    title: `Rooms & Pricing | ${settings.hostel_name}`,
    description: `Browse single, double, triple, and four-seater rooms at ${settings.hostel_name}. Transparent monthly fees with 4 meals, Wi-Fi, solar hot water, and laundry included.`,
  };
}

export default async function RoomsPage() {
  const { rooms, settings } = await getSiteData();

  const totalAvailable = rooms.reduce((s, r) => s + (r.available_beds || 0), 0);
  const totalBeds = rooms.reduce((s, r) => s + (r.total_beds || 0), 0);

  return (
    <>
      <PageBanner
        title="Rooms & Monthly Fees"
        label="well ventilated • fully furnished • transparent fees"
        description="Spacious student rooms designed with individual wooden beds, comfortable mattresses, personal wardrobes, dedicated study tables, and daily housekeeping."
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
                {totalAvailable} of {totalBeds} total beds currently available across all room categories.
              </p>
            </div>
          </div>

          <a href="#book" className="tbtn tbtn-brand py-2.5 px-6 text-xs !tracking-[0.16em]">
            Book a room below
          </a>
        </div>
      </section>

      {/* Room Listing Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid gap-10 lg:grid-cols-2">
            {rooms.map((room) => {
              const status = availabilityLabel(room.available_beds, room.total_beds);
              const toneClasses = {
                ok: "bg-emerald-100 text-emerald-800 border-emerald-200",
                low: "bg-rose-100 text-rose-700 border-rose-200 font-bold",
                full: "bg-stone-200 text-stone-700 border-stone-300",
              }[status.tone];

              const photo = room.images?.[0] || "/images/hero-room.jpg";

              return (
                <article
                  key={room.id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-brand/40"
                >
                  {/* Photo area */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-sand">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={room.name}
                      className="size-full object-cover transition duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Bed capacity badge */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                      <Users className="size-3.5 text-sun" />
                      <span>{room.beds_per_room} {room.beds_per_room === 1 ? "Person" : "Seater"}</span>
                    </div>

                    {/* Availability pill */}
                    <div className={`absolute top-4 right-4 rounded-full border px-3 py-1.5 text-xs backdrop-blur ${toneClasses}`}>
                      {status.text}
                    </div>

                    {/* Fee banner over photo */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
                      <div className="flex items-baseline justify-between">
                        <span className="oswald text-[12px] !tracking-[0.18em] uppercase text-sun">All Inclusive Fee</span>
                        <div className="text-right">
                          <span className="display text-2xl text-white">{formatRs(room.monthly_fee)}</span>
                          <span className="text-xs text-white/80"> / month</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Room details */}
                  <div className="flex flex-1 flex-col p-6 sm:p-8">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="oswald text-[24px] font-medium text-ink transition group-hover:text-brand">
                        {room.name}
                      </h2>
                      {room.admission_fee ? (
                        <span className="text-xs text-muted">
                          Admission: {formatRs(room.admission_fee)}
                        </span>
                      ) : null}
                    </div>

                    {room.description && (
                      <p className="mt-3 text-sm text-muted leading-relaxed font-serif">
                        {room.description}
                      </p>
                    )}

                    {/* Features list */}
                    {room.features && room.features.length > 0 && (
                      <div className="mt-6 border-t border-line/60 pt-5">
                        <p className="oswald text-[11px] !tracking-[0.18em] uppercase text-muted font-semibold">
                          Room Amenities
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-2.5">
                          {room.features.map((feat, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-ink/85">
                              <Check className="size-3.5 text-leaf shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Room gallery thumbnails if multiple photos */}
                    {room.images && room.images.length > 1 && (
                      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
                        {room.images.map((img, idx) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={idx}
                            src={img}
                            alt=""
                            className="size-16 rounded-xl object-cover border border-line shrink-0"
                          />
                        ))}
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="mt-8 pt-5 border-t border-line/60 flex items-center justify-between gap-4">
                      <div className="text-xs text-muted">
                        <span className="font-bold text-ink">{room.available_beds}</span> beds available right now
                      </div>
                      <a
                        href="#book"
                        className="tbtn tbtn-brand py-2.5 px-6 text-xs !tracking-[0.16em]"
                      >
                        Reserve this room
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
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
