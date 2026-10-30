import type { Metadata } from "next";
import Link from "next/link";
import { getSiteData } from "@/lib/data";
import { PageBanner } from "@/components/site/page-banner";
import { Gallery } from "@/components/site/gallery";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbSchema } from "@/lib/seo-schema";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const url = `${SITE_URL}/gallery`;
  const title = `Photo Gallery | ${settings.hostel_name}`;
  const description = `Take a photo tour of ${settings.hostel_name} in Gwarko, Lalitpur: Student bedrooms, quiet study hall, dining area, rooftop terrace, and building exterior.`;

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

export default async function GalleryPage() {
  const { gallery, settings } = await getSiteData();

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Photo Gallery", path: "/gallery" },
  ]);

  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${settings.hostel_name} Photo Gallery`,
    description: `Photos of hostel rooms, study halls, kitchen and building at ${settings.hostel_name}.`,
    url: `${SITE_URL}/gallery`,
    image: gallery.map((g) => ({
      "@type": "ImageObject",
      contentUrl: g.image_url.startsWith("http") ? g.image_url : `${SITE_URL}${g.image_url}`,
      caption: g.caption,
    })),
  };

  return (
    <>
      <JsonLd id="gallery-breadcrumbs" data={breadcrumbs} />
      <JsonLd id="photo-gallery-schema" data={gallerySchema} />

      <PageBanner
        title="Hostel Photo Gallery"
        label="explore our building, rooms & atmosphere"
        description="Take an authentic visual walkthrough of our premises, student rooms, hygienic kitchen, silent study areas, and panoramic rooftop lounge."
      />

      <div className="bg-sand/20 py-8">
        <Gallery images={gallery} />
      </div>

      {/* Visit Invitation */}
      <section className="py-16 bg-white border-t border-line text-center">
        <div className="mx-auto max-w-[800px] px-5">
          <p className="oswald text-[11px] !tracking-[0.25em] text-brand uppercase font-semibold">
            Want to see in person?
          </p>
          <h2 className="display mt-2 text-[clamp(2.2rem,3.8vw,3.2rem)] text-ink">
            Visit Us Anytime During Office Hours
          </h2>
          <p className="mt-3 text-muted font-serif text-base">
            Walk-in visits are welcome every day between 7:00 AM and 8:00 PM. Parents and students are encouraged to inspect our rooms, dining hall, and facilities firsthand.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="tbtn tbtn-brand px-10 py-3.5">
              Get Directions & Map
            </Link>
            <Link href="/rooms" className="tbtn tbtn-dark px-10 py-3.5">
              Check Bed Availability
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
