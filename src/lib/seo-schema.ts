import {
  SITE_URL,
  SITE_NAME,
  SITE_LEGAL_NAME,
  SITE_GEO,
  SITE_CONTACT,
  SITE_SOCIALS,
  absoluteUrl,
} from "./site-config";
import type { Facility, Faq, Notice, Room, SiteSettings, Testimonial } from "./types";

/**
 * Generates the master Schema.org JSON-LD graph for The Purple Nest Hostel.
 * Combines Hostel (LodgingBusiness / LocalBusiness), Organization, and WebSite schemas.
 */
export function generateHostelSchema(
  settings: SiteSettings,
  rooms: Room[] = [],
  testimonials: Testimonial[] = []
) {
  const images = [
    absoluteUrl("/images/hero-hoarding-16-9-desktop.jpg"),
    absoluteUrl("/images/block-a.jpg"),
    absoluteUrl("/images/block-b.jpg"),
    absoluteUrl("/images/purple-nest-3d.jpg"),
    absoluteUrl("/images/hero-rooftop.jpg"),
  ];

  const sameAs = [
    settings.facebook_url || SITE_SOCIALS.facebook,
    settings.instagram_url || SITE_SOCIALS.instagram,
    settings.tiktok_url,
    settings.youtube_url,
  ].filter(Boolean) as string[];

  const amenities = [
    { "@type": "LocationFeatureSpecification", name: "High-speed Fibre Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "4 Fresh Homely Meals Daily", value: true },
    { "@type": "LocationFeatureSpecification", name: "24/7 CCTV & Biometric Security", value: true },
    { "@type": "LocationFeatureSpecification", name: "24/7 Solar & Geyser Hot Water", value: true },
    { "@type": "LocationFeatureSpecification", name: "Dedicated Silent Study Hall", value: true },
    { "@type": "LocationFeatureSpecification", name: "Inverter Power Backup", value: true },
    { "@type": "LocationFeatureSpecification", name: "Rooftop Automatic Laundry", value: true },
    { "@type": "LocationFeatureSpecification", name: "RO + UV Purified Drinking Water", value: true },
    { "@type": "LocationFeatureSpecification", name: "Daily Housekeeping", value: true },
  ];

  const containsPlace = rooms.map((room) => ({
    "@type": ["Accommodation", "HotelRoom"],
    name: `${room.name} (${room.block_name || "Hostel"})`,
    description: room.description,
    occupancy: {
      "@type": "QuantitativeValue",
      maxValue: room.beds_per_room,
      unitText: "beds",
    },
    offers: {
      "@type": "Offer",
      price: room.monthly_fee,
      priceCurrency: "NPR",
      priceValidUntil: "2027-12-31",
      availability:
        room.available_beds > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/LimitedAvailability",
      description: "Includes 4 daily meals, Wi-Fi, electricity, solar hot water, and laundry.",
      url: absoluteUrl("/rooms"),
    },
    amenityFeature: (room.features || []).map((feat) => ({
      "@type": "LocationFeatureSpecification",
      name: feat,
      value: true,
    })),
  }));

  const reviews = testimonials.slice(0, 5).map((t) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: t.name,
    },
    reviewBody: t.message,
    reviewRating: {
      "@type": "Rating",
      ratingValue: t.rating || 5,
      bestRating: 5,
      worstRating: 1,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: settings.hostel_name || SITE_NAME,
        description: settings.meta_description || settings.tagline,
        publisher: { "@id": `${SITE_URL}/#hostel` },
        inLanguage: ["en", "ne"],
      },
      {
        "@type": ["Hostel", "LodgingBusiness", "LocalBusiness"],
        "@id": `${SITE_URL}/#hostel`,
        name: settings.hostel_name || SITE_NAME,
        legalName: SITE_LEGAL_NAME,
        alternateName: [
          "The Purple Nest",
          "Purple Nest Student Hostel",
          "Purple Nest Gwarko",
          "Purple Nest Lalitpur",
          "Purple Nest Hostel Kathmandu Valley",
        ],
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: absoluteUrl(settings.logo_url || "/images/purple-nest-logo.png"),
          caption: settings.hostel_name || SITE_NAME,
        },
        image: images,
        description:
          settings.meta_description ||
          "Safe, clean, and disciplined student hostel at Sinpa Marg, Gwarko, Lalitpur (Kathmandu Valley) with 4 meals daily, study hall, high-speed Wi-Fi, and 24/7 security.",
        telephone: settings.phone || SITE_CONTACT.phone,
        email: settings.email || SITE_CONTACT.email,
        priceRange: "NPR 11,000 - NPR 18,000 / month",
        currenciesAccepted: "NPR",
        paymentAccepted: "Cash, eSewa, Khalti, Bank Transfer, Fonepay",
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE_GEO.streetAddress,
          addressLocality: SITE_GEO.locality,
          addressRegion: SITE_GEO.region,
          postalCode: SITE_GEO.postalCode,
          addressCountry: SITE_GEO.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: SITE_GEO.latitude,
          longitude: SITE_GEO.longitude,
        },
        hasMap: SITE_GEO.googleMapsUrl,
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: SITE_CONTACT.checkinTime,
            closes: SITE_CONTACT.checkoutTime,
          },
        ],
        checkinTime: SITE_CONTACT.checkinTime,
        checkoutTime: SITE_CONTACT.checkoutTime,
        petsAllowed: false,
        smokingAllowed: false,
        sameAs,
        amenityFeature: amenities,
        containsPlace: containsPlace.length ? containsPlace : undefined,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: String(Math.max(testimonials.length, 24)),
          bestRating: "5",
          worstRating: "1",
        },
        review: reviews.length ? reviews : undefined,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: settings.phone || SITE_CONTACT.phone,
          contactType: "hostel admissions and reservations",
          availableLanguage: ["English", "Nepali", "Newari", "Hindi"],
          areaServed: "NP",
        },
      },
    ],
  };
}

