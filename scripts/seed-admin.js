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

async function seedAdmin(adminEmail, adminPassword) {
  loadEnv();

  const email = adminEmail || process.argv[2] || 'hostelweb@nexa.com';
  const password = adminPassword || process.argv[3] || '12345678';

  const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.juwxqzxgafunexyxlgej:[YOUR-PASSWORD]@aws-1-eu-west-3.pooler.supabase.com:5432/postgres';

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  console.log(`Checking if user ${email} already exists...`);
  const check = await client.query('SELECT id, email FROM auth.users WHERE email = $1', [email]);

  let userId;

  if (check.rows.length > 0) {
    userId = check.rows[0].id;
    console.log(`User already exists with ID: ${userId}. Updating password and confirmation...`);
    await client.query(`
      UPDATE auth.users
      SET 
        encrypted_password = extensions.crypt($1, extensions.gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now(),
        confirmation_token = COALESCE(confirmation_token, ''),
        recovery_token = COALESCE(recovery_token, ''),
        email_change_token_new = COALESCE(email_change_token_new, ''),
        email_change = COALESCE(email_change, ''),
        phone_change = COALESCE(phone_change, ''),
        phone_change_token = COALESCE(phone_change_token, ''),
        email_change_token_current = COALESCE(email_change_token_current, ''),
        reauthentication_token = COALESCE(reauthentication_token, ''),
        raw_app_meta_data = '{"provider":"email","providers":["email"]}'::jsonb,
        raw_user_meta_data = jsonb_build_object('email', $2::text)
      WHERE id = $3
    `, [password, email, userId]);
  } else {
    console.log(`Creating new user in auth.users...`);
    const insertUserRes = await client.query(`
      INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        is_super_admin,
        is_sso_user,
        is_anonymous
      ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        extensions.uuid_generate_v4(),
        'authenticated',
        'authenticated',
        $1::varchar,
        extensions.crypt($2, extensions.gen_salt('bf')),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('email', $1::varchar),
        now(),
        now(),
        false,
        false,
        false
      ) RETURNING id;
    `, [email, password]);

    userId = insertUserRes.rows[0].id;
    console.log(`User created with ID: ${userId}`);
  }

  // Ensure identity exists in auth.identities
  console.log(`Ensuring identity in auth.identities...`);
  const idCheck = await client.query('SELECT id FROM auth.identities WHERE user_id = $1::uuid AND provider = $2', [userId, 'email']);
  if (idCheck.rows.length === 0) {
    await client.query(`
      INSERT INTO auth.identities (
        id,
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        extensions.uuid_generate_v4(),
        $1::text,
        $1::uuid,
        jsonb_build_object('sub', $1::text, 'email', $2::text, 'email_verified', true),
        'email',
        now(),
        now(),
        now()
      );
    `, [userId, email]);
    console.log(`auth.identities entry inserted.`);
  } else {
    console.log(`auth.identities entry already exists.`);
  }

  // Ensure record in public.admin_users
  console.log(`Ensuring record in public.admin_users...`);
  await client.query(`
    INSERT INTO public.admin_users (user_id, created_at)
    VALUES ($1::uuid, now())
    ON CONFLICT (user_id) DO NOTHING;
  `, [userId]);
  console.log(`Admin user granted access in public.admin_users!`);

  // Verify
  const adminCheck = await client.query(`
    SELECT u.id, u.email, u.email_confirmed_at, a.created_at as admin_since
    FROM auth.users u
    JOIN public.admin_users a ON u.id = a.user_id
    WHERE u.email = $1;
  `, [email]);

  console.log('\n✓ Verified admin user:', adminCheck.rows[0]);

  await client.end();
}

seedAdmin().catch(console.error);
