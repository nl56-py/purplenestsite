const { Client } = require("pg");

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.juwxqzxgafunexyxlgej:8qFsJ9kjyHZLo6Rg@aws-1-eu-west-3.pooler.supabase.com:5432/postgres",
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  await client.query("UPDATE site_settings SET about_image = '/images/about-building-sites-collage.jpg' WHERE id = 1");
  const res = await client.query("SELECT about_image FROM site_settings WHERE id = 1");
  console.log("Updated DB about_image:", res.rows[0]);
  await client.end();
}

main().catch(console.error);
