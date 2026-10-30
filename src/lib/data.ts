import "server-only";
import { cache } from "react";
import { createPublicClient } from "./supabase/public";
import { isSupabaseConfigured } from "./supabase/env";
import type { Block, Facility, Faq, GalleryImage, MealDay, Notice, Room, Rule, SiteData, SiteSettings, Testimonial } from "./types";

export const DEFAULT_SETTINGS: SiteSettings = {
  id: 1,
  hostel_name: "The Purple Nest",
  hostel_type: "Student Hostel",
  tagline: "Safe, clean & homely stay for students in Gwarko, Lalitpur (Kathmandu Valley).",
  logo_url: "/images/purple-nest-icon.jpg",
  hero_slides: [
    {
      image: "/images/hero-exterior.jpg",
      title: "Study Hard, Live Easy",
      subtitle: "A safe, friendly home for students and working professionals — located in Gwarko, Lalitpur.",
    },
    {
      image: "/images/hero-room.jpg",
      title: "Homely Comfort in Kathmandu",
      subtitle: "Spacious, well-ventilated rooms with private study tables, daily cleaning and 24/7 solar hot water in Lalitpur.",
    },
    {
      image: "/images/hero-rooftop.jpg",
      title: "Admissions Open for 2026",
      subtitle: "Join our vibrant student community. Scenic rooftop lounge, quiet study hall & fresh homely meals.",
    },
  ],
  about_title: "Namaste!",
  about_text:
    "The Purple Nest Hostel has been designed to provide ambitious students and working professionals with a peaceful, safe, and vibrant home away from home at Sinpa Marg, Gwarko, Lalitpur.\n\nOur premises feature 24/7 CCTV surveillance, biometric security, dedicated supervision, and daily housekeeping. Fresh, hygienic meals prepared in our modern kitchen ensure residents stay energized and healthy throughout their journey.",
  about_image: "/images/hero-exterior.jpg",
  established_year: 2015,
  phone: "+977 976-1158651",
  phone_alt: null,
  whatsapp: "9779761158651",
  email: "stayatthepurplenest@gmail.com",
  address: "Sinpa Marg, Gwarko, Lalitpur, Bagmati Province 44700, Nepal",
  map_embed_url: "https://www.google.com/maps?q=27.668759882855277,85.33061044536188&output=embed",
  office_hours: "Every day, 7:00 AM – 8:00 PM",
  facebook_url: "https://www.facebook.com/profile.php?id=61589625489923",
  instagram_url: "https://instagram.com",
  tiktok_url: null,
  youtube_url: null,
  admission_open: true,
  price_note: "Fees include 4 daily meals, high-speed Wi-Fi, electricity, solar hot water, and laundry.",
  meta_description:
    "The Purple Nest Hostel, Sinpa Marg, Gwarko, Lalitpur (Kathmandu Valley) — safe, clean rooms with homely meals, high-speed Wi-Fi and 24/7 security. Admissions open.",
  theme_color: "#43106c",
  secondary_color: "#8b5cf6",
  promo_title: "Homely Meals Cooked Daily",
  promo_subtitle: "FRESH DAL BHAT, TASTY AFTERNOON SNACKS & HEALTHY NUTRITION INCLUDED IN YOUR MONTHLY FEE",
  promo_image: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1920&q=80",
  promo_badge_top: "meals",
  promo_badge_value: "4 / day",
  promo_button_label: "See Food Menu",
  promo_button_link: "#menu",
  updated_at: new Date(0).toISOString(),
};

export const DEMO_BLOCKS: Block[] = [
  {
    id: "block-a",
    name: "Block A",
    code: "A",
    gender_type: "All",
    description: "Main hostel block with attached bathrooms, large windows, and fast Wi-Fi.",
    image_url: null,
    sort_order: 1,
    is_published: true,
  },
  {
    id: "block-b",
    name: "Block B",
    code: "B",
    gender_type: "All",
    description: "Quiet residential block dedicated to peaceful study and comfortable living.",
    image_url: null,
    sort_order: 2,
    is_published: true,
  },
  {
    id: "block-c",
    name: "Block C",
    code: "C",
    gender_type: "All",
    description: "Affordable group rooms with great natural light and study desks.",
    image_url: null,
    sort_order: 3,
    is_published: true,
  },
];

