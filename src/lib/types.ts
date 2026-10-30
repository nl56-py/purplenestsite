export type HeroSlide = { image: string; title: string; subtitle: string };

export type SiteSettings = {
  id: number;
  hostel_name: string;
  hostel_type: string;
  tagline: string;
  logo_url: string | null;
  hero_slides: HeroSlide[];
  about_title: string;
  about_text: string;
  about_image: string | null;
  established_year: number | null;
  phone: string | null;
  phone_alt: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  map_embed_url: string | null;
  office_hours: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;
  admission_open: boolean;
  price_note: string | null;
  meta_description: string | null;
  theme_color: string;
  secondary_color: string;
  promo_title: string;
  promo_subtitle: string;
  promo_image: string | null;
  promo_badge_top: string;
  promo_badge_value: string;
  promo_button_label: string;
  promo_button_link: string;
  updated_at: string;
};

export type Block = {
  id: string;
  name: string;
  code: string;
  gender_type: string;
  description: string;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
};

export type Floor = {
  id: string;
  block_id: string;
  name: string;
  floor_number: number;
  sort_order: number;
  created_at?: string;
};

export type Bed = {
  id: string;
  room_id: string;
  bed_number: string;
  is_occupied: boolean;
  notes?: string;
  sort_order: number;
  created_at?: string;
};

export type Room = {
  id: string;
  name: string;
  block_id?: string | null;
  floor_id?: string | null;
  block_name?: string;
  floor_name?: string;
  room_number?: string;
  description: string;
  beds_per_room: number;
  total_beds: number;
  available_beds: number;
  monthly_fee: number;
  admission_fee: number | null;
  features: string[];
  images: string[];
  is_published: boolean;
  sort_order: number;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  storage_path: string | null;
  caption: string;
  category: string;
  sort_order: number;
};

export type Facility = {
  id: string;
  title: string;
  slug?: string | null;
  description: string;
  content?: string | null;
  image_url?: string | null;
  highlights?: string[] | null;
  icon: string;
  is_published: boolean;
  sort_order: number;
};

export type Rule = { id: string; category: string; content: string; sort_order: number };

export type Notice = {
  id: string;
  title: string;
  body: string;
  image_url: string | null;
  is_published: boolean;
  is_pinned: boolean;
  show_as_popup: boolean;
  popup_until: string | null;
  published_at: string;
};

export type MealDay = { day: number; breakfast: string; lunch: string; snacks: string; dinner: string };

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  message: string;
  rating: number;
  photo_url: string | null;
  is_published: boolean;
  sort_order: number;
};

export type Faq = { id: string; question: string; answer: string; is_published: boolean; sort_order: number };

export type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  room_id: string | null;
  room_name: string | null;
  move_in_date: string | null;
  message: string | null;
  status: "new" | "contacted" | "closed";
  created_at: string;
};

export type SiteData = {
  settings: SiteSettings;
  blocks: Block[];
  rooms: Room[];
  gallery: GalleryImage[];
  facilities: Facility[];
  rules: Rule[];
  notices: Notice[];
  menu: MealDay[];
  testimonials: Testimonial[];
  faqs: Faq[];
};
