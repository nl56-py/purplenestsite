import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle, HelpCircle } from "lucide-react";
import { getSiteData } from "@/lib/data";
import { PageBanner } from "@/components/site/page-banner";
import { telHref, whatsappHref } from "@/lib/format";
import { EnquiryForm } from "@/components/site/enquiry-form";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  return {
    title: `Contact Us & Location | ${settings.hostel_name}`,
    description: `Get in touch with ${settings.hostel_name} in Pilachhen, Lalitpur. Contact details, visiting hours, WhatsApp chat, and interactive Google Map.`,
  };
}

export default async function ContactPage() {
  const { settings, rooms, faqs } = await getSiteData();

  return (
    <>
      <PageBanner
        title="Contact & Location"
        label="get in touch • schedule a visit"
        description="We are located at Sinpa Marg, Pilachhen, Lalitpur. Reach out by phone, WhatsApp, or drop by during office hours."
      />

      {/* Main Contact Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1.3fr] items-start">
            {/* Contact Details Column */}
            <div>
              <p className="oswald text-[11px] !tracking-[0.25em] text-brand uppercase font-semibold">
                Direct Contact
              </p>
              <h2 className="display mt-2 text-[clamp(2.2rem,3.8vw,3.2rem)] text-ink">
                We’re Here to Help
              </h2>
              <p className="mt-3 text-muted font-serif text-[16px] leading-relaxed">
                Whether you have questions about current bed availability, meal menus, or wish to schedule an in-person room tour with your parents, we are just a call away.
              </p>

              <div className="mt-10 space-y-6">
                {/* Address Card */}
                {settings.address && (
                  <div className="flex gap-4 rounded-2xl border border-line bg-sand/20 p-5">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <p className="oswald text-xs !tracking-[0.16em] uppercase text-muted font-semibold">Address</p>
                      <p className="mt-1 text-sm font-semibold text-ink font-serif">{settings.address}</p>
                      <p className="mt-0.5 text-xs text-muted">Centrally located in Pilachhen, Lalitpur</p>
                    </div>
                  </div>
                )}

                {/* Phone & Hotline Card */}
                {settings.phone && (
                  <div className="flex gap-4 rounded-2xl border border-line bg-sand/20 p-5">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sun/30 text-ink">
                      <Phone className="size-5 text-sun-dark" />
                    </div>
                    <div>
                      <p className="oswald text-xs !tracking-[0.16em] uppercase text-muted font-semibold">Call Us</p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                        <a href={telHref(settings.phone)} className="oswald text-lg font-bold text-brand hover:underline">
                          {settings.phone}
                        </a>
                        {settings.phone_alt && (
                          <a href={telHref(settings.phone_alt)} className="oswald text-lg font-bold text-ink hover:underline">
                            {settings.phone_alt}
                          </a>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted">Direct line to hostel reception and on-duty warden</p>
                    </div>
                  </div>
                )}

                {/* WhatsApp Quick Chat */}
                {settings.whatsapp && (
                  <div className="flex gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
                    <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-500 text-white">
                      <MessageCircle className="size-5" />
                    </div>
                    <div>
                      <p className="oswald text-xs !tracking-[0.16em] uppercase text-emerald-800 font-semibold">Instant WhatsApp</p>
                      <a
                        href={whatsappHref(settings.whatsapp, `Hello! I am inquiring about room availability at ${settings.hostel_name}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="oswald mt-1 inline-block text-base font-bold text-emerald-800 hover:underline"
                      >
                        +{settings.whatsapp} (Chat Now)
                      </a>
                      <p className="mt-0.5 text-xs text-emerald-700/80">Instant replies for bed queries and fee details</p>
                    </div>
                  </div>
                )}

                {/* Email & Office Hours */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {settings.email && (
                    <div className="flex gap-3.5 rounded-2xl border border-line bg-sand/20 p-4">
                      <Mail className="size-5 text-brand shrink-0 mt-0.5" />
                      <div>
                        <p className="oswald text-[11px] uppercase tracking-wider text-muted font-semibold">Email</p>
                        <a href={`mailto:${settings.email}`} className="text-xs font-semibold text-ink hover:text-brand break-all">
                          {settings.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {settings.office_hours && (
                    <div className="flex gap-3.5 rounded-2xl border border-line bg-sand/20 p-4">
                      <Clock className="size-5 text-brand shrink-0 mt-0.5" />
                      <div>
                        <p className="oswald text-[11px] uppercase tracking-wider text-muted font-semibold">Visiting Hours</p>
                        <p className="text-xs font-semibold text-ink">{settings.office_hours}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reservation / Enquiry Form Column */}
            <div id="enquiry" className="scroll-mt-28 rounded-3xl border border-line bg-sand/40 p-7 sm:p-10 shadow-sm">
              <span className="oswald text-[11px] !tracking-[0.2em] uppercase text-brand font-semibold">
                Online Reservation
              </span>
              <h3 className="display mt-1 text-[2.4rem] text-ink">Reserve a Bed</h3>
              <p className="mt-2 text-sm text-muted font-serif">
                Send your details and room preference. We will verify room availability and contact you within 2 hours.
              </p>

              <div className="mt-8">
                <EnquiryForm rooms={rooms} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Google Map */}
      {settings.map_embed_url && (
        <section className="border-t border-line bg-white">
          <div className="mx-auto max-w-[1200px] px-5 pt-12 pb-4">
            <p className="oswald text-[11px] !tracking-[0.25em] text-brand uppercase font-semibold">
              Find Our Location
            </p>
            <h3 className="display mt-1 text-2xl text-ink">Interactive Map & Directions</h3>
            <p className="mt-1 text-sm text-muted font-serif">
              Conveniently located at Sinpa Marg, Pilachhen, Lalitpur with quick access to Patan and public transportation.
            </p>
          </div>
          <iframe
            src={settings.map_embed_url}
            title={`Map location of ${settings.hostel_name}`}
            className="mt-6 block h-[450px] w-full border-0 grayscale-[20%]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      )}

      {/* Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <section className="py-16 md:py-24 bg-sand/20 border-t border-line">
          <div className="mx-auto max-w-[900px] px-5">
            <div className="text-center">
              <p className="oswald text-[11px] !tracking-[0.25em] text-brand uppercase font-semibold">
                Common Inquiries
              </p>
              <h3 className="display mt-1 text-[clamp(2.2rem,3.8vw,3rem)] text-ink">
                Frequently Asked Questions
              </h3>
              <p className="mt-2 text-muted font-serif text-sm">
                Everything you need to know about joining {settings.hostel_name}.
              </p>
            </div>

            <div className="mt-10 space-y-3.5">
              {faqs.map((f) => (
                <details key={f.id} className="group rounded-2xl bg-white border border-line p-6 open:bg-sand/30 open:border-sun transition">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                    <span className="oswald text-base font-medium text-ink">{f.question}</span>
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-white transition group-open:rotate-45 group-open:bg-brand">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm text-muted font-serif leading-relaxed border-t border-line/60 pt-4">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