export const DEMO_ROOMS: Room[] = [
  {
    id: "1",
    name: "Single Seater",
    block_name: "Block A",
    floor_name: "1st Floor",
    room_number: "101",
    description: "A private room for students who want full focus. Study table, chair, wardrobe, attached bathroom and large sunny window.",
    beds_per_room: 1,
    total_beds: 6,
    available_beds: 1,
    monthly_fee: 18000,
    admission_fee: 5000,
    features: ["Private room", "Attached bathroom", "Study desk & lamp", "Full wardrobe"],
    images: ["/images/hero-room.jpg"],
    is_published: true,
    sort_order: 1,
  },
  {
    id: "2",
    name: "Double Seater",
    block_name: "Block A",
    floor_name: "2nd Floor",
    room_number: "201",
    description: "Share with one roommate. Each student gets an individual bed, study table, and private wardrobe.",
    beds_per_room: 2,
    total_beds: 20,
    available_beds: 4,
    monthly_fee: 14500,
    admission_fee: 5000,
    features: ["Two separate beds", "Dedicated study desks", "Individual wardrobes", "Sunny window view"],
    images: ["/images/hero-room.jpg"],
    is_published: true,
    sort_order: 2,
  },
  {
    id: "3",
    name: "Triple Seater",
    block_name: "Block B",
    floor_name: "1st Floor",
    room_number: "B-102",
    description: "Our most popular choice — spacious, sunny, balcony access and budget friendly.",
    beds_per_room: 3,
    total_beds: 30,
    available_beds: 7,
    monthly_fee: 12500,
    admission_fee: 5000,
    features: ["Three beds", "Study desks", "Shoe rack", "Balcony access"],
    images: ["/images/hero-room.jpg"],
    is_published: true,
    sort_order: 3,
  },
  {
    id: "4",
    name: "Four Seater",
    block_name: "Block C",
    floor_name: "1st Floor",
    room_number: "C-104",
    description: "The most affordable option, ideal for friends and classmates joining together.",
    beds_per_room: 4,
    total_beds: 24,
    available_beds: 2,
    monthly_fee: 11000,
    admission_fee: 5000,
    features: ["Four beds", "Study tables", "Lockable wardrobes", "Airy & bright"],
    images: ["/images/hero-room.jpg"],
    is_published: true,
    sort_order: 4,
  },
];

