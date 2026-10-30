import { NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { DEMO_ROOMS, DEFAULT_SETTINGS } from "@/lib/data";
import { Client } from "pg";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;

  // 1. Try direct PostgreSQL if DATABASE_URL is set
  if (dbUrl) {
    try {
      const client = new Client({
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      });
      await client.connect();

      const [settingsRes, roomsRes] = await Promise.all([
        client.query("SELECT admission_open, hostel_name FROM public.site_settings WHERE id = 1"),
        client.query(`
          SELECT id, name, block_name, floor_name, room_number, beds_per_room, total_beds, available_beds, monthly_fee, is_published, sort_order
          FROM public.rooms
          WHERE is_published = true
          ORDER BY sort_order ASC, created_at ASC
        `),
      ]);

      await client.end();

      const admission_open = settingsRes.rows[0]?.admission_open ?? true;
      const rooms = roomsRes.rows.length ? roomsRes.rows : DEMO_ROOMS;

      const total_available = rooms.reduce((s: number, r: { available_beds?: number }) => s + Number(r.available_beds || 0), 0);
      const total_beds = rooms.reduce((s: number, r: { total_beds?: number }) => s + Number(r.total_beds || 0), 0);

      return NextResponse.json(
        {
          ok: true,
          admission_open,
          total_available,
          total_beds,
          rooms: rooms.map((r: { id: string; name: string; block_name?: string; floor_name?: string; room_number?: string; beds_per_room: number; total_beds: number; available_beds: number; monthly_fee: number }) => ({
            id: r.id,
            name: r.name,
            block_name: r.block_name || '',
            floor_name: r.floor_name || '',
            room_number: r.room_number || '',
            beds_per_room: r.beds_per_room,
            total_beds: r.total_beds,
            available_beds: r.available_beds,
            monthly_fee: r.monthly_fee,
          })),
          updated_at: new Date().toISOString(),
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    } catch (pgErr) {
      console.warn("[availability API] Postgres query error, trying Supabase/fallback:", pgErr);
    }
  }

  // 2. Try Supabase Client
  if (isSupabaseConfigured) {
    try {
      const sb = createPublicClient();
      const [settingsRes, roomsRes] = await Promise.all([
        sb.from("site_settings").select("admission_open, hostel_name").eq("id", 1).maybeSingle(),
        sb
          .from("rooms")
          .select("id, name, block_name, floor_name, room_number, beds_per_room, total_beds, available_beds, monthly_fee, is_published, sort_order")
          .eq("is_published", true)
          .order("sort_order")
          .order("created_at"),
      ]);

      const admission_open = settingsRes.data?.admission_open ?? true;
      const rooms = roomsRes.data?.length ? roomsRes.data : DEMO_ROOMS;

      const total_available = rooms.reduce((s, r) => s + Number(r.available_beds || 0), 0);
      const total_beds = rooms.reduce((s, r) => s + Number(r.total_beds || 0), 0);

      return NextResponse.json(
        {
          ok: true,
          admission_open,
          total_available,
          total_beds,
          rooms: rooms.map((r) => ({
            id: r.id,
            name: r.name,
            beds_per_room: r.beds_per_room,
            total_beds: r.total_beds,
            available_beds: r.available_beds,
            monthly_fee: r.monthly_fee,
          })),
          updated_at: new Date().toISOString(),
        },
        {
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        }
      );
    } catch (sbErr) {
      console.warn("[availability API] Supabase query error:", sbErr);
    }
  }

  // 3. Fallback demo data
  const total_available = DEMO_ROOMS.reduce((s, r) => s + r.available_beds, 0);
  const total_beds = DEMO_ROOMS.reduce((s, r) => s + r.total_beds, 0);
  return NextResponse.json(
    {
      ok: true,
      admission_open: DEFAULT_SETTINGS.admission_open,
      total_available,
      total_beds,
      rooms: DEMO_ROOMS.map((r) => ({
        id: r.id,
        name: r.name,
        beds_per_room: r.beds_per_room,
        total_beds: r.total_beds,
        available_beds: r.available_beds,
        monthly_fee: r.monthly_fee,
      })),
      updated_at: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}
