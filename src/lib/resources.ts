import { FACILITY_ICONS } from "./icons";

/**
 * Field definitions for the simple list-style content types. The admin forms,
 * validation and saving are all generated from this one file — to add a field,
 * add a column in supabase/schema.sql and describe it here.
 */
export type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "icon" | "datetime" | "tags" | "image" | "images";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  nullable?: boolean;
  help?: string;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  maxLength?: number;
  half?: boolean;
  default?: string | number | boolean;
};

export type Resource = {
  key: string;
  table: string;
  title: string;
  singular: string;
  description: string;
  fields: Field[];
  /** Newest-first lists (notices) are ordered by date instead of manual order. */
  order: { column: string; ascending: boolean }[];
  sortable: boolean;
  publishField?: string;
  label: (row: Record<string, unknown>) => string;
  sub?: (row: Record<string, unknown>) => string;
  validate?: (row: Record<string, unknown>) => string | null;
};

export const RESOURCES: Record<string, Resource> = {
  rooms: {
    key: "rooms",
    table: "rooms",
    title: "Rooms & beds",
    singular: "room type",
    description: "Room types, fees and how many beds are free. Visitors see availability live on the website.",
    sortable: true,
    publishField: "is_published",
    order: [{ column: "sort_order", ascending: true }, { column: "created_at", ascending: true }],
    label: (r) => String(r.name),
    fields: [
      { name: "name", label: "Room type name", type: "text", required: true, placeholder: "Triple Seater", maxLength: 80 },
      { name: "beds_per_room", label: "Beds per room (seater)", type: "number", required: true, min: 1, max: 20, default: 2, half: true },
      { name: "monthly_fee", label: "Monthly fee (Rs.)", type: "number", required: true, min: 0, default: 0, half: true },
      { name: "total_beds", label: "Total beds of this type", type: "number", required: true, min: 0, default: 0, half: true },
      { name: "available_beds", label: "Beds available now", type: "number", required: true, min: 0, default: 0, half: true },
      { name: "admission_fee", label: "Admission fee (Rs., optional)", type: "number", nullable: true, min: 0, half: true },
      { name: "is_published", label: "Show on website", type: "checkbox", default: true, half: true },
      { name: "description", label: "Description", type: "textarea", maxLength: 600 },
      { name: "features", label: "Features", type: "tags", help: "One per line, e.g. Attached bathroom" },
      { name: "images", label: "Photos", type: "images", help: "The first photo is shown on the room card." },
    ],
    validate: (r) =>
      Number(r.available_beds) > Number(r.total_beds) ? "Available beds cannot be more than total beds." : null,
  },
  notices: {
    key: "notices",
    table: "notices",
    title: "Notices",
    singular: "notice",
    description: "Announcements for students and parents. Turn on “Show as popup” to greet visitors with it.",
    sortable: false,
    publishField: "is_published",
    order: [{ column: "is_pinned", ascending: false }, { column: "published_at", ascending: false }],
    label: (r) => String(r.title),
    fields: [
      { name: "title", label: "Title", type: "text", required: true, maxLength: 150 },
      { name: "body", label: "Notice text", type: "textarea", maxLength: 5000 },
      { name: "image_url", label: "Image (optional)", type: "image", help: "Shown at the top of the popup and the notice page." },
      { name: "published_at", label: "Notice date", type: "datetime", required: true, half: true },
      { name: "is_published", label: "Published", type: "checkbox", default: true, half: true },
      { name: "is_pinned", label: "Pin to top", type: "checkbox", default: false, half: true },
      { name: "show_as_popup", label: "Show as popup on the website", type: "checkbox", default: false, half: true },
      { name: "popup_until", label: "Stop showing popup after", type: "datetime", nullable: true, help: "Leave empty to keep showing it until you turn it off." },
    ],
  },
  facilities: {
    key: "facilities",
    table: "facilities",
    title: "Facilities",
    singular: "facility",
    description: "What students get — Wi-Fi, meals, security and so on.",
    sortable: true,
    publishField: "is_published",
    order: [{ column: "sort_order", ascending: true }, { column: "created_at", ascending: true }],
    label: (r) => String(r.title),
    sub: (r) => String(r.description ?? ""),
    fields: [
      { name: "title", label: "Title", type: "text", required: true, maxLength: 80, half: true },
      { name: "slug", label: "URL Slug (e.g. high-speed-wifi)", type: "text", required: true, maxLength: 80, half: true, placeholder: "high-speed-wifi" },
      { name: "icon", label: "Icon", type: "icon", options: Object.keys(FACILITY_ICONS), default: "check", half: true },
      { name: "is_published", label: "Show on website", type: "checkbox", default: true, half: true },
      { name: "image_url", label: "Facility Photo", type: "image", help: "High-resolution photo for the facility page and card." },
      { name: "description", label: "Short description (shown on home page cards)", type: "textarea", maxLength: 300 },
      { name: "content", label: "Detailed description (shown on individual facility page)", type: "textarea", maxLength: 5000, help: "Leave a blank line between paragraphs." },
      { name: "highlights", label: "Key Highlights / Features", type: "tags", help: "One feature per line, e.g. 24/7 Solar & Geyser Backup" },
    ],
  },
  rules: {
    key: "rules",
    table: "rules",
    title: "Hostel rules",
    singular: "rule",
    description: "Rules are grouped by category on the website.",
    sortable: true,
    order: [{ column: "sort_order", ascending: true }, { column: "created_at", ascending: true }],
    label: (r) => String(r.content),
    sub: (r) => String(r.category),
    fields: [
      { name: "category", label: "Category", type: "text", required: true, default: "General", placeholder: "General, Rooms, Fees…", maxLength: 40 },
      { name: "content", label: "Rule", type: "textarea", required: true, maxLength: 500 },
    ],
  },
  testimonials: {
    key: "testimonials",
    table: "testimonials",
    title: "Testimonials",
    singular: "testimonial",
    description: "Reviews from real students or parents. Only add reviews you have permission to publish.",
    sortable: true,
    publishField: "is_published",
    order: [{ column: "sort_order", ascending: true }, { column: "created_at", ascending: true }],
    label: (r) => String(r.name),
    sub: (r) => String(r.message ?? ""),
    fields: [
      { name: "name", label: "Name", type: "text", required: true, maxLength: 80, half: true },
      { name: "role", label: "Role", type: "text", placeholder: "BBS student", maxLength: 80, half: true },
      { name: "message", label: "Review", type: "textarea", required: true, maxLength: 600 },
      { name: "rating", label: "Rating (1–5)", type: "number", min: 1, max: 5, default: 5, half: true },
      { name: "is_published", label: "Show on website", type: "checkbox", default: true, half: true },
      { name: "photo_url", label: "Photo (optional)", type: "image", help: "A square photo works best. Initials are shown if empty." },
    ],
  },
  faqs: {
    key: "faqs",
    table: "faqs",
    title: "FAQs",
    singular: "question",
    description: "Common questions from students and parents.",
    sortable: true,
    publishField: "is_published",
    order: [{ column: "sort_order", ascending: true }, { column: "created_at", ascending: true }],
    label: (r) => String(r.question),
    sub: (r) => String(r.answer ?? ""),
    fields: [
      { name: "question", label: "Question", type: "text", required: true, maxLength: 200 },
      { name: "answer", label: "Answer", type: "textarea", required: true, maxLength: 1500 },
      { name: "is_published", label: "Show on website", type: "checkbox", default: true },
    ],
  },
};

export function getResource(key: string) {
  return Object.prototype.hasOwnProperty.call(RESOURCES, key) ? RESOURCES[key] : null;
}