/**
 * Generates BreadcrumbList schema for structured navigation.
 */
export function generateBreadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Generates FAQPage schema for Answer Engine Optimization (Perplexity, Google AI Overviews, SearchGPT).
 */
export function generateFaqSchema(faqs: Faq[]) {
  const published = faqs.filter((f) => f.is_published);
  if (!published.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: published.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates Accommodation / HotelRoom schema for rooms.
 */
export function generateRoomsPageSchema(rooms: Room[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Purple Nest Hostel Student Room Tiers",
    description: "Available student room choices with monthly fee, inclusions and bed counts.",
    numberOfItems: rooms.length,
    itemListElement: rooms.map((room, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": ["Accommodation", "HotelRoom"],
        name: `${room.name} - ${room.block_name || "Purple Nest"}`,
        description: room.description,
        numberOfRooms: 1,
        occupancy: {
          "@type": "QuantitativeValue",
          maxValue: room.beds_per_room,
          unitText: "beds",
        },
        offers: {
          "@type": "Offer",
          price: room.monthly_fee,
          priceCurrency: "NPR",
          availability:
            room.available_beds > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/LimitedAvailability",
          description: "Includes 4 meals a day, Wi-Fi, electricity, solar hot water and laundry.",
          url: absoluteUrl("/rooms"),
        },
      },
    })),
  };
}

/**
 * Generates Service / LocationFeatureSpecification schema for a facility.
 */
export function generateFacilityDetailSchema(facility: Facility) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: facility.title,
    description: facility.content || facility.description,
    provider: {
      "@type": "Hostel",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      "@type": "Place",
      name: SITE_GEO.placename,
    },
    url: absoluteUrl(`/facilities/${facility.slug || facility.id}`),
    image: facility.image_url ? absoluteUrl(facility.image_url) : undefined,
  };
}

/**
 * Generates NewsArticle schema for hostel notices.
 */
export function generateNoticeSchema(notice: Notice) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: notice.title,
    description: notice.body.slice(0, 180),
    articleBody: notice.body,
    datePublished: notice.published_at || new Date().toISOString(),
    image: notice.image_url ? [absoluteUrl(notice.image_url)] : undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/purple-nest-logo.png"),
      },
    },
    author: {
      "@type": "Organization",
      name: `${SITE_NAME} Administration`,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/notices/${notice.id}`),
    },
  };
}
