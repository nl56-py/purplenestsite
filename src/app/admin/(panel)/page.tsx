import Link from "next/link";
import { ArrowRight, BedDouble, Inbox, Megaphone, Percent } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { formatDateTime } from "@/lib/format";
import { PageHeader } from "@/components/admin/ui";
import { BedStepper } from "@/components/admin/bed-stepper";
import type { Enquiry, Notice, Room } from "@/lib/types";

export default async function Dashboard() {
  const { supabase } = await requireAdmin();
  const [rooms, enquiries, popup, newCount] = await Promise.all([
    supabase.from("rooms").select("*").order("sort_order").order("created_at"),
    supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("notices").select("*").eq("show_as_popup", true).eq("is_published", true).order("published_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
  ]);
  const roomList = (rooms.data ?? []) as Room[];
  const total = roomList.reduce((s, r) => s + r.total_beds, 0);
  const free = roomList.reduce((s, r) => s + r.available_beds, 0);
  const occupancy = total ? Math.round(((total - free) / total) * 100) : 0;
  const popupNotice = popup.data as Notice | null;
  const popupActive = popupNotice && (!popupNotice.popup_until || new Date(popupNotice.popup_until) > new Date());

  const stats = [
    { label: "Beds available", value: free, Icon: BedDouble, href: "/admin/rooms" },
    { label: "Total beds", value: total, Icon: BedDouble, href: "/admin/rooms" },
    { label: "Occupancy", value: `${occupancy}%`, Icon: Percent, href: "/admin/rooms" },
    { label: "New enquiries", value: newCount.count ?? 0, Icon: Inbox, href: "/admin/enquiries" },
  ];

  return (
    <>
      <PageHeader title="Dashboard" description="Quick overview. Changes you make here appear on the website within seconds." />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, Icon, href }) => (
          <Link key={label} href={href} className="card p-5 transition hover:border-brand">
            <Icon className="size-5 text-brand" />
            <p className="mt-3 text-3xl font-extrabold">{value}</p>
            <p className="text-sm text-muted">{label}</p>
          </Link>
        ))}
      </div>

      {/* Demo Showcase Guide Card */}
      <section className="mt-6 rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-3">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-amber-500/20 text-amber-900 font-bold text-xs">
              ⚡
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-stone-900">Demo Showcase: What Can You Edit & Demonstrate?</h2>
              <p className="text-xs text-stone-600">Everything on the public website updates dynamically in real time from these tabs.</p>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-900 shadow-xs hover:bg-amber-100/50 transition"
          >
            <span>View Live Website</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-xl border border-amber-200/60 bg-white/80 p-3">
            <p className="font-bold text-stone-900">🛏️ Rooms & Bed Vacancies</p>
            <p className="mt-1 text-muted text-[11px]">Use the + / − steppers below or go to <Link href="/admin/rooms" className="text-brand font-semibold underline">Rooms</Link>. Live bed counters and booking modals change immediately.</p>
          </div>
          <div className="rounded-xl border border-amber-200/60 bg-white/80 p-3">
            <p className="font-bold text-stone-900">🍛 7-Day Food Menu</p>
            <p className="mt-1 text-muted text-[11px]">Go to <Link href="/admin/menu" className="text-brand font-semibold underline">Food Menu</Link> to edit breakfast, lunch, snacks, or dinner for all 7 days with auto-highlighted current day.</p>
          </div>
          <div className="rounded-xl border border-amber-200/60 bg-white/80 p-3">
            <p className="font-bold text-stone-900">🎨 Colors, Photos & Slides</p>
            <p className="mt-1 text-muted text-[11px]">Go to <Link href="/admin/settings" className="text-brand font-semibold underline">Settings</Link> to change theme color (re-skins whole site), hero slideshow photos, and hostel name/tagline.</p>
          </div>
          <div className="rounded-xl border border-amber-200/60 bg-white/80 p-3">
            <p className="font-bold text-stone-900">📢 Popup Announcements</p>
            <p className="mt-1 text-muted text-[11px]">Go to <Link href="/admin/notices" className="text-brand font-semibold underline">Notices</Link> and toggle "Show as popup" to greet visitors with an instant admission alert banner.</p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">Bed availability</h2>
            <Link href="/admin/rooms" className="text-sm font-bold text-brand">Manage rooms</Link>
          </div>
          <p className="mt-1 text-xs text-muted">Press + when a student leaves, − when a bed is taken.</p>
          <ul className="mt-4 divide-y divide-line">
            {roomList.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3 py-3">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{r.name}</span>
                  <span className="text-xs text-muted">{r.total_beds} beds total</span>
                </span>
                <BedStepper id={r.id} value={r.available_beds} max={r.total_beds} />
              </li>
            ))}
            {!roomList.length && <li className="py-6 text-center text-sm text-muted">No rooms yet. <Link href="/admin/rooms/new" className="font-bold text-brand">Add one</Link></li>}
          </ul>
        </section>

        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-extrabold"><Megaphone className="size-4 text-brand" /> Website popup</h2>
            {popupActive ? (
              <p className="mt-2 text-sm">Showing: <Link href={`/admin/notices/${popupNotice!.id}`} className="font-bold text-brand">{popupNotice!.title}</Link></p>
            ) : (
              <p className="mt-2 text-sm text-muted">No popup is showing right now.</p>
            )}
            <Link href="/admin/notices/new" className="btn btn-ghost mt-4 w-full">Post a notice</Link>
          </section>

          <section className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold">Latest enquiries</h2>
              <Link href="/admin/enquiries" className="flex items-center gap-1 text-sm font-bold text-brand">All <ArrowRight className="size-3.5" /></Link>
            </div>
            <ul className="mt-3 divide-y divide-line">
              {((enquiries.data ?? []) as Enquiry[]).map((e) => (
                <li key={e.id} className="py-3 text-sm">
                  <p className="flex items-center justify-between gap-2 font-semibold">
                    {e.name}
                    {e.status === "new" && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold">NEW</span>}
                  </p>
                  <p className="text-xs text-muted">{e.phone} · {e.room_name ?? "Any room"} · {formatDateTime(e.created_at)}</p>
                </li>
              ))}
              {!enquiries.data?.length && <li className="py-4 text-center text-sm text-muted">No enquiries yet.</li>}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