export const DEMO_FACILITIES: Facility[] = [
  {
    id: "1",
    slug: "high-speed-wifi",
    title: "High-speed Wi-Fi",
    description: "Dedicated dual-band fibre on every floor for online classes & study.",
    image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80",
    icon: "wifi",
    is_published: true,
    sort_order: 1,
    highlights: [
      "Dual-band 5 GHz & 2.4 GHz coverage",
      "Separate dedicated router on every floor",
      "Redundant dual ISP backup line",
      "Inverter battery backup keeps Wi-Fi active 24/7",
      "Unlimited high bandwidth for video lectures and research",
    ],
    content:
      "In modern college education, reliable internet is as essential as textbooks. At The Purple Nest, we have installed enterprise-grade dual-band optical fibre connections with separate Wi-Fi access points on every single residential floor.\n\nWhether you are attending live Zoom or Microsoft Teams college lectures, submitting online programming assignments, downloading hefty engineering lecture slides, or preparing for medical, engineering, CMAT, and Loksewa entrance examinations, our redundant dual ISP network ensures maximum uptime with zero lag.\n\nFurthermore, our heavy-duty power backup system powers all network routers during city load-shedding, ensuring students never miss critical submission deadlines.",
  },
  {
    id: "2",
    slug: "homely-meals",
    title: "4 Homely Meals",
    description: "Fresh morning tea, dal bhat lunch, snacks and dinner cooked daily.",
    image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&q=80",
    icon: "utensils",
    is_published: true,
    sort_order: 2,
    highlights: [
      "4 meals daily (Breakfast, Lunch, Snacks, Dinner)",
      "Chicken curry twice a week & paneer options",
      "Fresh seasonal vegetables and green leafy saag",
      "Saturday special Momo feast & Khana set with curd",
      "Hygienic stainless steel kitchen inspected by warden",
    ],
    content:
      "Nothing replaces the comfort and nutrition of home-cooked food while living away from family. Our in-house kitchen prepares four wholesome meals every day using fresh market produce, premium basmati rice, and pure cooking oil.\n\nOur weekly meal rotation includes morning tea with biscuits or breakfast, authentic Nepali Dal Bhat with green seasonal saag and homemade pickles for lunch, afternoon snacks like hot momos, chowmein, samosas, and pakodas, and satisfying dinners featuring chicken curry on Wednesdays and Sundays, paneer on Fridays, and wholesome mixed curries throughout the week.\n\nHygiene is strictly maintained with stainless steel cookware, sanitized dining tables, and filtered water used for all food preparation.",
  },
  {
    id: "3",
    slug: "security-cctv",
    title: "24/7 Security & CCTV",
    description: "CCTV cameras, biometric entry, night guard and on-site warden.",
    image_url: "/images/hero-exterior.jpg",
    icon: "shield",
    is_published: true,
    sort_order: 3,
    highlights: [
      "HD CCTV cameras across all corridors, stairs and gates",
      "Biometric fingerprint entrance security",
      "Strict main gate closing at 8:30 PM",
      "Full-time resident on-site warden available 24/7",
      "Dedicated visitor verification in ground reception lounge",
    ],
    content:
      "Safety and peace of mind are our absolute top priority. The Purple Nest is equipped with an integrated multi-tier security framework to protect our residents day and night.\n\nAll public areas including the main gate, reception lobby, corridors, staircases, and rooftop terrace are covered by 24/7 high-definition CCTV cameras. Entry into the hostel building is regulated through a biometric fingerprint scanner, guaranteeing that only registered students and staff can access the living quarters.\n\nA dedicated hostel warden resides full-time on the premises to address any emergencies, health issues, or administrative concerns, assisted by a night security guard stationed at the entrance gate.",
  },
  {
    id: "4",
    slug: "solar-hot-water",
    title: "Solar & Geyser Hot Water",
    description: "Solar and geyser hot water available all year round.",
    image_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80",
    icon: "droplets",
    is_published: true,
    sort_order: 4,
    highlights: [
      "High-capacity rooftop solar thermal system",
      "Automated electric geyser backup for winter & overcast days",
      "Available 24/7 across all bathrooms",
      "Clean, sanitized pipelines and overhead water storage",
      "Eco-friendly renewable energy utilization",
    ],
    content:
      "Kathmandu mornings in winter can be brutally cold. We have engineered a dual solar and electric geyser heating infrastructure that ensures instant hot water is on tap 24 hours a day, 365 days a year.\n\nOur rooftop solar thermal arrays capture ample heat throughout sunny days, while automated high-capacity electric backup heaters kick in during cloudy spells or early frosty mornings. Students can shower comfortably at any hour before heading to early 6:00 AM college lectures.",
  },
  {
    id: "5",
    slug: "study-hall",
    title: "Quiet Study Hall",
    description: "A quiet, well-lit study hall open until midnight.",
    image_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&q=80",
    icon: "book",
    is_published: true,
    sort_order: 5,
    highlights: [
      "Strict silence policy strictly enforced",
      "Individual study carrels with personal glare-free LED lamps",
      "Multiple laptop/device charging points per desk",
      "Air-conditioned and well-ventilated quiet environment",
      "Open until 12:00 Midnight every night (extended during exams)",
    ],
    content:
      "Studying in a shared room can sometimes be distracting when roommates sleep or have different routines. Our dedicated ground-floor Study Hall provides a serene, noise-free sanctuary designed specifically for intense academic focus.\n\nThe hall features individual ergonomic study carrels with glare-free LED lamps, personal power sockets for laptops and tablets, high-speed Wi-Fi, and a reference book collection. Open daily until midnight (and extended hours during board exams), it is the favorite retreat for engineering, medical, and Loksewa aspirants.",
  },
  {
    id: "6",
    slug: "rooftop-laundry",
    title: "Rooftop Laundry",
    description: "Washing machines and sunny rooftop clothes drying terrace.",
    image_url: "/images/hero-rooftop.jpg",
    icon: "shirt",
    is_published: true,
    sort_order: 6,
    highlights: [
      "Fully automatic multi-cycle washing machines",
      "Expansive open and covered clothes drying terrace",
      "Designated weekly washing schedule per floor",
      "Spacious wash basins for quick personal handwash",
      "Sunny rooftop lounge area while you wait",
    ],
    content:
      "Managing laundry while balancing busy college schedules should be effortless. The Purple Nest provides a spacious, well-equipped laundry facility located on the open rooftop terrace.\n\nResidents have access to modern automatic washing machines on designated weekly schedules, along with extensive covered and open-air drying clotheslines. With Kathmandu's sunny rooftop weather, clothes dry quickly while students relax with panoramic views of the valley.",
  },
  {
    id: "7",
    slug: "power-backup",
    title: "Inverter Power Backup",
    description: "Inverter backup keeps lights and Wi-Fi on without interruption.",
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80",
    icon: "zap",
    is_published: true,
    sort_order: 7,
    highlights: [
      "Pure sine-wave heavy duty inverter system",
      "Seamless millisecond automatic switchover",
      "Powers room lights, hallway lights & study desks",
      "Wi-Fi routers remain active during outages",
      "Regular weekly battery health inspection",
    ],
    content:
      "Power fluctuations and unexpected grid cuts should never interrupt your study sessions or online exam submissions. The Purple Nest is equipped with a high-capacity pure sine-wave inverter battery backup system.\n\nWhenever the municipal electricity grid goes down, the inverter switches over seamlessly within milliseconds. All room tube lights, study lamps, hallway illumination, emergency stair lights, and optical fibre Wi-Fi routers remain fully operational.",
  },
  {
    id: "8",
    slug: "ro-drinking-water",
    title: "RO Filtered Water",
    description: "Filtered RO purified drinking water on every floor.",
    image_url: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=1200&q=80",
    icon: "glass",
    is_published: true,
    sort_order: 8,
    highlights: [
      "5-stage RO + UV + TDS filtration technology",
      "Dedicated water stations on every single floor",
      "Instant Hot and Normal temperature taps",
      "Monthly filter replacement and water quality testing",
      "Unlimited access 24/7",
    ],
    content:
      "Clean drinking water is the cornerstone of student health and prevents seasonal waterborne illnesses. We have installed commercial-grade 5-stage Reverse Osmosis (RO) with Ultraviolet (UV) water filtration dispensers on every floor.\n\nStudents can refill their personal water bottles anytime with 100% pure, bacteria-free water. In the winter months, hot and warm water dispensing options are also available directly on the dispenser taps.",
  },
];

