# The Purple Nest Hostel Website + Admin CMS

A one-page hostel website laid out like the *City Hostel* theme, and an admin panel at `/admin`
where the hostel owner updates everything themselves.

**Home page, top to bottom:** header with full-screen menu · photo slideshow ("from Rs. X a month")
· green *Book your bed!* strip · *Namaste!* welcome with "serving since" badge · *Rooms* carousel with
live bed availability · green *Students say:* reviews strip with rating · *Facilities* icon circles ·
big photo banner (e.g. *Homely meals*) · weekly *Food menu* · *Photogallery* (masonry + lightbox) ·
*Notices* cards (+ popup) · *House rules* · *Questions?* FAQ · green call-back strip · *Contacts*
with enquiry form and Google Map · footer.

Fonts are Sansita (headings), Oswald (labels, buttons) and Noto Serif (text), self-hosted from npm.
The two main colours (orange headings and the green strips) are set in Admin → Website settings.

**Stack:** Next.js 16 (App Router, Server Actions) · Supabase (Postgres, Auth, Storage) · Tailwind v4 · hosted on Vercel.
**Running cost:** Rs. 0 on the free tiers of Supabase and Vercel (a custom domain is the only paid item).

---

## What the owner can do in `/admin`

| Page | What it controls |
|---|---|
| Dashboard | Beds free / total / occupancy, new enquiries, quick − / + bed buttons, which popup is live |
| Rooms & beds | Room types, monthly fee, admission fee, beds per room, total beds, **beds available now**, features, photos, show/hide, order |
| Notices & popup | Notices with date, image, pin to top, **show as popup** (with optional end date) |
| Enquiries | Booking requests and call-back requests from the website — call / WhatsApp buttons, New → Contacted → Closed |
| Photo gallery | Drag-and-drop multi-upload, categories (become filter tabs), captions, order, delete |
| Facilities | Title, description, icon picker, show/hide, order |
| Hostel rules | Grouped by category (General, Rooms, Fees…) |
| Food menu | 7 days × Morning / Day meal / Snacks / Dinner; today's menu is highlighted on the site |
| Testimonials, FAQs | Add / edit / hide / reorder (testimonials can have a photo) |
| Website settings | Name, type, logo, **two theme colours**, slideshow, welcome text & photo, photo banner (title, text, badge, button, photo), phones, WhatsApp, email, address, Google Map, social links, SEO description |
| My account | Change password |

Photos are resized and converted to WebP in the browser before upload (a 5 MB phone photo becomes ~200 KB),
so the free 1 GB of Supabase storage lasts for years. Deleting or replacing a photo removes the old file.

---

## Set up a new client (≈ 20 minutes)

### 1. Supabase (database, login, photo storage)
1. Create a free account at <https://supabase.com> **using the client's email** (the free plan allows 2 active projects per account, so one account per client is simplest — and the client owns their data).
2. **New project** → name it after the hostel → region **Mumbai (ap-south-1)** (closest to Nepal) → save the database password somewhere safe.
3. **SQL Editor → New query** → paste all of `supabase/schema.sql` → **Run**.
   - For your *demo* site only: also run `supabase/demo-seed.sql` (fills in a sample hostel). Skip it for real clients.
4. **Authentication → Users → Add user → Create new user** — the owner's email + a temporary password, tick *Auto Confirm User*.
5. Make that user an admin. In the SQL Editor run (change the email):
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'owner@example.com';
   ```
6. **Authentication → Sign In / Providers → Email** → turn **off** “Allow new users to sign up”.
   (Non-admins can't change anything even if they sign up — the database blocks them — but there's no reason to allow it.)
7. **Project Settings → API** (or the **Connect** button): copy the **Project URL** and the **publishable key** (or legacy `anon` key).

### 2. Vercel (hosting)
1. Push this folder to a GitHub repository (one repo can serve every client).
2. <https://vercel.com> → **Add New → Project** → import the repo.
3. Under **Environment Variables** add:
   - `NEXT_PUBLIC_SUPABASE_URL` = Project URL
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = publishable (or anon) key
   - `CRON_SECRET` = any long random text (optional but recommended)
4. **Deploy.** Then open `https://<project>.vercel.app/admin`, sign in, and hand over.
5. Custom domain (e.g. `himalnesthostel.com.np`): Vercel → Project → **Settings → Domains**.

> Order matters: run the SQL **before** the first deploy, so the home page is built with real content.

### 3. Hand-over checklist
- [ ] Owner signs in and changes the password (**My account**)
- [ ] Settings filled in: name, phone, WhatsApp, address, map, logo, theme colour
- [ ] At least 2–3 slideshow photos and 8+ gallery photos
- [ ] Rooms with correct fees and beds available
- [ ] Test the enquiry form once and check it appears in **Enquiries**

---

## How it stays fast and free

- The public pages are **statically generated** and cached by Vercel. Every save in the admin
  refreshes them instantly (on-demand revalidation), and they also refresh every 5 minutes as a fallback.
- **Keep-alive:** Supabase pauses free projects after 7 days without activity. `vercel.json` schedules
  a daily call to `/api/keepalive` that runs one tiny query, so the project never goes to sleep.
- The notice popup and “today's menu” are decided in the visitor's browser, so they stay correct even on a cached page.

## Photos

The demo uses free photos from Unsplash (loaded straight from Unsplash). For a real client, upload
their own photos from the admin — slideshow and banner photos look best wide (landscape, 1920 px),
room and gallery photos at 4:3.

## Security

- All permissions are enforced in the database with **Row Level Security** (`supabase/schema.sql`):
  the public can read published content and submit enquiries; only users listed in `admin_users` can change
  anything, read enquiries, or upload/delete photos.
- The admin area also checks the session on the server (`src/proxy.ts`, `requireAdmin()` in `src/lib/admin.ts`).
- The enquiry form has server-side validation, length limits, and a hidden honeypot field against spam bots.

## Local development

```bash
cp .env.example .env.local   # fill in your Supabase URL + key
npm install
npm run dev                  # http://localhost:3000  and  /admin
```

## Where to change things

| Want to change | File |
|---|---|
| Colours, fonts, spacing | `src/app/globals.css` (brand colour itself is set from Admin → Settings) |
| Order of sections on the home page | `src/app/(site)/page.tsx` |
| A section's layout | `src/components/site/` |
| Fields of rooms / notices / facilities / rules / FAQs / testimonials | `src/lib/resources.ts` (+ add the column in `supabase/schema.sql`) |
| Facility icon choices | `src/lib/icons.tsx` |
| Database tables & permissions | `supabase/schema.sql` — safe to re-run after edits |
