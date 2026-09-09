import { pool } from '../config/db.js';

async function migratePortal() {
  console.log('Applying portal columns migration...');
  await pool.query(`
    ALTER TABLE parents ADD COLUMN IF NOT EXISTS portal_pin VARCHAR(20) DEFAULT '1234';
    ALTER TABLE parents ADD COLUMN IF NOT EXISTS portal_code VARCHAR(50);

    UPDATE parents SET portal_code = 'PAR-7821', portal_pin = '1234' WHERE email = 'parent@littlestars.edu';
    UPDATE parents SET portal_code = 'PAR-5542', portal_pin = '1234' WHERE email = 'david.johnson@example.com';
    UPDATE parents SET portal_code = 'PAR-' || UPPER(SUBSTRING(MD5(id::text) FROM 1 FOR 6)), portal_pin = '1234' WHERE portal_code IS NULL;
  `);

  const res = await pool.query('SELECT id, first_name, email, phone, portal_code, portal_pin FROM parents');
  console.log(`Portal migration complete. ${res.rows.length} parents updated.`);
  for (const p of res.rows) {
    console.log(`- ${p.first_name} (${p.email}): Code=${p.portal_code}, PIN=${p.portal_pin}`);
  }
  await pool.end();
}

migratePortal().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
