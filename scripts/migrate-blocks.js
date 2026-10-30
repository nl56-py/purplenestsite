const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

async function run() {
  loadEnv();
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL is not set.');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('Connected to database. Applying Block, Floor, Room, Bed migration...');

  await client.query(`
    -- 1. Blocks table
    create table if not exists public.blocks (
      id           uuid primary key default gen_random_uuid(),
      name         text not null,
      code         text not null default '',
      gender_type  text not null default 'All',
      description  text not null default '',
      image_url    text,
      sort_order   int not null default 0,
      is_published boolean not null default true,
      created_at   timestamptz not null default now()
    );

    alter table public.blocks enable row level security;

    drop policy if exists "public read" on public.blocks;
    create policy "public read" on public.blocks
      for select to anon, authenticated
      using (is_published or (select public.is_admin()));

    drop policy if exists "admin all" on public.blocks;
    create policy "admin all" on public.blocks
      for all to authenticated
      using ((select public.is_admin()))
      with check ((select public.is_admin()));

    -- 2. Floors table
    create table if not exists public.floors (
      id           uuid primary key default gen_random_uuid(),
      block_id     uuid not null references public.blocks (id) on delete cascade,
      name         text not null,
      floor_number int not null default 0,
      sort_order   int not null default 0,
      created_at   timestamptz not null default now()
    );

    alter table public.floors enable row level security;

    drop policy if exists "public read" on public.floors;
    create policy "public read" on public.floors
      for select to anon, authenticated
      using (true);

    drop policy if exists "admin all" on public.floors;
    create policy "admin all" on public.floors
      for all to authenticated
      using ((select public.is_admin()))
      with check ((select public.is_admin()));

    -- 3. Enhance rooms table
    alter table public.rooms add column if not exists block_id uuid references public.blocks (id) on delete set null;
    alter table public.rooms add column if not exists floor_id uuid references public.floors (id) on delete set null;
    alter table public.rooms add column if not exists block_name text not null default '';
    alter table public.rooms add column if not exists floor_name text not null default '';
    alter table public.rooms add column if not exists room_number text not null default '';

    -- 4. Beds table
    create table if not exists public.beds (
      id           uuid primary key default gen_random_uuid(),
      room_id      uuid not null references public.rooms (id) on delete cascade,
      bed_number   text not null,
      is_occupied  boolean not null default false,
      notes        text not null default '',
      sort_order   int not null default 0,
      created_at   timestamptz not null default now()
    );

    alter table public.beds enable row level security;

    drop policy if exists "public read" on public.beds;
    create policy "public read" on public.beds
      for select to anon, authenticated
      using (true);

    drop policy if exists "admin all" on public.beds;
    create policy "admin all" on public.beds
      for all to authenticated
      using ((select public.is_admin()))
      with check ((select public.is_admin()));
  `);

  console.log('✓ Tables & columns created or verified!');

  // Seed default blocks A, B, C if none exist
  const blockCountRes = await client.query('SELECT count(*) FROM public.blocks');
  if (parseInt(blockCountRes.rows[0].count, 10) === 0) {
    console.log('Seeding default Blocks A, B, and C...');

    // Block A
    const resA = await client.query(`
      INSERT INTO public.blocks (name, code, gender_type, description, sort_order, is_published)
      VALUES ('Block A', 'A', 'All', 'Main hostel block with attached bathrooms, large windows, and fast Wi-Fi.', 1, true)
      RETURNING id;
    `);
    const blockAId = resA.rows[0].id;

    // Block B
    const resB = await client.query(`
      INSERT INTO public.blocks (name, code, gender_type, description, sort_order, is_published)
      VALUES ('Block B', 'B', 'All', 'Quiet residential block dedicated to peaceful study and comfortable living.', 2, true)
      RETURNING id;
    `);
    const blockBId = resB.rows[0].id;

    // Block C
    const resC = await client.query(`
      INSERT INTO public.blocks (name, code, gender_type, description, sort_order, is_published)
      VALUES ('Block C', 'C', 'All', 'Affordable group rooms with great natural light and study desks.', 3, true)
      RETURNING id;
    `);
    const blockCId = resC.rows[0].id;

    // Floors for Block A
    const floorsA = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'];
    const floorAIds = [];
    for (let i = 0; i < floorsA.length; i++) {
      const fRes = await client.query(`
        INSERT INTO public.floors (block_id, name, floor_number, sort_order)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `, [blockAId, floorsA[i], i, i + 1]);
      floorAIds.push(fRes.rows[0].id);
    }

    // Floors for Block B
    const floorsB = ['Ground Floor', '1st Floor', '2nd Floor'];
    const floorBIds = [];
    for (let i = 0; i < floorsB.length; i++) {
      const fRes = await client.query(`
        INSERT INTO public.floors (block_id, name, floor_number, sort_order)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `, [blockBId, floorsB[i], i, i + 1]);
      floorBIds.push(fRes.rows[0].id);
    }

    // Floors for Block C
    const floorsC = ['Ground Floor', '1st Floor', '2nd Floor'];
    const floorCIds = [];
    for (let i = 0; i < floorsC.length; i++) {
      const fRes = await client.query(`
        INSERT INTO public.floors (block_id, name, floor_number, sort_order)
        VALUES ($1, $2, $3, $4)
        RETURNING id;
      `, [blockCId, floorsC[i], i, i + 1]);
      floorCIds.push(fRes.rows[0].id);
    }

    // Update existing demo rooms with blocks & floors
    const existingRooms = await client.query('SELECT id, name, beds_per_room FROM public.rooms ORDER BY sort_order');
    if (existingRooms.rows.length > 0) {
      console.log('Linking existing rooms to blocks and floors...');
      const assignments = [
        { blockId: blockAId, blockName: 'Block A', floorId: floorAIds[1], floorName: '1st Floor', roomNum: '101' },
        { blockId: blockAId, blockName: 'Block A', floorId: floorAIds[2], floorName: '2nd Floor', roomNum: '201' },
        { blockId: blockBId, blockName: 'Block B', floorId: floorBIds[1], floorName: '1st Floor', roomNum: 'B-102' },
        { blockId: blockCId, blockName: 'Block C', floorId: floorCIds[1], floorName: '1st Floor', roomNum: 'C-104' },
      ];

      for (let i = 0; i < existingRooms.rows.length; i++) {
        const assign = assignments[i % assignments.length];
        const r = existingRooms.rows[i];
        await client.query(`
          UPDATE public.rooms
          SET block_id = $1, block_name = $2, floor_id = $3, floor_name = $4, room_number = $5
          WHERE id = $6;
        `, [assign.blockId, assign.blockName, assign.floorId, assign.floorName, assign.roomNum, r.id]);

        // Seed beds for each room
        const bedsCount = r.beds_per_room || 2;
        for (let b = 1; b <= bedsCount; b++) {
          await client.query(`
            INSERT INTO public.beds (room_id, bed_number, is_occupied, sort_order)
            VALUES ($1, $2, $3, $4);
          `, [r.id, `Bed ${b}`, b === 1, b]);
        }
      }
    }

    console.log('✓ Default blocks, floors, rooms, and beds seeded successfully!');
  } else {
    console.log('Blocks already exist in database.');
  }

  // Summary check
  const bRes = await client.query('SELECT name, code FROM public.blocks ORDER BY sort_order');
  console.log('Active Blocks:', bRes.rows.map(r => r.name).join(', '));

  const fRes = await client.query('SELECT count(*) FROM public.floors');
  console.log('Total Floors in DB:', fRes.rows[0].count);

  const rRes = await client.query('SELECT name, block_name, floor_name, room_number FROM public.rooms');
  console.log('Rooms in DB:', rRes.rows);

  await client.end();
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
