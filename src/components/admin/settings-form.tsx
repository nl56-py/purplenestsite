"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { saveSettings, type FormState } from "@/app/admin/actions";
import type { HeroSlide, SiteSettings } from "@/lib/types";
import { ImageInput } from "./image-input";
import { FormAlert, SubmitButton, useFormAction } from "./ui";

const MAIN_COLORS = ["#fd7444", "#e84a5f", "#0f6b5c", "#1d4ed8", "#7c3aed", "#b45309", "#0e7490", "#334155"];
const BAND_COLORS = ["#8cbb6a", "#4f9d8a", "#5b8def", "#9b7ede", "#e0a33b", "#e57373", "#444349", "#2f6f5e"];

function ColorPicker({ name, label, defaultValue, presets }: { name: string; label: string; defaultValue: string; presets: string[] }) {
  const [color, setColor] = useState(defaultValue || presets[0]);
  return (
    <div>
      <span className="label">{label}</span>
      <input type="hidden" name={name} value={color} />
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Use colour ${c}`}
            onClick={() => setColor(c)}
            className={`size-8 rounded-full ring-offset-2 transition ${color.toLowerCase() === c ? "ring-2 ring-ink" : ""}`}
            style={{ background: c }}
          />
        ))}
        <label className="flex items-center gap-2 text-xs font-semibold text-muted">
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="size-8 cursor-pointer rounded border border-line" />
          Custom
        </label>
      </div>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="card p-6">
      <h2 className="font-extrabold">{title}</h2>
      {hint && <p className="mt-0.5 text-sm text-muted">{hint}</p>}
      <div className="mt-5 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Text({ name, label, value, full, ...rest }: { name: string; label: string; value: string | number | null; full?: boolean } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue">) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="label">{label}</span>
      <input name={name} defaultValue={value ?? ""} className="input" {...rest} />
    </label>
  );
}

export function SettingsForm({ settings: s }: { settings: SiteSettings }) {
  const [state, onSubmit, pending] = useFormAction<FormState>(saveSettings, null);
  // _k gives each slide a stable identity so reordering doesn't mix up photos.
  const [slides, setSlides] = useState<(HeroSlide & { _k: string })[]>(() =>
    (s.hero_slides ?? []).map((sl, i) => ({ ...sl, _k: `s${i}` })),
  );

  const updateSlide = (i: number, patch: Partial<HeroSlide>) => setSlides((all) => all.map((sl, k) => (k === i ? { ...sl, ...patch } : sl)));
  const moveSlide = (i: number, d: number) =>
    setSlides((all) => {
      const j = i + d;
      if (j < 0 || j >= all.length) return all;
      const next = [...all];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="hero_slides" value={JSON.stringify(slides.map(({ image, title, subtitle }) => ({ image, title, subtitle })))} />

      <Section title="Hostel details">
        <Text name="hostel_name" label="Hostel name *" value={s.hostel_name} required maxLength={80} />
        <Text name="hostel_type" label="Type (shown under the name)" value={s.hostel_type} placeholder="Boys Hostel / Girls Hostel" maxLength={40} />
        <Text name="tagline" label="Tagline" value={s.tagline} maxLength={200} full />
        <Text name="established_year" label="Established year" value={s.established_year} inputMode="numeric" pattern="\d{4}" placeholder="2015" />
        <label className="flex items-center gap-3 self-end rounded-lg border border-line px-4 py-2.5">
          <input type="checkbox" name="admission_open" defaultChecked={s.admission_open} className="size-4 accent-[var(--brand)]" />
          <span className="text-sm font-semibold">Show “Admissions open” badge</span>
        </label>
        <div>
          <span className="label">Logo (optional)</span>
          <ImageInput name="logo_url" defaultValue={s.logo_url} folder="branding" aspect="aspect-[3/1]" />
        </div>
        <ColorPicker name="theme_color" label="Main colour (headings, prices, badges)" defaultValue={s.theme_color} presets={MAIN_COLORS} />
        <ColorPicker name="secondary_color" label="Band colour (booking & reviews strips)" defaultValue={s.secondary_color} presets={BAND_COLORS} />
      </Section>

      <section className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-extrabold">Slideshow (top of the home page)</h2>
            <p className="mt-0.5 text-sm text-muted">Use wide photos. Up to 8 slides.</p>
          </div>
          <button type="button" className="btn btn-ghost" disabled={slides.length >= 8} onClick={() => setSlides((a) => [...a, { image: "", title: "", subtitle: "", _k: `n${Date.now()}` }])}>
            <Plus className="size-4" /> Add slide
          </button>
        </div>
        <div className="mt-5 space-y-4">
          {slides.map((sl, i) => (
            <div key={sl._k} className="grid gap-4 rounded-xl border border-line p-4 md:grid-cols-[260px_1fr]">
              <ImageInput defaultValue={sl.image} folder="slides" onChange={(u) => updateSlide(i, { image: u })} />
              <div className="space-y-3">
                <label className="block">
                  <span className="label">Headline</span>
                  <input value={sl.title} onChange={(e) => updateSlide(i, { title: e.target.value })} maxLength={120} className="input" />
                </label>
                <label className="block">
                  <span className="label">Sub-text</span>
                  <textarea value={sl.subtitle} onChange={(e) => updateSlide(i, { subtitle: e.target.value })} maxLength={250} rows={2} className="input" />
                </label>
                <div className="flex gap-2">
                  <button type="button" className="btn btn-ghost py-1.5 text-xs" disabled={i === 0} onClick={() => moveSlide(i, -1)}><ArrowUp className="size-3.5" /> Up</button>
                  <button type="button" className="btn btn-ghost py-1.5 text-xs" disabled={i === slides.length - 1} onClick={() => moveSlide(i, 1)}><ArrowDown className="size-3.5" /> Down</button>
                  <button type="button" className="btn btn-danger py-1.5 text-xs" onClick={() => setSlides((a) => a.filter((_, k) => k !== i))}><Trash2 className="size-3.5" /> Remove slide</button>
                </div>
              </div>
            </div>
          ))}
          {!slides.length && <p className="rounded-xl bg-sand p-6 text-center text-sm text-muted">No slides — the hostel name and tagline are shown on a coloured background.</p>}
        </div>
      </section>

      <Section title="About section">
        <Text name="about_title" label="Big greeting (e.g. Namaste!)" value={s.about_title} maxLength={60} full />
        <label className="block sm:col-span-2">
          <span className="label">Text</span>
          <textarea name="about_text" defaultValue={s.about_text} rows={7} maxLength={4000} className="input" />
          <span className="mt-1 block text-xs text-muted">Leave a blank line between paragraphs.</span>
        </label>
        <div className="sm:col-span-2">
          <span className="label">Photo</span>
          <ImageInput name="about_image" defaultValue={s.about_image} folder="about" aspect="aspect-[4/3]" />
        </div>
      </Section>

      <Section title="Photo banner (middle of the home page)" hint="A big photo strip — use it for meals, a discount, the study hall… Leave the title empty to hide it.">
        <Text name="promo_title" label="Big title" value={s.promo_title} maxLength={60} placeholder="Homely meals" />
        <Text name="promo_subtitle" label="Small text" value={s.promo_subtitle} maxLength={200} />
        <Text name="promo_badge_top" label="Circle badge — small word" value={s.promo_badge_top} maxLength={20} placeholder="meals" />
        <Text name="promo_badge_value" label="Circle badge — big text" value={s.promo_badge_value} maxLength={20} placeholder="3 / day" />
        <Text name="promo_button_label" label="Button text" value={s.promo_button_label} maxLength={40} placeholder="See food menu" />
        <Text name="promo_button_link" label="Button link" value={s.promo_button_link} maxLength={300} placeholder="#menu, #rooms, #contact or https://…" />
        <div className="sm:col-span-2">
          <span className="label">Background photo</span>
          <ImageInput name="promo_image" defaultValue={s.promo_image} folder="banner" aspect="aspect-[21/9]" />
        </div>
      </Section>

      <Section title="Contact details">
        <Text name="phone" label="Main phone" value={s.phone} maxLength={30} type="tel" />
        <Text name="phone_alt" label="Second phone / landline" value={s.phone_alt} maxLength={30} type="tel" />
        <Text name="whatsapp" label="WhatsApp number" value={s.whatsapp} maxLength={20} placeholder="98XXXXXXXX" type="tel" />
        <Text name="email" label="Email" value={s.email} maxLength={150} type="email" />
        <Text name="address" label="Address" value={s.address} maxLength={200} full />
        <Text name="office_hours" label="Office / visiting hours" value={s.office_hours} maxLength={100} full placeholder="Every day, 7:00 AM – 8:00 PM" />
        <label className="block sm:col-span-2">
          <span className="label">Google Map</span>
          <textarea name="map_embed_url" defaultValue={s.map_embed_url ?? ""} rows={2} className="input" placeholder="Paste the embed code from Google Maps, or type the place name" />
          <span className="mt-1 block text-xs text-muted">In Google Maps: find the hostel → Share → Embed a map → Copy HTML, then paste it here.</span>
        </label>
      </Section>

      <Section title="Social media" hint="Leave empty to hide an icon.">
        <Text name="facebook_url" label="Facebook page link" value={s.facebook_url} maxLength={300} />
        <Text name="instagram_url" label="Instagram link" value={s.instagram_url} maxLength={300} />
        <Text name="tiktok_url" label="TikTok link" value={s.tiktok_url} maxLength={300} />
        <Text name="youtube_url" label="YouTube link" value={s.youtube_url} maxLength={300} />
      </Section>

      <Section title="Fees note & search engines">
        <Text name="price_note" label="Note under “Rooms & monthly fees”" value={s.price_note} maxLength={300} full placeholder="Fees include meals, Wi-Fi, water and electricity." />
        <label className="block sm:col-span-2">
          <span className="label">Google description (shown in search results)</span>
          <textarea name="meta_description" defaultValue={s.meta_description ?? ""} rows={2} maxLength={300} className="input" />
        </label>
      </Section>

      <div className="sticky bottom-0 z-10 -mx-4 flex flex-wrap items-center gap-4 border-t border-line bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-xl sm:border">
        <SubmitButton pending={pending}>Save settings</SubmitButton>
        <div className="flex-1"><FormAlert state={state} /></div>
      </div>
    </form>
  );
}
