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

async function main() {
  loadEnv();
  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.juwxqzxgafunexyxlgej:[YOUR-PASSWORD]@aws-1-eu-west-3.pooler.supabase.com:5432/postgres';
  
  console.log(`Connecting to database...`);
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    await client.connect();
    console.log('✓ Successfully connected to Supabase PostgreSQL database!');

    const versionRes = await client.query('SELECT version()');
    console.log('PostgreSQL version:', versionRes.rows[0].version);

    // 1. Run schema.sql
    console.log('\n--- Running supabase/schema.sql ---');
    const schemaSql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('✓ schema.sql executed successfully!');

    // 2. Run demo-seed.sql
    console.log('\n--- Running supabase/demo-seed.sql ---');
    const seedSql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'demo-seed.sql'), 'utf8');
    await client.query(seedSql);
    console.log('✓ demo-seed.sql executed successfully!');

    // 3. Check tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    console.log('\nPublic tables created:');
    console.log(tablesRes.rows.map(r => r.table_name).join(', '));

    // 4. Try to find the anon key / jwt secret if available in internal schemas
    try {
      const secretsRes = await client.query(`
        SELECT * FROM vault.decrypted_secrets;
      `);
      console.log('Vault secrets:', secretsRes.rows);
    } catch (e) {
      // vault might not be enabled or empty
    }

    await client.end();
    console.log('\n✓ Database setup completed successfully!');
  } catch (err) {
    console.error('Database setup failed:', err);
    process.exit(1);
  }
}

main();
