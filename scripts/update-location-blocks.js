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

async function update() {
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
  console.log('Connected to database. Syncing real imagery, 3 blocks, and Gwarko Lalitpur location...');

  const heroSlides = [
    {
      image: "/images/hero-hoarding-16-9-desktop.jpg",
      title: "The Purple Nest",
      subtitle: "Premier student accommodation across 3 dedicated residential blocks (Block A, B & C) — situated at Sinpa Marg, Gwarko, Lalitpur with quick Ring Road access.",
    },
    {
      image: "/images/block-a.jpg",
      title: "Block A — Focused Living",
      subtitle: "Traditional Nepali exposed red-brick architecture featuring single & double rooms with attached bathrooms, study desks & fast Wi-Fi in Gwarko, Lalitpur.",
    },
    {
      image: "/images/block-b.jpg",
      title: "Block B — Modern Comfort",
      subtitle: "Bright, airy rooms with sunny balconies, 24/7 solar hot water, fresh homely meals & quiet study halls in Gwarko, Lalitpur.",
    },
    {
      image: "/images/hero-rooftop.jpg",
      title: "Admissions Open in Gwarko",
      subtitle: "Join our vibrant student community at Gwarko Chowk, Lalitpur. Scenic rooftop lounge, quiet study hall & fresh homely meals across all 3 blocks.",
    },
  ];

  const aboutText = `The Purple Nest Hostel has been designed to provide ambitious students and working professionals with a peaceful, safe, and vibrant home away from home at Sinpa Marg, Gwarko, Lalitpur.

Spread across three dedicated residential blocks — Block A, Block B, and Block C — our hostel offers tailored room configurations, attached bathrooms, dedicated study halls, and balcony spaces. Our Gwarko location offers unmatched accessibility right off the Ring Road, close to major colleges, hospitals, and transit hubs across Kathmandu Valley.

Our premises feature 24/7 CCTV surveillance, biometric security, dedicated in-house warden supervision, and daily housekeeping. Fresh, hygienic meals prepared in our modern kitchen ensure residents stay energized and healthy throughout their academic journey.`;

  const tagline = "Safe, clean & homely stay for students across 3 modern blocks in Gwarko, Lalitpur.";
  const metaDescription = "The Purple Nest Hostel at Sinpa Marg, Gwarko, Lalitpur (Kathmandu Valley) — 3 modern blocks with single, double, triple & 4-seater rooms, 4 hygienic meals daily, high-speed Wi-Fi & 24/7 security. Admissions open.";
  const address = "Sinpa Marg, Gwarko, Lalitpur, Bagmati Province 44700, Nepal";

  await client.query(
    `update public.site_settings set
      tagline = $1,
      hero_slides = $2::jsonb,
      about_text = $3,
      about_image = '/images/purple-nest-hoarding-16-9.jpg',
      logo_url = '/images/purple-nest-logo.png',
      meta_description = $4,
      address = $5,
      updated_at = now()
    where id = 1`,
    [tagline, JSON.stringify(heroSlides), aboutText, metaDescription, address]
  );
  console.log('✓ site_settings updated successfully in DB!');

  // Update blocks table image_url and descriptions
  await client.query(`
    update public.blocks set
      image_url = '/images/block-a.jpg',
      description = 'Main hostel block with attached bathrooms, single & double rooms, large windows, and fast Wi-Fi in Gwarko, Lalitpur.'
    where code = 'A' or name ilike '%Block A%';

    update public.blocks set
      image_url = '/images/block-b.jpg',
      description = 'Quiet residential block dedicated to peaceful study, triple rooms with sunny balconies, and comfortable living.'
    where code = 'B' or name ilike '%Block B%';

    update public.blocks set
      image_url = '/images/block-a.jpg',
      description = 'Spacious and affordable 4-seater group rooms with abundant natural light, study desks, and private wardrobes.'
    where code = 'C' or name ilike '%Block C%';
  `);
  console.log('✓ blocks updated with real photos & descriptions in DB!');

  // Update room images
  await client.query(`
    update public.rooms set images = ARRAY['/images/block-a.jpg', '/images/hero-room.jpg'] where block_name ilike '%Block A%';
    update public.rooms set images = ARRAY['/images/block-b.jpg', '/images/hero-room.jpg'] where block_name ilike '%Block B%';
    update public.rooms set images = ARRAY['/images/block-b.jpg', '/images/hero-room.jpg'] where block_name ilike '%Block C%';
  `);
  console.log('✓ rooms updated with block photos in DB!');

  // Update gallery images
  await client.query(`
    delete from public.gallery_images where image_url in ('/images/hero-hoarding-16-9-desktop.jpg', '/images/block-a.jpg', '/images/block-b.jpg');
    insert into public.gallery_images (image_url, caption, category, sort_order) values
      ('/images/hero-hoarding-16-9-desktop.jpg', 'The Purple Nest 3D Hoarding Board & Official Signboard in Gwarko', 'Building', 1),
      ('/images/block-a.jpg', 'Block A Building — Traditional Nepali Exposed Red-Brick Facade in Gwarko', 'Building', 2),
      ('/images/block-b.jpg', 'Block B Building — Modern Residential Block with Balconies in Gwarko', 'Building', 3);
  `);
  console.log('✓ gallery updated with real building photos!');

  await client.end();
  console.log('\n✓ All database updates successfully applied!');
}

update().catch((err) => {
  console.error('Error during update:', err);
  process.exit(1);
});
