import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { getFacility, getFacilities, getSiteData } from "@/lib/data";
import { FacilityIcon } from "@/lib/icons";
import { telHref } from "@/lib/format";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const facility = await getFacility(slug);
  if (!facility) return { title: "Facility Not Found" };
  return {
    title: `${facility.title} | Hostel Facilities & Amenities`,
    description: facility.description || `Learn about ${facility.title} at our student hostel in Kathmandu.`,
  };
}

export default async function FacilityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [facility, allFacilities, siteData] = await Promise.all([
    getFacility(slug),
    getFacilities(),
    getSiteData(),
  ]);

  if (!facility) notFound();

  const others = allFacilities.filter((f) => f.id !== facility.id && f.is_published);
  const paragraphs = (facility.content || facility.description || "").split(/\n{2,}/).filter(Boolean);

  return (
    <div className="bg-sand/30 py-12 md:py-20">
      <div className="mx-auto max-w-[1200px] px-5">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs">
          <Link href="/" className="oswald text-muted transition hover:text-brand">Home</Link>
          <span className="text-muted/60">/</span>
          <Link href="/facilities" className="oswald text-muted transition hover:text-brand">Facilities</Link>
          <span className="text-muted/60">/</span>
          <span className="oswald text-brand truncate max-w-[200px] sm:max-w-none">{facility.title}</span>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Link href="/#facilities" className="oswald inline-flex items-center gap-2 text-[12px] !tracking-[0.2em] text-brand transition hover:text-ink">
            <ArrowLeft className="size-4" /> Back to all facilities
          </Link>
        </div>

        {/* Page Hero Title */}
        <div className="mb-12 flex flex-wrap items-center justify-between gap-6 border-b border-line pb-8">
          <div className="flex items-center gap-5">
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-sun text-ink shadow-sm md:size-20">
              <FacilityIcon name={facility.icon} className="size-8 stroke-[1.5] md:size-10" />
            </span>
            <div>
              <p className="label-caps text-muted">Amenity & Service</p>
              <h1 className="display mt-1 text-[clamp(2.4rem,5vw,3.8rem)] text-brand">{facility.title}</h1>
            </div>
          </div>
          <a href="/#enquiry" className="tbtn tbtn-brand py-3.5 px-8 text-[12px]">
            Book a bed now
          </a>
        </div>

        {/* Main Content Layout */}
        <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* Main Article */}
          <main className="space-y-10">
            {/* Feature Photo */}
            {facility.image_url ? (
              <div className="img-fallback relative aspect-[16/10] overflow-hidden rounded-2xl shadow-sm border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={facility.image_url}
                  alt={facility.title}
                  className="size-full object-cover"
                />
                <div className="absolute bottom-4 left-4 rounded-full bg-ink/80 backdrop-blur px-4 py-1.5 text-xs text-white oswald !tracking-wider">
                  Verified Facility
                </div>
              </div>
            ) : null}

            {/* Description / Article Content */}
            <div className="rounded-2xl bg-white p-8 md:p-10 shadow-sm border border-line">
              <h2 className="oswald text-[20px] font-medium text-ink mb-6">Overview & Specifications</h2>
              <div className="space-y-5 text-[16px] leading-[1.85] text-ink/85 font-serif">
                {paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Highlights Checklist */}
              {facility.highlights && facility.highlights.length > 0 && (
                <div className="mt-10 border-t border-line/60 pt-8">
                  <h3 className="oswald text-[15px] !tracking-[0.2em] text-brand uppercase mb-6 flex items-center gap-2">
                    <Sparkles className="size-4 text-sun" /> What is included
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {facility.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 bg-sand/60 p-3.5 rounded-xl">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-leaf text-white mt-0.5">
                          <Check className="size-3.5 stroke-[2.5]" />
                        </span>
                        <span className="text-[14px] text-ink font-sans leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality & Management Guarantee */}
              <div className="mt-10 flex items-start gap-4 rounded-xl border border-amber-200 bg-amber-50/80 p-5">
                <ShieldCheck className="size-7 shrink-0 text-amber-800 mt-1" />
                <div className="text-sm">
                  <h4 className="font-bold text-amber-950">Hostel Warden Guarantee</h4>
                  <p className="mt-1 text-amber-900/90 leading-relaxed">
                    This facility is inspected, maintained, and operated under the direct daily supervision of our on-site warden to ensure safety, hygiene, and zero disruption for residents.
                  </p>
                </div>
              </div>
            </div>

            {/* Other Amenities Strip */}
            {others.length > 0 && (
              <div className="rounded-2xl bg-white p-8 border border-line shadow-sm">
                <h3 className="oswald text-[18px] font-medium text-ink mb-6">Explore Other Facilities</h3>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {others.slice(0, 6).map((other) => (
                    <Link
                      key={other.id}
                      href={`/facilities/${other.slug || other.id}`}
                      className="group flex items-center gap-3.5 p-3 rounded-xl border border-line transition hover:border-brand hover:bg-brand-soft"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sun text-ink transition group-hover:bg-brand group-hover:text-white">
                        <FacilityIcon name={other.icon} className="size-5 stroke-[1.5]" />
                      </span>
                      <div className="min-w-0">
                        <p className="oswald text-[13px] text-ink truncate transition group-hover:text-brand">{other.title}</p>
                        <p className="text-[11px] text-muted truncate">{other.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick Reservation Card */}
            <div className="sticky top-28 rounded-2xl bg-white p-7 shadow-sm border border-line space-y-6">
              <div>
                <p className="label-caps text-muted">Stay at {siteData.settings.hostel_name}</p>
                <h3 className="display mt-1 text-[2.2rem] text-ink">Reserve your bed</h3>
                <p className="mt-2 text-sm text-muted">
                  Admissions open for the 2026/2083 academic session. Single, double, triple & four seater rooms available.
                </p>
              </div>

              <div className="rounded-xl bg-sand/70 p-4 space-y-2 text-xs">
                <p className="font-bold text-ink">Included in every room fee:</p>
                <ul className="space-y-1.5 text-muted">
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-leaf" /> 4 Homely Meals Daily</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-leaf" /> High-speed Dual Band Wi-Fi</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-leaf" /> 24/7 Solar Hot Water</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-leaf" /> Rooftop Laundry Access</li>
                  <li className="flex items-center gap-2"><Check className="size-3.5 text-leaf" /> Quiet Study Hall Access</li>
                </ul>
              </div>

              {siteData.settings.phone && (
                <div className="space-y-3 pt-2">
                  <a
                    href={telHref(siteData.settings.phone)}
                    className="tbtn tbtn-dark w-full py-3.5 text-[11px] flex items-center justify-center gap-2"
                  >
                    <Phone className="size-4" /> Call {siteData.settings.phone}
                  </a>
                  {siteData.settings.whatsapp && (
                    <a
                      href={`https://wa.me/${siteData.settings.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="tbtn w-full bg-[#25D366] text-white hover:bg-[#128C7E] py-3.5 text-[11px] flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="size-4" /> Chat on WhatsApp
                    </a>
                  )}
                  <Link
                    href="/#enquiry"
                    className="tbtn tbtn-sun w-full py-3.5 text-[11px] flex items-center justify-center gap-2"
                  >
                    Online booking form <ArrowRight className="size-4" />
                  </Link>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
