import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, Clock, BookOpen, Sparkles, CreditCard, Ban, CheckCircle2, Phone } from "lucide-react";
import { getSiteData } from "@/lib/data";
import { PageBanner } from "@/components/site/page-banner";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  return {
    title: `Rules & Code of Conduct | ${settings.hostel_name}`,
    description: `Read the hostel rules, gate timings, study silence hours, and resident guidelines for ${settings.hostel_name} in Pilachhen, Lalitpur.`,
  };
}

export default async function RulesPage() {
  const { rules, settings } = await getSiteData();

  // Group rules by category
  const categories = Array.from(new Set(rules.map((r) => r.category || "General")));

  const categoryIcons: Record<string, typeof ShieldAlert> = {
    General: Clock,
    Rooms: Sparkles,
    Study: BookOpen,
    Fees: CreditCard,
  };

  return (
    <>
      <PageBanner
        title="Hostel Rules & Code of Conduct"
        label="discipline • peace of mind • mutual respect"
        description="Our guidelines exist to maintain a tranquil, safe, and academically focused environment where every student can study peacefully and thrive."
      />

      {/* Zero Tolerance Warning Bar */}
      <section className="bg-rose-50 border-b border-rose-200 py-6">
        <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-5">
          <Ban className="size-8 text-rose-600 shrink-0" />
          <p className="text-sm font-serif text-rose-950 leading-relaxed">
            <strong className="font-sans font-bold text-rose-800 uppercase tracking-wide">Strict Zero Tolerance Policy:</strong> Smoking, tobacco products, alcoholic beverages, drugs, abusive language, gambling, and any form of ragging/bullying are absolutely forbidden on the premises and result in immediate expulsion without refund.
          </p>
        </div>
      </section>

      {/* Rules by Category */}
      <section className="py-16 md:py-24 bg-white">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="grid gap-10 md:grid-cols-2">
            {categories.map((cat) => {
              const catRules = rules.filter((r) => (r.category || "General") === cat);
              const Icon = categoryIcons[cat] || Clock;

              return (
                <div
                  key={cat}
                  className="rounded-3xl border border-line bg-sand/20 p-8 transition-all hover:border-brand/40 hover:bg-white hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 border-b border-line pb-5">
                    <div className="grid size-12 place-items-center rounded-2xl bg-brand/10 text-brand">
                      <Icon className="size-6" />
                    </div>
                    <div>
                      <span className="oswald text-[11px] !tracking-[0.2em] uppercase text-brand font-semibold">
                        Category
                      </span>
                      <h2 className="display text-2xl text-ink">{cat} Guidelines</h2>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-4">
                    {catRules.map((rule, idx) => (
                      <li key={rule.id} className="flex items-start gap-3 text-sm text-ink/85 font-serif leading-relaxed">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sun text-ink font-sans text-xs font-bold mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{rule.content}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Key Timings Summary Card */}
          <div className="mt-16 rounded-3xl border-2 border-sun/50 bg-white p-8 md:p-12 shadow-sm">
            <h3 className="oswald text-[22px] font-semibold text-ink">Important Daily Timings</h3>
            <p className="mt-1 text-sm text-muted font-serif">
              Please note these mandatory daily schedules followed at {settings.hostel_name}:
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-line p-5 bg-sand/30">
                <span className="oswald text-xs uppercase tracking-wider text-brand font-bold">Main Gate Lock</span>
                <p className="display text-2xl text-ink mt-1">8:30 PM</p>
                <p className="text-xs text-muted mt-1">Late arrival requires prior warden notification.</p>
              </div>

              <div className="rounded-2xl border border-line p-5 bg-sand/30">
                <span className="oswald text-xs uppercase tracking-wider text-brand font-bold">Study Silence Hours</span>
                <p className="display text-2xl text-ink mt-1">9:00 PM – 6:00 AM</p>
                <p className="text-xs text-muted mt-1">Loud audio and disturbance strictly barred.</p>
              </div>

              <div className="rounded-2xl border border-line p-5 bg-sand/30">
                <span className="oswald text-xs uppercase tracking-wider text-brand font-bold">Visitor Hours</span>
                <p className="display text-2xl text-ink mt-1">9:00 AM – 6:00 PM</p>
                <p className="text-xs text-muted mt-1">Parents & guardians meet in reception lounge.</p>
              </div>

              <div className="rounded-2xl border border-line p-5 bg-sand/30">
                <span className="oswald text-xs uppercase tracking-wider text-brand font-bold">Monthly Fee Due</span>
                <p className="display text-2xl text-ink mt-1">10th of Month</p>
                <p className="text-xs text-muted mt-1">According to the Nepali Bikram Sambat calendar.</p>
              </div>
            </div>
          </div>

          {/* Support / Questions */}
          <div className="mt-14 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-ink p-8 text-white">
            <div>
              <h4 className="display text-2xl">Have questions about admissions or guidelines?</h4>
              <p className="mt-1 text-white/80 font-serif text-sm">
                Speak directly with the resident hostel warden anytime during visiting hours.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/contact" className="tbtn tbtn-sun px-8 py-3">
                Contact Warden
              </Link>
              <Link href="/rooms" className="tbtn tbtn-ghost px-8 py-3 border-white/40 text-white hover:bg-white hover:text-ink">
                View Rooms
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
