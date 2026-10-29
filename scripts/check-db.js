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

async function check() {
  loadEnv();
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:qt3fPi%24UjdQThZ%3F@db.xqyolwqyhvowrupuxpgv.supabase.co:5432/postgres';

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  const settings = await client.query('select hostel_name, hostel_type, theme_color, phone, address from site_settings where id = 1');
  console.log('Site settings in DB:', settings.rows[0]);

  const rooms = await client.query('select count(*) from rooms');
  console.log('Rooms in DB:', rooms.rows[0].count);

  const facilities = await client.query('select count(*) from facilities');
  console.log('Facilities in DB:', facilities.rows[0].count);

  const users = await client.query('select id, email, created_at, (encrypted_password = extensions.crypt(\'12345678\', encrypted_password)) as password_matches from auth.users');
  console.log('Auth users in DB:', users.rows);

  const adminUsers = await client.query('select * from public.admin_users');
  console.log('Admin users in DB:', adminUsers.rows);

  await client.end();
}

check().catch(console.error);
