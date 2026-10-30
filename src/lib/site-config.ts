/**
 * The Purple Nest Hostel - Global Site & SEO Configuration
 * Canonical domain: thepurplenesthostel.com
 */

export const SITE_URL = "https://thepurplenesthostel.com";
export const SITE_DOMAIN = "thepurplenesthostel.com";
export const SITE_NAME = "The Purple Nest Hostel";
export const SITE_LEGAL_NAME = "The Purple Nest Hostel Pvt. Ltd.";
export const SITE_TAGLINE = "Safe, clean & homely stay for students in Gwarko, Lalitpur (Kathmandu Valley).";

export const DEFAULT_DESCRIPTION =
  "The Purple Nest Hostel at Sinpa Marg, Gwarko, Lalitpur (Kathmandu Valley) offers premium student accommodation with single, double, triple & 4-seater rooms, 4 hygienic meals daily, high-speed Wi-Fi, 24/7 solar hot water, quiet study hall, and biometric CCTV security. Admissions open.";

export const SITE_GEO = {
  region: "NP-P", // Bagmati Province, Nepal
  placename: "Sinpa Marg, Gwarko, Lalitpur, Kathmandu Valley, Nepal",
  locality: "Lalitpur",
  sublocality: "Gwarko",
  streetAddress: "Sinpa Marg, Gwarko",
  formattedAddress: "Sinpa Marg, Gwarko, Lalitpur, Bagmati Province 44700, Nepal",
  postalCode: "44700",
  country: "NP",
  countryName: "Nepal",
  latitude: 27.668759882855277,
  longitude: 85.33061044536188,
  icbm: "27.668760, 85.330610",
  googleMapsUrl: "https://www.google.com/maps?q=27.668759882855277,85.33061044536188&output=embed",
  googleMapsShareUrl: "https://www.google.com/maps?q=27.668759882855277,85.33061044536188",
};

export const SITE_CONTACT = {
  phone: "+977 976-1158651",
  phoneRaw: "+9779761158651",
  whatsapp: "9779761158651",
  email: "stayatthepurplenest@gmail.com",
  officeHours: "Monday to Sunday, 7:00 AM – 8:00 PM",
  checkinTime: "07:00",
  checkoutTime: "20:00",
};

export const SITE_SOCIALS = {
  facebook: "https://www.facebook.com/profile.php?id=61589625489923",
  instagram: "https://instagram.com",
};

export const SITE_KEYWORDS = [
  "Hostel in Gwarko",
  "Hostel in Gwarko Lalitpur",
  "Student Hostel Gwarko",
  "Hostel near Gwarko Chowk",
  "Hostel in Lalitpur",
  "Hostel in Kathmandu Valley",
  "The Purple Nest Hostel",
  "Purple Nest Hostel",
  "Purple Nest Gwarko",
  "Sinpa Marg Gwarko hostel",
  "Sinpa Marg Lalitpur hostel",
  "Boys Hostel Gwarko",
  "Girls Hostel Gwarko Lalitpur",
  "Student accommodation Gwarko",
  "Hostel near KMC Gwarko",
  "Hostel near Balkumari",
  "Hostel near Patan Lalitpur",
  "Hostel with food Lalitpur",
  "Hostel with study hall Lalitpur",
  "Safe student hostel Kathmandu Valley",
];

/**
 * Returns an absolute canonical URL for any relative path.
 */
export function absoluteUrl(path: string = "/"): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  if (cleanPath === "/") return SITE_URL;
  return `${SITE_URL}${cleanPath}`;
}
