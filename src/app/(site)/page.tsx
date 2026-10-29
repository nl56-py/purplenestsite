import { getSiteData } from "@/lib/data";
import { Hero } from "@/components/site/hero";
import { About, Contact, Facilities, Faqs, NoticeBoard, PromoBanner, Rooms, Rules } from "@/components/site/sections";
import { Reviews } from "@/components/site/reviews";
import { Gallery } from "@/components/site/gallery";
import { MealMenu } from "@/components/site/meal-menu";
import { CallbackBand } from "@/components/site/callback-band";
import { NoticePopup } from "@/components/site/notice-popup";

export const revalidate = 300;

export default async function HomePage() {
  const data = await getSiteData();

  return (
    <>
      {!data.configured && (
        <div className="flex flex-wrap items-center justify-center gap-2 border-b border-amber-200 bg-amber-50/90 px-6 py-2.5 text-center text-xs text-amber-900">
          <span className="rounded bg-amber-200/90 px-2 py-0.5 font-bold uppercase tracking-wider text-[10px]">Demo Mode</span>
          <span>Displaying authentic Nepali hostel showcase content. Connect Supabase in <code className="font-mono font-semibold">.env.local</code> to activate live CMS database.</span>
        </div>
      )}
      <Hero settings={data.settings} rooms={data.rooms} />
      <About settings={data.settings} />
      <Rooms rooms={data.rooms} settings={data.settings} />
      <Reviews items={data.testimonials} />
      <Facilities facilities={data.facilities} />
      <PromoBanner settings={data.settings} />
      <MealMenu menu={data.menu} />
      <Gallery images={data.gallery} />
      <NoticeBoard notices={data.notices} />
      <Rules rules={data.rules} />
      <Faqs faqs={data.faqs} />
      <CallbackBand />
      <Contact settings={data.settings} rooms={data.rooms} />
      <NoticePopup notices={data.notices} />
    </>
  );
}
