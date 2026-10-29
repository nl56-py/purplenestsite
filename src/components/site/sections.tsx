import Link from "next/link";
import { ArrowRight, BellRing, Clock, Mail, MapPin, Phone, Pin, Star } from "lucide-react";
import type { Facility, Faq, Notice, Room, Rule, SiteSettings } from "@/lib/types";
import { availabilityLabel, formatDate, formatRs, telHref } from "@/lib/format";
import { FacilityIcon } from "@/lib/icons";
import { SectionHeading } from "./section-heading";
import { BookRoomButton } from "./book-room-button";
import { EnquiryForm } from "./enquiry-form";
import { Carousel } from "./carousel";
import { AwardBadge } from "./badge";

const WRAP = "mx-auto max-w-[1200px] px-5";

/* ---------------------------------------------------------------- Hello! */
export function About({ settings }: { settings: SiteSettings }) {
  if (!settings.about_text) return null;
  return (
    <section id="about" className="grid bg-sand lg:grid-cols-2">
      <div className="img-fallback relative min-h-[320px] lg:min-h-[640px]">
        {settings.about_image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={settings.about_image} alt={`Inside ${settings.hostel_name}`} className="absolute inset-0 size-full object-cover" loading="lazy" />
        )}
      </div>
      <div className="flex items-center px-5 py-16 sm:px-12 lg:px-20 lg:py-24">
        <div className="max-w-[520px]">
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div>
              <h2 className="display text-[clamp(3.4rem,6vw,4.6rem)] text-brand">{settings.about_title || "Namaste!"}</h2>
              <p className="label-caps mt-4 text-muted">welcome there!</p>
            </div>
            {settings.established_year && (
              <div className="flex flex-col items-center gap-3">
                <AwardBadge top="serving since" value={String(settings.established_year)} />
                <div className="flex gap-1" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-sun text-sun" />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-10 max-w-[420px] space-y-4">
            {settings.about_text.split(/\n{2,}/).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line/60 pt-6">
            <div className="flex items-center gap-3">
              <span className="oswald grid size-10 shrink-0 place-items-center rounded-full bg-sun text-[13px] font-bold text-ink">10+</span>
              <span className="oswald text-[12px] font-medium !tracking-wide text-ink">Years Serving Students</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="oswald grid size-10 shrink-0 place-items-center rounded-full bg-sun text-[13px] font-bold text-ink">4x</span>
              <span className="oswald text-[12px] font-medium !tracking-wide text-ink">Fresh Meals Daily</span>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#rooms" className="tbtn tbtn-dark px-12">View rooms</a>
            <a href="#contact" className="tbtn tbtn-sun px-12">Contact us</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Rooms */
export function Rooms({ rooms, settings }: { rooms: Room[]; settings: SiteSettings }) {
  if (!rooms.length) return null;
  return (
    <section id="rooms" className="py-24 md:py-28">
      <div className={WRAP}>
        <SectionHeading title="Rooms" label="choose your bed" />
        {settings.price_note && <p className="mx-auto mt-5 max-w-xl text-center">{settings.price_note}</p>}
        <div className="mt-14">
          <Carousel label="Rooms" itemClass="w-full sm:w-1/2 lg:w-1/3">
            {rooms.map((room) => {
              const status = availabilityLabel(room.available_beds, room.total_beds);
              return (
                <article key={room.id} className="group flex h-full flex-col bg-cream">
                  <div className="img-fallback relative aspect-[4/3] overflow-hidden">
                    {room.images[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={room.images[0]} alt={room.name} loading="lazy" className="size-full object-cover transition duration-700 group-hover:scale-105" />
                    )}
                    {room.description && (
                      <div className="absolute inset-0 flex items-center justify-center bg-ink/75 p-8 text-center text-[14px] leading-relaxed text-white opacity-0 transition duration-500 group-hover:opacity-100">
                        <span className="absolute size-40 rounded-full bg-brand/25" aria-hidden />
                        <span className="relative">{room.description}</span>
                      </div>
                    )}
                    <span
                      className={`oswald absolute left-0 top-5 px-4 py-2 text-[11px] !tracking-[0.15em] ${
                        status.tone === "full" ? "bg-ink text-white" : status.tone === "low" ? "bg-sun text-ink" : "bg-leaf text-white"
                      }`}
                    >
                      {status.text}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col items-center px-6 pb-9 pt-8 text-center">
                    <h3 className="oswald text-[19px] font-medium leading-snug text-ink">{room.name}</h3>
                    <p className="oswald mt-1 text-[11px] font-medium !tracking-[0.2em] text-muted">
                      {room.beds_per_room} {room.beds_per_room === 1 ? "bed" : "beds"} per room · {room.total_beds} beds total
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <span className="text-right text-[13px] leading-tight">
                        Per month
                        <br />
                        from
                      </span>
                      <span className="oswald text-[34px] font-medium normal-case !tracking-normal text-brand">{formatRs(room.monthly_fee)}</span>
                    </div>
                    {room.features.length > 0 && (
                      <ul className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[13px]">
                        {room.features.slice(0, 4).map((f) => (
                          <li key={f} className="before:mr-1.5 before:text-brand before:content-['•']">{f}</li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-auto pt-7">
                      <BookRoomButton roomId={room.id} full={status.tone === "full"} />
                    </div>
                  </div>
                </article>
              );
            })}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Facilities */
export function Facilities({ facilities }: { facilities: Facility[] }) {
  if (!facilities.length) return null;
  return (
    <section id="facilities" className="py-24 md:py-28">
      <div className={WRAP}>
        <SectionHeading title="Facilities" label="what we offer" />
        <ul className="mt-16 flex flex-wrap justify-center gap-y-12">
          {facilities.map((f) => (
            <li key={f.id} className="group flex w-1/2 flex-col items-center px-3 text-center sm:w-1/3 lg:w-1/4" title={f.description || undefined}>
              <Link href={`/facilities/${f.slug || f.id}`} className="group/item flex w-full flex-col items-center">
                <span className="relative grid size-[100px] place-items-center rounded-full bg-sun text-ink shadow-sm transition-all duration-300 group-hover/item:-translate-y-2 group-hover/item:bg-brand group-hover/item:text-white group-hover/item:shadow-lg">
                  <FacilityIcon name={f.icon} className="size-11 stroke-[1.4]" />
                </span>
                <h3 className="oswald mt-6 text-[14px] text-ink transition group-hover/item:text-brand">
                  {f.title}
                </h3>
                {f.description && <p className="mt-1.5 max-w-[200px] text-[12.5px] leading-snug text-muted line-clamp-2">{f.description}</p>}
                <span className="oswald mt-2 inline-flex items-center gap-1 text-[11px] !tracking-[0.15em] text-brand transition duration-300 group-hover/item:translate-x-0.5">
                  View details →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-16 text-center">
          <Link href="/facilities" className="tbtn tbtn-dark px-14">
            All facilities & details
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------ Big photo banner */
export function PromoBanner({ settings }: { settings: SiteSettings }) {
  if (!settings.promo_title) return null;
  return (
    <section className="relative overflow-hidden bg-ink">
      {settings.promo_image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={settings.promo_image} alt="" className="absolute inset-0 size-full object-cover" loading="lazy" />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
      <div className={`${WRAP} relative flex min-h-[560px] items-center py-20 md:min-h-[660px]`}>
        <div className="max-w-2xl text-white">
          <h2 className="display text-[clamp(3.6rem,10vw,6.4rem)] leading-[0.95]">{settings.promo_title}</h2>
          {settings.promo_subtitle && <p className="label-caps mt-8 max-w-lg text-[13px] !tracking-[0.3em] text-white">{settings.promo_subtitle}</p>}
          {settings.promo_button_label && (
            <a href={settings.promo_button_link || "#menu"} className="tbtn tbtn-sun mt-10">
              {settings.promo_button_label}
            </a>
          )}
        </div>
        {settings.promo_badge_value && (
          <div className="absolute right-5 top-14 hidden size-[150px] flex-col items-center justify-center rounded-full bg-brand text-white shadow-xl md:flex lg:right-10">
            <span className="oswald text-[12px] !tracking-[0.2em]">{settings.promo_badge_top}</span>
            <span className="oswald text-[30px] font-medium !tracking-normal">{settings.promo_badge_value}</span>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Notices */
export function NoticeBoard({ notices }: { notices: Notice[] }) {
  if (!notices.length) return null;
  return (
    <section id="notices" className="py-24 md:py-28">
      <div className={WRAP}>
        <SectionHeading title="Notices" label="latest news" />
        <div className="mt-14">
          <Carousel label="Notices" itemClass="w-full lg:w-1/2">
            {notices.slice(0, 8).map((n) => (
              <Link key={n.id} href={`/notices/${n.id}`} className="group grid h-full bg-cream sm:grid-cols-2">
                <div className="img-fallback relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:min-h-[260px]">
                  {n.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={n.image_url} alt="" loading="lazy" className="absolute inset-0 size-full object-cover transition duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-brand">
                      <BellRing className="size-16 text-white/90" strokeWidth={1.3} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col p-7">
                  <p className="oswald flex items-center gap-2 text-[11px] !tracking-[0.2em] text-muted">
                    {n.is_pinned && <Pin className="size-3.5 text-brand" aria-label="Pinned" />}
                    {formatDate(n.published_at, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                  <h3 className="oswald mt-3 text-[18px] font-medium leading-snug text-ink transition group-hover:text-brand">{n.title}</h3>
                  <p className="mt-3 line-clamp-3 text-[14px]">{n.body}</p>
                  <span className="mt-auto flex items-center gap-2 pt-5">
                    <span className="grid size-7 place-items-center rounded-full bg-brand text-white transition group-hover:translate-x-1">
                      <ArrowRight className="size-3.5" />
                    </span>
                    <span className="oswald text-[11px] !tracking-[0.2em] text-ink">Read more</span>
                  </span>
                </div>
              </Link>
            ))}
          </Carousel>
        </div>
        <div className="mt-12 text-center">
          <Link href="/notices" className="tbtn tbtn-dark">All notices</Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Rules */
export function Rules({ rules }: { rules: Rule[] }) {
  if (!rules.length) return null;
  const groups = rules.reduce<Record<string, Rule[]>>((acc, r) => {
    (acc[r.category || "General"] ??= []).push(r);
    return acc;
  }, {});
  let n = 0;
  return (
    <section id="rules" className="bg-sand py-24 md:py-28">
      <div className={WRAP}>
        <SectionHeading title="House rules" label="please note" />
        <div className="mt-14 columns-1 gap-10 md:columns-2">
          {Object.entries(groups).map(([cat, items]) => (
            <div key={cat} className="mb-10 break-inside-avoid bg-white p-8 md:p-10">
              <h3 className="oswald text-[15px] !tracking-[0.25em] text-brand">{cat}</h3>
              <ol className="mt-6 space-y-5">
                {items.map((r) => {
                  n += 1;
                  return (
                    <li key={r.id} className="flex gap-4">
                      <span className="oswald grid size-8 shrink-0 place-items-center rounded-full bg-sun text-[13px] !tracking-normal text-ink">{n}</span>
                      <span className="pt-0.5">{r.content}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- FAQ */
export function Faqs({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section id="faq" className="py-24 md:py-28">
      <div className="mx-auto max-w-[860px] px-5">
        <SectionHeading title="Questions?" label="frequently asked" />
        <div className="mt-14 space-y-3">
          {faqs.map((f) => (
            <details key={f.id} className="group bg-cream open:bg-sand">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-7 py-6 [&::-webkit-details-marker]:hidden">
                <span className="oswald text-[15px] font-medium text-ink">{f.question}</span>
                <span className="grid size-9 shrink-0 place-items-center bg-ink text-lg text-white transition group-open:rotate-45 group-open:bg-brand" aria-hidden>+</span>
              </summary>
              <p className="px-7 pb-7">{f.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Contacts */
export function Contact({ settings, rooms }: { settings: SiteSettings; rooms: Room[] }) {
  const items = [
    settings.address && { Icon: MapPin, label: "Address", value: <span>{settings.address}</span> },
    settings.phone && {
      Icon: Phone,
      label: "Phone",
      value: (
        <span className="oswald text-[22px] font-medium !tracking-wide text-sun-dark">
          <a href={telHref(settings.phone)} className="hover:text-brand">{settings.phone}</a>
          {settings.phone_alt && (
            <>
              <br />
              <a href={telHref(settings.phone_alt)} className="hover:text-brand">{settings.phone_alt}</a>
            </>
          )}
        </span>
      ),
    },
    settings.email && { Icon: Mail, label: "E-mail", value: <a href={`mailto:${settings.email}`} className="break-all hover:text-brand">{settings.email}</a> },
    settings.office_hours && { Icon: Clock, label: "Visiting hours", value: <span>{settings.office_hours}</span> },
  ].filter(Boolean) as { Icon: typeof MapPin; label: string; value: React.ReactNode }[];

  return (
    <section id="contact" className="pt-24 md:pt-28">
      <div className={`${WRAP} grid gap-14 lg:grid-cols-[1fr_1.6fr]`}>
        <div>
          <SectionHeading title="Contacts" label="come visit us" center={false} />
          <ul className="mt-12 space-y-8">
            {items.map(({ Icon, label, value }) => (
              <li key={label} className="flex gap-4">
                <Icon className="mt-0.5 size-5 shrink-0 text-sun-dark" aria-hidden />
                <div>
                  <p className="oswald text-[13px] text-ink">{label}</p>
                  <div className="mt-1">{value}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div id="enquiry" className="scroll-mt-28 bg-sand p-7 sm:p-12">
          <h3 className="display text-[2.4rem] text-ink">Reserve a bed</h3>
          <p className="mt-2">Send us your details and we will call you back within a day.</p>
          <EnquiryForm rooms={rooms} />
        </div>
      </div>
      {settings.map_embed_url && (
        <iframe
          src={settings.map_embed_url}
          title={`Map to ${settings.hostel_name}`}
          className="mt-24 block h-[420px] w-full border-0 grayscale-[30%]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      )}
    </section>
  );
}