export const DEMO_GALLERY: GalleryImage[] = [
  { id: "g1", image_url: "/images/hero-exterior.jpg", caption: "Hostel building at Sinpa Marg, Gwarko, Lalitpur", category: "Building", sort_order: 1, storage_path: null },
  { id: "g2", image_url: "/images/hero-room.jpg", caption: "Double seater student room", category: "Rooms", sort_order: 2, storage_path: null },
  { id: "g3", image_url: "/images/hero-rooftop.jpg", caption: "Rooftop evening tea & student hangout", category: "Life", sort_order: 3, storage_path: null },
  { id: "g4", image_url: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&q=80", caption: "Authentic Nepali Dal Bhat Thali", category: "Dining", sort_order: 4, storage_path: null },
  { id: "g5", image_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80", caption: "Saturday fresh momo feast", category: "Dining", sort_order: 5, storage_path: null },
  { id: "g6", image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=80", caption: "Quiet study hall", category: "Study", sort_order: 6, storage_path: null },
  { id: "g7", image_url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1200&q=80", caption: "Triple seater room with balcony", category: "Rooms", sort_order: 7, storage_path: null },
  { id: "g8", image_url: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=80", caption: "Collaborative group study", category: "Study", sort_order: 8, storage_path: null },
  { id: "g9", image_url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&q=80", caption: "Weekend hostel tournament", category: "Life", sort_order: 9, storage_path: null },
  { id: "g10", image_url: "https://images.unsplash.com/photo-1552858725-a019f14f0cec?w=1200&q=80", caption: "Clean interior corridor", category: "Building", sort_order: 10, storage_path: null },
  { id: "g11", image_url: "/images/hero-room.jpg", caption: "Study desk and bookshelf", category: "Rooms", sort_order: 11, storage_path: null },
  { id: "g12", image_url: "/images/hero-rooftop.jpg", caption: "Kathmandu Valley view", category: "Life", sort_order: 12, storage_path: null },
];

export const DEMO_MENU: MealDay[] = [
  { day: 0, breakfast: "Tea, biscuits", lunch: "Dal bhat, seasonal veg, tomato pickle", snacks: "Veg chowmein, tea", dinner: "Dal bhat, Chicken curry (or Paneer)" },
  { day: 1, breakfast: "Tea, bread & boiled egg", lunch: "Dal bhat, aloo tama bodi, saag", snacks: "Chiura, aloo chana tarkari", dinner: "Dal bhat, mixed veg curry" },
  { day: 2, breakfast: "Tea, biscuits", lunch: "Dal bhat, rayo ko saag, tomato pickle", snacks: "Crispy Samosa, tea", dinner: "Dal bhat, Egg curry" },
  { day: 3, breakfast: "Tea, hot puri tarkari", lunch: "Dal bhat, cauliflower curry, pickle", snacks: "Wai Wai noodles, tea", dinner: "Dal bhat, Chicken curry" },
  { day: 4, breakfast: "Tea, bread & jam", lunch: "Dal bhat, rajma dal, seasonal veg", snacks: "Chana chatpate, tea", dinner: "Dal bhat, Matar paneer" },
  { day: 5, breakfast: "Tea, biscuits", lunch: "Dal bhat, mushroom curry, radish pickle", snacks: "Hot onion & potato pakoda, tea", dinner: "Dal bhat, green veg, papad" },
  { day: 6, breakfast: "Tea, hot Sel Roti", lunch: "Special Khana Set with Dahi (curd)", snacks: "Steaming Chicken & Veg Momo", dinner: "Veg fried rice, egg soup" },
];

export const DEMO_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Aayush Shrestha",
    role: "BBS Student, Shanker Dev Campus",
    message: "Clean rooms, delicious homely dal bhat, and just an 8-minute walk to my college. The warden sir is strict about study hours but very caring. My parents are completely relieved.",
    rating: 5,
    photo_url: "/images/hero-rooftop.jpg",
    is_published: true,
    sort_order: 1,
  },
  {
    id: "t2",
    name: "Sujan Tamang",
    role: "+2 Science, St. Xavier's College",
    message: "The midnight study hall is a lifesaver during exams. The Wi-Fi never fluctuates during live online classes. Easily the best hostel experience in Kathmandu.",
    rating: 5,
    photo_url: "/images/hero-room.jpg",
    is_published: true,
    sort_order: 2,
  },
  {
    id: "t3",
    name: "Bikash Adhikari",
    role: "Loksewa Aspirant",
    message: "Homely food twice a day plus evening tea & snacks. Hot water is always available even in peak January mornings. Great value and peaceful environment.",
    rating: 5,
    photo_url: "/images/hero-exterior.jpg",
    is_published: true,
    sort_order: 3,
  },
];

export const DEMO_RULES: Rule[] = [
  { id: "r1", category: "General", content: "The main hostel gate closes sharply at 8:30 PM. Late entry requires prior written permission from the hostel warden.", sort_order: 1 },
  { id: "r2", category: "General", content: "Visitors and guardians are allowed strictly in the reception lounge between 9:00 AM and 6:00 PM.", sort_order: 2 },
  { id: "r3", category: "General", content: "Smoking, alcohol, drugs, or gambling are strictly prohibited on the premises with immediate expulsion.", sort_order: 3 },
  { id: "r4", category: "Rooms", content: "Keep personal rooms clean and tidy. Rooms are inspected every Saturday morning.", sort_order: 4 },
  { id: "r5", category: "Rooms", content: "Switch off lights, fans, mobile/laptop chargers, and heaters when leaving the room.", sort_order: 5 },
  { id: "r6", category: "Rooms", content: "Cooking or using electric heaters/induction stoves inside rooms is strictly prohibited.", sort_order: 6 },
  { id: "r7", category: "Fees", content: "Monthly hostel fees must be cleared by the 10th of each Nepali month.", sort_order: 7 },
  { id: "r8", category: "Fees", content: "One month's prior written notice is required before leaving. The security deposit is refunded after clearance.", sort_order: 8 },
  { id: "r9", category: "Study", content: "Silence hours are strictly observed from 9:00 PM to 6:00 AM. Please respect fellow roommates' study time.", sort_order: 9 },
];

export const DEMO_FAQS: Faq[] = [
  { id: "f1", question: "What is included in the monthly fee?", answer: "The monthly fee includes your bed, 4 meals a day (morning tea, lunch, afternoon snacks, dinner), high-speed fiber Wi-Fi, 24/7 hot water, electricity, and room cleaning. Laundry detergent and personal toiletries are not included.", is_published: true, sort_order: 1 },
  { id: "f2", question: "Is there an admission fee or security deposit?", answer: "Yes. A one-time admission fee of Rs. 5,000 is charged upon joining, plus a refundable security deposit equal to one month's fee.", is_published: true, sort_order: 2 },
  { id: "f3", question: "Can parents and guardians visit?", answer: "Of course! Parents and guardians are always welcome in our visitor lounge any day between 9:00 AM and 6:00 PM.", is_published: true, sort_order: 3 },
  { id: "f4", question: "How do I book a bed?", answer: "Fill in the reservation form on this page or call us directly. We will confirm bed availability and arrange a physical tour of the hostel.", is_published: true, sort_order: 4 },
  { id: "f5", question: "What documents are needed for admission?", answer: "A copy of your citizenship card or college student ID, two passport-size photographs, and your parent/guardian's active phone number.", is_published: true, sort_order: 5 },
];

export const DEMO_NOTICES: Notice[] = [
  {
    id: "n1",
    title: "Admissions Open for Academic Session 2026/2083",
    body: "Admissions are now open for the new academic session. Limited beds are available in single, double and triple seater rooms. Visit the hostel between 7 AM and 8 PM or call us to book a visit. Early admissions get 10% off the admission fee.",
    is_pinned: true,
    show_as_popup: true,
    popup_until: new Date(Date.now() + 30 * 86400000).toISOString(),
    published_at: new Date().toISOString(),
    image_url: "/images/hero-exterior.jpg",
    is_published: true,
  },
  {
    id: "n2",
    title: "Dashain & Tihar Festive Schedule",
    body: "The hostel kitchen will remain closed from Ghatasthapana to Tika. Students staying during the holidays should inform the warden by this Friday.",
    is_pinned: false,
    show_as_popup: false,
    popup_until: null,
    published_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    image_url: "/images/hero-rooftop.jpg",
    is_published: true,
  },
  {
    id: "n3",
    title: "Water Tank Cleaning on Saturday",
    body: "Water supply will be paused from 10 AM to 2 PM this Saturday for routine overhead tank sanitation. Please store water in advance.",
    is_pinned: false,
    show_as_popup: false,
    popup_until: null,
    published_at: new Date(Date.now() - 7 * 86400000).toISOString(),
    image_url: null,
    is_published: true,
  },
];

export const DEMO_DATA: SiteData = {
  settings: DEFAULT_SETTINGS,
  blocks: DEMO_BLOCKS,
  rooms: DEMO_ROOMS,
  gallery: DEMO_GALLERY,
  facilities: DEMO_FACILITIES,
  rules: DEMO_RULES,
  notices: DEMO_NOTICES,
  menu: DEMO_MENU,
  testimonials: DEMO_TESTIMONIALS,
  faqs: DEMO_FAQS,
};

const isBuild = process.env.NEXT_PHASE === "phase-production-build";

/**
 * Everything the public site needs, in one round of parallel queries.
 * If Supabase is not configured yet, provides realistic Nepali hostel demo content.
 */
export const getSiteData = cache(async (): Promise<SiteData & { configured: boolean }> => {
  if (!isSupabaseConfigured) {
    return { ...DEMO_DATA, configured: false };
  }

  const sb = createPublicClient();
  const [settings, blocks, rooms, gallery, facilities, rules, notices, menu, testimonials, faqs] = await Promise.all([
    sb.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    sb.from("blocks").select("*").eq("is_published", true).order("sort_order").order("created_at"),
    sb.from("rooms").select("*").eq("is_published", true).order("sort_order").order("created_at"),
    sb.from("gallery_images").select("*").order("sort_order").order("created_at", { ascending: false }),
    sb.from("facilities").select("*").eq("is_published", true).order("sort_order").order("created_at"),
    sb.from("rules").select("*").order("sort_order").order("created_at"),
    sb
      .from("notices")
      .select("*")
      .eq("is_published", true)
      .order("is_pinned", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(30),
    sb.from("meal_menu").select("*").order("day"),
    sb.from("testimonials").select("*").eq("is_published", true).order("sort_order").order("created_at"),
    sb.from("faqs").select("*").eq("is_published", true).order("sort_order").order("created_at"),
  ]);

  const firstError = [settings, blocks, rooms, gallery, facilities, rules, notices, menu, testimonials, faqs].find((r) => r.error)?.error;
  if (firstError) {
    if (isBuild) {
      console.warn("[site] Supabase not reachable during build, rendering demo content:", firstError.message);
      return { ...DEMO_DATA, configured: false };
    }
    throw new Error(`Could not load site content: ${firstError.message}`);
  }

  return {
    configured: true,
    settings: { ...DEFAULT_SETTINGS, ...(settings.data ?? {}) },
    blocks: blocks.data?.length ? blocks.data : DEMO_BLOCKS,
    rooms: rooms.data?.length ? rooms.data : DEMO_ROOMS,
    gallery: gallery.data?.length ? gallery.data : DEMO_GALLERY,
    facilities: facilities.data?.length ? facilities.data : DEMO_FACILITIES,
    rules: rules.data?.length ? rules.data : DEMO_RULES,
    notices: notices.data?.length ? notices.data : DEMO_NOTICES,
    menu: menu.data?.length ? menu.data : DEMO_MENU,
    testimonials: testimonials.data?.length ? testimonials.data : DEMO_TESTIMONIALS,
    faqs: faqs.data?.length ? faqs.data : DEMO_FAQS,
  };
});

export async function getNotice(id: string): Promise<Notice | null> {
  if (!isSupabaseConfigured || !/^[0-9a-f-]{36}$/i.test(id)) {
    return DEMO_NOTICES.find((n) => n.id === id) ?? null;
  }
  const { data } = await createPublicClient().from("notices").select("*").eq("id", id).eq("is_published", true).maybeSingle();
  return data;
}

export async function getFacility(slugOrId: string): Promise<Facility | null> {
  const norm = slugOrId.toLowerCase().trim();
  if (!isSupabaseConfigured) {
    return DEMO_FACILITIES.find((f) => f.slug?.toLowerCase() === norm || f.id === slugOrId) ?? null;
  }
  const sb = createPublicClient();
  const isUuid = /^[0-9a-f-]{36}$/i.test(slugOrId);
  const query = isUuid
    ? sb.from("facilities").select("*").eq("id", slugOrId).eq("is_published", true).maybeSingle()
    : sb.from("facilities").select("*").eq("slug", slugOrId).eq("is_published", true).maybeSingle();
  const { data } = await query;
  if (data) return data;
  return DEMO_FACILITIES.find((f) => f.slug?.toLowerCase() === norm || f.id === slugOrId) ?? null;
}

export async function getFacilities(): Promise<Facility[]> {
  if (!isSupabaseConfigured) return DEMO_FACILITIES;
  const { data } = await createPublicClient().from("facilities").select("*").eq("is_published", true).order("sort_order").order("created_at");
  return data?.length ? data : DEMO_FACILITIES;
}
