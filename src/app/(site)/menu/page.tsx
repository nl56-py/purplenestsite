import type { Metadata } from "next";
import Link from "next/link";
import { Coffee, Sun, Moon, Sparkles, Check } from "lucide-react";
import { getSiteData } from "@/lib/data";
import { PageBanner } from "@/components/site/page-banner";
import { JsonLd } from "@/components/seo/json-ld";
import { generateBreadcrumbSchema } from "@/lib/seo-schema";
import { SITE_URL } from "@/lib/site-config";

export const revalidate = 300;

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const url = `${SITE_URL}/menu`;
  const title = `Food Menu & Dining | ${settings.hostel_name}`;
  const description = `Explore the 7-day healthy weekly meal menu at ${settings.hostel_name}. 4 fresh meals daily: breakfast, lunch, tiffin, and dinner cooked with RO purified water.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: ["/images/hero-rooftop.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/hero-rooftop.jpg"],
    },
  };
}

export default async function FoodMenuPage() {
  const { menu, settings } = await getSiteData();

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Weekly Food Menu", path: "/menu" },
  ]);

  const menuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${settings.hostel_name} Student Meal Menu`,
    description: "7-day meal schedule including breakfast, lunch dal bhat, afternoon tiffin snacks, and dinner.",
    url: `${SITE_URL}/menu`,
    hasMenuSection: menu.map((m) => {
      const dayLabel = typeof m.day === "number" ? DAY_NAMES[m.day] || `Day ${m.day}` : m.day;
      return {
        "@type": "MenuSection",
        name: dayLabel,
        hasMenuItem: [
          { "@type": "MenuItem", name: "Breakfast", description: m.breakfast },
          { "@type": "MenuItem", name: "Lunch (Dal Bhat)", description: m.lunch },
          { "@type": "MenuItem", name: "Afternoon Snacks", description: m.snacks },
          { "@type": "MenuItem", name: "Dinner", description: m.dinner },
        ],
      };
    }),
  };

  return (
    <>
      <JsonLd id="menu-breadcrumbs" data={breadcrumbs} />
      <JsonLd id="food-menu-schema" data={menuSchema} />

      <PageBanner
        title="Weekly Food Menu"
        label="homely meals cooked fresh daily"
        description="Nutritious, hygienic, and balanced meals tailored for students. Four meals served every single day with fresh local ingredients and RO purified water."
      />

      {/* 4 Daily Meal Times Overview */}
      <section className="border-b border-line bg-white py-12">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-line bg-sand/30 p-6 transition-all hover:border-brand">
              <div className="flex items-center gap-3">
                <Coffee className="size-6 text-brand" />
                <span className="oswald text-[12px] !tracking-[0.16em] uppercase text-brand font-semibold">Morning</span>
              </div>
              <h3 className="oswald mt-3 text-lg font-medium text-ink">Breakfast & Tea</h3>
              <p className="mt-1 text-xs text-muted">7:00 AM – 8:30 AM</p>
              <p className="mt-2 text-xs text-ink/80 font-serif">
                Milk tea / black tea with boiled eggs, toast, butter, jam, or Nepali chana-roti.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-sand/30 p-6 transition-all hover:border-brand">
              <div className="flex items-center gap-3">
                <Sun className="size-6 text-sun-dark" />
                <span className="oswald text-[12px] !tracking-[0.16em] uppercase text-sun-dark font-semibold">Midday</span>
              </div>
              <h3 className="oswald mt-3 text-lg font-medium text-ink">Morning Dal Bhat</h3>
              <p className="mt-1 text-xs text-muted">9:30 AM – 10:30 AM</p>
              <p className="mt-2 text-xs text-ink/80 font-serif">
                Steamed premium rice, yellow/black lentil dal, seasonal green curry, spicy achar & salad.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-sand/30 p-6 transition-all hover:border-brand">
              <div className="flex items-center gap-3">
                <Sparkles className="size-6 text-leaf" />
                <span className="oswald text-[12px] !tracking-[0.16em] uppercase text-leaf font-semibold">Afternoon</span>
              </div>
              <h3 className="oswald mt-3 text-lg font-medium text-ink">Tiffin & Snacks</h3>
              <p className="mt-1 text-xs text-muted">4:30 PM – 5:30 PM</p>
              <p className="mt-2 text-xs text-ink/80 font-serif">
                Chowmein, fried rice, samosa, pakoda, or noodles paired with freshly brewed hot tea.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-sand/30 p-6 transition-all hover:border-brand">
              <div className="flex items-center gap-3">
                <Moon className="size-6 text-ink" />
                <span className="oswald text-[12px] !tracking-[0.16em] uppercase text-ink font-semibold">Night</span>
              </div>
              <h3 className="oswald mt-3 text-lg font-medium text-ink">Dinner & Non-Veg</h3>
              <p className="mt-1 text-xs text-muted">8:00 PM – 9:00 PM</p>
              <p className="mt-2 text-xs text-ink/80 font-serif">
                Fresh warm rotis or rice, mixed vegetable curry, chicken/egg curry (weekly), and sweet curd.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7-Day Menu Grid */}
      <section className="py-16 md:py-24 bg-sand/20">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="text-center max-w-2xl mx-auto">
            <p className="oswald text-[11px] !tracking-[0.25em] text-brand uppercase font-semibold">
              Weekly Meal Schedule
            </p>
            <h2 className="display mt-2 text-[clamp(2.4rem,4vw,3.4rem)] text-ink">
              What We Serve Every Day
            </h2>
            <p className="mt-3 text-muted font-serif">
              Our menu is rotated seasonally to ensure dietary variety, high protein intake, and genuine homemade Nepali flavor.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {menu.map((day) => {
              const dayName = typeof day.day === "number" ? DAY_NAMES[day.day] || `Day ${day.day}` : day.day;
              return (
                <div
                  key={String(day.day)}
                  className="flex flex-col rounded-3xl border border-line bg-white p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:border-brand/40"
                >
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <h3 className="display text-2xl text-brand">{dayName}</h3>
                    <span className="oswald text-[11px] !tracking-[0.16em] rounded-full bg-sand px-3 py-1 uppercase text-muted font-bold">
                      4 Meals
                    </span>
                  </div>

                  <div className="mt-5 space-y-4 flex-1">
                    <div>
                      <span className="oswald text-[11px] !tracking-[0.16em] text-muted uppercase font-semibold flex items-center gap-1.5">
                        <Coffee className="size-3 text-sun-dark" /> Breakfast
                      </span>
                      <p className="mt-1 text-sm font-medium text-ink font-serif">{day.breakfast || "Chiya & Bread / Chana"}</p>
                    </div>

                    <div>
                      <span className="oswald text-[11px] !tracking-[0.16em] text-muted uppercase font-semibold flex items-center gap-1.5">
                        <Sun className="size-3 text-sun-dark" /> Lunch (Dal Bhat)
                      </span>
                      <p className="mt-1 text-sm font-medium text-ink font-serif">{day.lunch || "Bhat, Dal, Seasonal Tarkari, Achar"}</p>
                    </div>

                    <div>
                      <span className="oswald text-[11px] !tracking-[0.16em] text-muted uppercase font-semibold flex items-center gap-1.5">
                        <Sparkles className="size-3 text-leaf" /> Afternoon Tiffin / Snacks
                      </span>
                      <p className="mt-1 text-sm font-medium text-ink font-serif">{day.snacks || "Tea & Fresh Snack"}</p>
                    </div>

                    <div>
                      <span className="oswald text-[11px] !tracking-[0.16em] text-muted uppercase font-semibold flex items-center gap-1.5">
                        <Moon className="size-3 text-ink" /> Dinner
                      </span>
                      <p className="mt-1 text-sm font-medium text-ink font-serif">{day.dinner || "Roti / Rice, Dal, Tarkari"}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Kitchen Hygiene & Health Standards */}
      <section className="py-16 md:py-24 bg-white border-t border-line">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <p className="oswald text-[11px] !tracking-[0.25em] text-brand uppercase font-semibold">
                Kitchen Hygiene Standards
              </p>
              <h2 className="display mt-2 text-[clamp(2.2rem,3.8vw,3.2rem)] text-ink">
                Clean Cooking, Healthy Living
              </h2>
              <p className="mt-4 text-muted font-serif text-[16px] leading-relaxed">
                We believe student stamina and academic performance begin with hygienic cooking. Our commercial kitchen operates under strict hygiene guidelines overseen by the hostel warden.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="size-5 text-leaf shrink-0 mt-0.5" />
                  <div>
                    <h4 className="oswald text-base text-ink font-semibold">5-Stage RO + UV Drinking Water</h4>
                    <p className="text-xs text-muted">All cooking and personal drinking water is purified with certified commercial reverse osmosis filters.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="size-5 text-leaf shrink-0 mt-0.5" />
                  <div>
                    <h4 className="oswald text-base text-ink font-semibold">Strictly Fresh Vegetables Daily</h4>
                    <p className="text-xs text-muted">Vegetables and dairy are purchased fresh every morning from local Kathmandu farmers and verified vendors.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="size-5 text-leaf shrink-0 mt-0.5" />
                  <div>
                    <h4 className="oswald text-base text-ink font-semibold">Sanitized Dining & Cutlery</h4>
                    <p className="text-xs text-muted">Dining tables, plates, and utensils are washed with hot water and food-grade detergents after every meal service.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <Link href="/contact" className="tbtn tbtn-brand py-3.5 px-8">
                  Visit and Taste the Food
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border-4 border-sand shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={settings.promo_image || "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=1200&q=80"}
                alt="Hostel Nepali Meal"
                className="w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
