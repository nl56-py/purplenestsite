import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { Hero } from "@/components/site/hero";
import { About, Contact, Facilities, Faqs, NoticeBoard, PromoBanner, Rooms, Rules } from "@/components/site/sections";
import { Reviews } from "@/components/site/reviews";
import { Gallery } from "@/components/site/gallery";
import { MealMenu } from "@/components/site/meal-menu";
import { CallbackBand } from "@/components/site/callback-band";
import { NoticePopup } from "@/components/site/notice-popup";
import { JsonLd } from "@/components/seo/json-ld";
import { generateFaqSchema } from "@/lib/seo-schema";
import { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION } from "@/lib/site-config";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const title = `${settings.hostel_name} | Best Student Hostel in Lalitpur, Kathmandu`;
  const description = settings.meta_description || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: settings.hostel_name || SITE_NAME,
      type: "website",
      images: [
        {
          url: "/images/hero-exterior.jpg",
          width: 1200,
          height: 630,
          alt: `${settings.hostel_name} Student Hostel Kathmandu`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-exterior.jpg"],
    },
  };
}

export default async function HomePage() {
  const data = await getSiteData();
  const faqSchema = generateFaqSchema(data.faqs);

  return (
    <>
      {faqSchema && <JsonLd id="homepage-faqs-schema" data={faqSchema} />}
      <Hero settings={data.settings} rooms={data.rooms} />
      <About settings={data.settings} />
      <Rooms rooms={data.rooms} blocks={data.blocks} settings={data.settings} />
      <Reviews items={data.testimonials} />
      <Facilities facilities={data.facilities} />
      <PromoBanner settings={data.settings} />
      <MealMenu menu={data.menu} />
      <Gallery images={data.gallery} />
      <NoticeBoard notices={data.notices} />
      <Rules rules={data.rules} />
      <Faqs faqs={data.faqs} />
      <CallbackBand />
      <Contact settings={data.settings} rooms={data.rooms} />
      <NoticePopup notices={data.notices} />
    </>
  );
}
