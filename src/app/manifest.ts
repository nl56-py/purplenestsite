import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - Student Accommodation Kathmandu`,
    short_name: "Purple Nest",
    description: SITE_TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#43106c",
    icons: [
      {
        src: "/images/purple-nest-icon.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/images/purple-nest-icon.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
