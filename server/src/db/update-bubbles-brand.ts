import { pool } from '../config/db.js';

async function updateSchoolName() {
  await pool.query(`
    UPDATE schools SET 
      name = 'Bubbles Early Years School',
      slug = 'bubbles-early-years',
      code = 'BUBBLES',
      tagline = 'Where Wonder, Play & Joy Flourish (Ages 1–6)'
  `);
  const res = await pool.query('SELECT id, name, slug, code, tagline FROM schools');
  console.log('✓ Successfully updated School in PostgreSQL to:', res.rows[0]);
  await pool.end();
}

updateSchoolName().catch(e => {
  console.error(e);
  process.exit(1);
});
