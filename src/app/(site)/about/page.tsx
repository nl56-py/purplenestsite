import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, BookOpen, Utensils, MapPin, Award, HeartHandshake } from "lucide-react";
import { getSiteData } from "@/lib/data";
import { PageBanner } from "@/components/site/page-banner";
import { Reviews } from "@/components/site/reviews";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbSchema } from "@/lib/seo-schema";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const url = `${SITE_URL}/about`;
  const title = `About Us | ${settings.hostel_name}`;
  const description = `Learn about ${settings.hostel_name} at Sinpa Marg, Gwarko, Lalitpur (Kathmandu Valley). A safe, clean, and disciplined student hostel established in ${settings.established_year || 2015} with 4 daily meals and 24/7 security.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: ["/images/hero-exterior.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-exterior.jpg"],
    },
  };
}

export default async function AboutPage() {
  const { settings, testimonials } = await getSiteData();

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ]);

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${settings.hostel_name}`,
    description: `Story, mission and academic living standards at ${settings.hostel_name} in Pilachhen, Lalitpur.`,
    url: `${SITE_URL}/about`,
    mainEntity: {
      "@id": `${SITE_URL}/#hostel`,
    },
  };

  return (
    <>
      <JsonLd id="about-breadcrumbs" data={breadcrumbs} />
      <JsonLd id="about-page-schema" data={aboutSchema} />
      <PageBanner
        title={`About ${settings.hostel_name}`}
        label="your second home in kathmandu"
        description="Providing ambitious students from across Nepal with a safe, distraction-free, and healthy living environment since 2015."
      />

      {/* Main Story & Philosophy */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            {/* Story text */}
            <div>
              <p className="oswald text-[11px] !tracking-[0.25em] text-brand uppercase font-semibold">
                Welcome to our hostel
              </p>
              <h2 className="display mt-2 text-[clamp(2.4rem,4.2vw,3.6rem)] leading-tight text-ink">
                {settings.about_title || "Namaste & Welcome"}
              </h2>

              <div className="mt-6 space-y-4 font-serif text-[16px] md:text-[17px] text-muted leading-relaxed">
                {(settings.about_text || "")
                  .split("\n\n")
                  .filter(Boolean)
                  .map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
              </div>

              {/* Quick stats pills */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-line pt-8">
                <div>
                  <span className="display text-3xl text-brand">{settings.established_year || 2015}</span>
                  <p className="text-xs text-muted uppercase tracking-wider mt-1">Established</p>
                </div>
                <div>
                  <span className="display text-3xl text-sun-dark">500+</span>
                  <p className="text-xs text-muted uppercase tracking-wider mt-1">Happy Alumni</p>
                </div>
                <div>
                  <span className="display text-3xl text-leaf">24/7</span>
                  <p className="text-xs text-muted uppercase tracking-wider mt-1">Warden On-site</p>
                </div>
                <div>
                  <span className="display text-3xl text-ink">4 Meals</span>
                  <p className="text-xs text-muted uppercase tracking-wider mt-1">Cooked Daily</p>
                </div>
              </div>
            </div>

            {/* Photo & Badge */}
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border-4 border-white shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settings.about_image || "/images/hero-exterior.jpg"}
                  alt={settings.hostel_name}
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>

              {/* Floating verified badge */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 rounded-2xl bg-brand p-5 text-white shadow-xl">
                <Award className="size-10 text-sun shrink-0" />
                <div>
                  <p className="oswald text-[12px] !tracking-[0.16em] uppercase text-sun">Registered & Verified</p>
                  <p className="text-sm font-semibold">Government Certified Hostel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of The Purple Nest */}
      <section className="py-16 md:py-24 bg-sand/30 border-y border-line">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="text-center max-w-2xl mx-auto">
            <p className="oswald text-[11px] !tracking-[0.25em] text-brand uppercase font-semibold">
              Our Core Pillars
            </p>
            <h2 className="display mt-2 text-[clamp(2.2rem,3.8vw,3.2rem)] text-ink">
              Why Students & Parents Trust Us
            </h2>
            <p className="mt-3 text-muted font-serif">
              Every system in our hostel is organized around high academic achievement, personal security, and wholesome nutrition.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-7 border border-line shadow-sm">
              <div className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand">
                <ShieldCheck className="size-6" />
              </div>
              <h3 className="oswald mt-5 text-[19px] font-medium text-ink">Uncompromised Safety</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Biometric door entrance, 24/7 CCTV surveillance covering all corridors and exits, and full-time resident warden supervision.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 border border-line shadow-sm">
              <div className="grid size-12 place-items-center rounded-xl bg-sun/20 text-ink">
                <BookOpen className="size-6 text-sun-dark" />
              </div>
              <h3 className="oswald mt-5 text-[19px] font-medium text-ink">Academic Ambience</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Strict evening study silence hours, dedicated late-night study room with individual charging points, and high-speed Wi-Fi.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 border border-line shadow-sm">
              <div className="grid size-12 place-items-center rounded-xl bg-leaf/15 text-leaf">
                <Utensils className="size-6" />
              </div>
              <h3 className="oswald mt-5 text-[19px] font-medium text-ink">Homely Nutrition</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Four healthy, freshly prepared meals a day including morning breakfast, afternoon snacks, and hearty Dal Bhat with RO water.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 border border-line shadow-sm">
              <div className="grid size-12 place-items-center rounded-xl bg-amber-500/10 text-amber-700">
                <MapPin className="size-6" />
              </div>
              <h3 className="oswald mt-5 text-[19px] font-medium text-ink">Prime Lalitpur Location</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Located at Sinpa Marg, Gwarko, Lalitpur, with quick access to Ring Road, Gwarko Chowk, Patan, Kathmandu Valley colleges, and daily conveniences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Warden's Note */}
      <section className="py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-[900px] px-5">
          <div className="rounded-3xl border-2 border-sun/40 bg-gradient-to-br from-sand/40 to-white p-8 md:p-12 shadow-sm">
            <HeartHandshake className="size-10 text-brand mb-4" />
            <p className="oswald text-[11px] !tracking-[0.25em] text-brand uppercase font-semibold">
              A Personal Note from the Hostel Warden
            </p>
            <h3 className="display mt-2 text-[clamp(1.8rem,3vw,2.5rem)] text-ink">
              “We Treat Every Student Like Our Own Child”
            </h3>
            <p className="mt-4 font-serif text-[16px] text-ink/80 leading-relaxed italic">
              “Moving to Kathmandu for higher studies is a defining milestone in a young person’s life. As parents ourselves, we know that peace of mind comes from knowing your son or daughter is eating healthy food, getting quality sleep, and surrounded by motivated peers. Our doors and phone lines are always open to parents 24/7.”
            </p>
            <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4">
              <div>
                <p className="oswald text-base text-ink font-bold">Hostel Administration & Warden Team</p>
                <p className="text-xs text-muted">{settings.hostel_name} Team</p>
              </div>
              <Link href="/contact" className="tbtn tbtn-brand py-2.5 px-6 text-xs !tracking-[0.16em]">
                Schedule a Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <Reviews items={testimonials} />

      {/* Bottom CTA */}
      <section className="py-16 bg-ink text-white text-center">
        <div className="mx-auto max-w-[800px] px-5">
          <h2 className="display text-[clamp(2.2rem,3.8vw,3.2rem)]">Ready to Join {settings.hostel_name}?</h2>
          <p className="mt-3 text-white/80 font-serif text-base">
            Check our room options, transparent fee structures, and current seat availability.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/rooms" className="tbtn tbtn-sun px-8 py-3.5">
              Explore Rooms & Fees
            </Link>
            <Link href="/contact" className="tbtn tbtn-ghost px-8 py-3.5 border-white/30 text-white hover:bg-white hover:text-ink">
              Contact Us Today
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
