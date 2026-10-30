import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { FloatingContact } from "@/components/site/floating-contact";
import { AvailabilityBanner } from "@/components/site/availability-banner";
import { DemoBanner } from "@/components/site/demo-banner";
import { JsonLd } from "@/components/seo/json-ld";
import { generateHostelSchema } from "@/lib/seo-schema";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const title = `${settings.hostel_name} | ${settings.hostel_type}${settings.address ? `, ${settings.address.split(",")[0]}` : ""}`;
  const description = settings.meta_description || settings.tagline;
  const image = settings.hero_slides[0]?.image || "/images/hero-exterior.jpg";

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s | ${settings.hostel_name}` },
    description,
    alternates: {
      canonical: SITE_URL,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: SITE_URL,
      siteName: settings.hostel_name,
      locale: "en_NP",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${settings.hostel_name} student hostel exterior`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    icons: settings.logo_url ? { icon: settings.logo_url } : undefined,
  };
}

const HEX = /^#[0-9a-f]{6}$/i;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings, notices, rooms, testimonials } = await getSiteData();
  const brand = HEX.test(settings.theme_color) ? settings.theme_color : "#fd7444";
  const leaf = HEX.test(settings.secondary_color) ? settings.secondary_color : "#8cbb6a";
  const hostelSchema = generateHostelSchema(settings, rooms, testimonials);

  return (
    <div style={{ ["--brand" as string]: brand, ["--leaf" as string]: leaf }} className="site flex min-h-screen flex-col">
      <JsonLd id="hostel-main-schema" data={hostelSchema} />
      <DemoBanner />
      <SiteHeader settings={settings} hasNotices={notices.length > 0} />
      <main className="flex-1">{children}</main>
      <SiteFooter settings={settings} />
      <FloatingContact settings={settings} />
      <AvailabilityBanner
        initialRooms={rooms}
        initialAdmissionOpen={settings.admission_open}
        whatsapp={settings.whatsapp}
      />
    </div>
  );
}
