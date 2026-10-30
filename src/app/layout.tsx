import type { Metadata, Viewport } from "next";
import "@fontsource/sansita/800-italic.css";
import "@fontsource/oswald/500.css";
import "@fontsource/oswald/700.css";
import "@fontsource/noto-serif/400.css";
import "@fontsource/noto-serif/400-italic.css";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_GEO,
} from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Student Hostel in Gwarko, Lalitpur (Kathmandu Valley)`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "accommodation",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_NP",
    alternateLocale: ["en_US", "ne_NP"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Safe & Homely Student Stay in Gwarko, Lalitpur (Kathmandu Valley)`,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Official Student Hostel in Gwarko, Lalitpur with 3 Blocks (Block A, B & C)`,
      },
      {
        url: "/images/og-image-square.jpg",
        width: 600,
        height: 600,
        alt: `${SITE_NAME} Official Logo & Admissions`,
      },
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: `${SITE_NAME} Logo`,
      },
      {
        url: "/images/block-a.jpg",
        width: 894,
        height: 1496,
        alt: `${SITE_NAME} Block A Building at Sinpa Marg, Gwarko, Lalitpur`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Student Hostel in Gwarko, Lalitpur`,
    description: DEFAULT_DESCRIPTION,
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
    ],
  },
  manifest: "/manifest.webmanifest",
  other: {
    "geo.region": SITE_GEO.region,
    "geo.placename": SITE_GEO.placename,
    "geo.position": `${SITE_GEO.latitude};${SITE_GEO.longitude}`,
    "ICBM": SITE_GEO.icbm,
    "format-detection": "telephone=yes, address=yes, email=yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "Purple Nest",
    "theme-color": "#43106c",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#43106c",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
