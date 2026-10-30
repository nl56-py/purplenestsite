const { Client } = require("pg");

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log("Connected to Supabase PostgreSQL");

  const heroSlides = [
    {
      image: "/images/purple-nest-3d.jpg",
      desktop_image: "/images/hero-hoarding-16-9-desktop.jpg",
      title: "The Purple Nest",
      subtitle: "Premier student accommodation across dedicated residential blocks (Block A, B & C) — situated at Sinpa Marg, Gwarko, Lalitpur with quick Ring Road access.",
    },
    {
      image: "/images/block-a.jpg",
      title: "Block A — Focused Living",
      subtitle: "Traditional Nepali exposed red-brick architecture with peaceful single & double rooms, attached bathrooms, and dedicated study environment.",
    },
    {
      image: "/images/block-b.jpg",
      title: "Block B — Modern Comfort",
      subtitle: "Bright, airy rooms with sunny balconies, 24/7 solar hot water, fresh homely meals, and high-speed Wi-Fi in Gwarko, Lalitpur.",
    },
    {
      image: "/images/hero-rooftop.jpg",
      title: "Admissions Open in Gwarko",
      subtitle: "Join our vibrant student community at Gwarko Chowk, Lalitpur. Scenic rooftop lounge, quiet study hall & fresh homely meals across all 3 blocks.",
    },
  ];

  // 1. Update site_settings
  await client.query(`
    UPDATE site_settings
    SET
      logo_url = '/images/purple-nest-logo.png',
      about_image = '/images/purple-nest-hoarding-16-9.jpg',
      hero_slides = $1::jsonb
    WHERE id = 1
  `, [JSON.stringify(heroSlides)]);
  console.log("Updated site_settings");

  // 2. Update blocks image_url
  await client.query(`
    UPDATE blocks SET image_url = '/images/block-a.jpg' WHERE name = 'Block A';
    UPDATE blocks SET image_url = '/images/block-b.jpg' WHERE name = 'Block B';
    UPDATE blocks SET image_url = '/images/block-a.jpg' WHERE name = 'Block C';
  `);
  console.log("Updated blocks");

  // 3. Update rooms
  await client.query(`
    UPDATE rooms SET images = ARRAY['/images/block-a.jpg', '/images/hero-room.jpg'] WHERE block_name = 'Block A';
    UPDATE rooms SET images = ARRAY['/images/block-b.jpg', '/images/hero-room.jpg'] WHERE block_name = 'Block B';
    UPDATE rooms SET images = ARRAY['/images/block-b.jpg', '/images/hero-room.jpg'] WHERE block_name = 'Block C';
  `);
  console.log("Updated rooms");

  // 4. Update gallery_images
  try {
    await client.query(`
      DELETE FROM gallery_images WHERE caption LIKE '%Building%' OR caption LIKE '%Hoarding%';
      INSERT INTO gallery_images (image_url, caption, category, sort_order)
      VALUES 
        ('/images/hero-hoarding-16-9-desktop.jpg', 'The Purple Nest 3D Hoarding Board & Official Signboard', 'Building', 1),
        ('/images/block-a.jpg', 'Block A Building — Traditional Nepali Exposed Red-Brick Facade', 'Building', 2),
        ('/images/block-b.jpg', 'Block B Building — Modern Residential Block with Balconies', 'Building', 3);
    `);
    console.log("Updated gallery_images table");
  } catch (err) {
    console.log("Gallery table update skipped:", err.message);
  }

  await client.end();
  console.log("Database sync completed successfully!");
}

main().catch(console.error);
