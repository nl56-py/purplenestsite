import {
  Bath, BedDouble, Bike, BookOpen, Bus, Cctv, Check, Clock, Coffee, Droplets, Dumbbell, Flame, GlassWater,
  Heart, Newspaper, Printer, Refrigerator, ShieldCheck, Shirt, Snowflake, Sofa, Sparkles, SquareParking,
  Stethoscope, Sun, Trees, Tv, Utensils, WashingMachine, Wifi, Zap, type LucideIcon,
} from "lucide-react";

/** Icons the admin can pick for a facility. Key is stored in the database. */
export const FACILITY_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  wifi: { icon: Wifi, label: "Wi-Fi" },
  utensils: { icon: Utensils, label: "Meals" },
  shield: { icon: ShieldCheck, label: "Security" },
  cctv: { icon: Cctv, label: "CCTV" },
  droplets: { icon: Droplets, label: "Hot water" },
  glass: { icon: GlassWater, label: "Drinking water" },
  book: { icon: BookOpen, label: "Study" },
  shirt: { icon: Shirt, label: "Laundry" },
  washing: { icon: WashingMachine, label: "Washing machine" },
  zap: { icon: Zap, label: "Power backup" },
  parking: { icon: SquareParking, label: "Parking" },
  bike: { icon: Bike, label: "Bike parking" },
  tv: { icon: Tv, label: "TV" },
  gym: { icon: Dumbbell, label: "Gym" },
  sun: { icon: Sun, label: "Rooftop / sunlight" },
  fan: { icon: Snowflake, label: "Fan / AC" },
  bath: { icon: Bath, label: "Bathroom" },
  bed: { icon: BedDouble, label: "Beds" },
  fridge: { icon: Refrigerator, label: "Refrigerator" },
  flame: { icon: Flame, label: "Heater / gas" },
  medical: { icon: Stethoscope, label: "First aid" },
  printer: { icon: Printer, label: "Printing" },
  newspaper: { icon: Newspaper, label: "Newspaper" },
  garden: { icon: Trees, label: "Garden" },
  clock: { icon: Clock, label: "24 hours" },
  bus: { icon: Bus, label: "Transport" },
  cleaning: { icon: Sparkles, label: "Cleaning" },
  coffee: { icon: Coffee, label: "Tea / coffee" },
  sofa: { icon: Sofa, label: "Common room" },
  heart: { icon: Heart, label: "Care" },
  check: { icon: Check, label: "Other" },
};

export function FacilityIcon({ name, className }: { name: string; className?: string }) {
  const Icon = FACILITY_ICONS[name]?.icon ?? Check;
  return <Icon className={className} aria-hidden />;
}

type SvgProps = { className?: string };

export function FacebookIcon({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
    </svg>
  );
}

export function InstagramIcon({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15V9l5.2 3L10 15z" />
    </svg>
  );
}

export function TiktokIcon({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 3c.3 2.2 1.6 3.6 3.9 3.8v2.6c-1.4.1-2.6-.3-3.9-1.1v5.3c0 6.8-7.4 8.9-10.4 4.1-1.9-3.1-.7-8.6 5.6-8.8v2.8c-.5.1-1 .2-1.4.4-1.4.5-2.2 1.3-2 2.9.4 3 5.9 3.9 5.5-2V3h2.7z" />
    </svg>
  );
}

export function WhatsappIcon({ className }: SvgProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
    </svg>
  );
}
