import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';

export async function runSeed() {
  console.log('🌱 Seeding database with Early Years Foundation & Child Management (Phase 2)...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Roles (Transport & Finance omitted from primary operational scope per user directive)
    const roles = [
      { id: 'super_admin', name: 'Super Administrator', desc: 'Full system-wide administrative access across schools' },
      { id: 'school_admin', name: 'School Administrator', desc: 'Manages school operations, staff, children, and settings' },
      { id: 'teacher', name: 'Early Childhood Teacher', desc: 'Manages assigned classrooms, takes attendance, records care and observations' },
      { id: 'parent', name: 'Parent / Guardian', desc: 'Accesses own children daily reports, development portfolios, and photos' },
      { id: 'admissions', name: 'Admissions Officer', desc: 'Manages enquiries, school tours, applications, and enrollment' },
    ];

    for (const r of roles) {
      await client.query(
        `INSERT INTO roles (id, display_name, description, is_system)
         VALUES ($1, $2, $3, true)
         ON CONFLICT (id) DO UPDATE SET display_name = EXCLUDED.display_name, description = EXCLUDED.description`,
        [r.id, r.name, r.desc]
      );
    }
    console.log(`  ✓ ${roles.length} roles initialized.`);

    // 2. Permissions (No transport or finance)
    const permissions = [
      { id: 'system:all', cat: 'system', name: 'System Super Access', desc: 'Unrestricted access' },
      { id: 'school:manage', cat: 'school', name: 'Manage School', desc: 'Configure school profile, campuses, years' },
      { id: 'school:read', cat: 'school', name: 'View School Info', desc: 'View school overview' },
      { id: 'users:manage', cat: 'users', name: 'Manage Users', desc: 'Create, update, deactivate staff & users' },
      { id: 'users:read', cat: 'users', name: 'View Users', desc: 'View staff & parent profiles' },
      { id: 'admissions:manage', cat: 'admissions', name: 'Manage Admissions', desc: 'Process enquiries, tours, enrollments' },
      { id: 'admissions:read', cat: 'admissions', name: 'View Admissions', desc: 'View enquiries and applicants' },
      { id: 'children:manage', cat: 'children', name: 'Manage Children', desc: 'Create and edit child profiles' },
      { id: 'children:read', cat: 'children', name: 'View Children', desc: 'View all children' },
      { id: 'children:read_own', cat: 'children', name: 'View Own Children', desc: 'View assigned or family children' },
      { id: 'attendance:manage', cat: 'attendance', name: 'Manage Attendance', desc: 'School-wide attendance control' },
      { id: 'attendance:record', cat: 'attendance', name: 'Record Attendance', desc: 'Mark classroom presence and pickup' },
      { id: 'attendance:read', cat: 'attendance', name: 'View Attendance', desc: 'View classroom attendance' },
      { id: 'attendance:read_own', cat: 'attendance', name: 'View Own Attendance', desc: 'View child attendance records' },
      { id: 'daily_care:record', cat: 'daily_care', name: 'Record Daily Care', desc: 'Record meals, naps, diapers, mood' },
      { id: 'daily_care:read', cat: 'daily_care', name: 'View Daily Care', desc: 'View classroom daily care' },
      { id: 'daily_care:read_own', cat: 'daily_care', name: 'View Own Daily Care', desc: 'View child daily care reports' },
      { id: 'development:assess', cat: 'development', name: 'Assess Development', desc: 'Update milestones and evaluations' },
      { id: 'development:record', cat: 'development', name: 'Record Observations', desc: 'Log developmental milestones and notes' },
      { id: 'development:read', cat: 'development', name: 'View Development', desc: 'View development portfolios' },
      { id: 'development:read_own', cat: 'development', name: 'View Own Development', desc: 'View child portfolio' },
      { id: 'activities:manage', cat: 'activities', name: 'Manage Activities', desc: 'Plan activities, lesson plans, events' },
      { id: 'activities:read', cat: 'activities', name: 'View Activities', desc: 'View classroom activities' },
      { id: 'communication:broadcast', cat: 'communication', name: 'Broadcast Announcements', desc: 'Send school notices' },
      { id: 'communication:message', cat: 'communication', name: 'Send Messages', desc: 'Chat between parents and teachers' },
      { id: 'communication:read', cat: 'communication', name: 'Read Communications', desc: 'Access notices and chats' },
      { id: 'reports:view', cat: 'reports', name: 'View Reports', desc: 'Access aggregated analytics and exports' },
    ];

    for (const p of permissions) {
      await client.query(
        `INSERT INTO permissions (id, category, name, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE SET category = EXCLUDED.category, name = EXCLUDED.name, description = EXCLUDED.description`,
        [p.id, p.cat, p.name, p.desc]
      );
    }

    // Role-Permission mappings
    const roleMap: Record<string, string[]> = {
      super_admin: permissions.map(p => p.id),
      school_admin: permissions.filter(p => p.id !== 'system:all').map(p => p.id),
      teacher: [
        'school:read', 'users:read', 'children:read_own',
        'attendance:record', 'attendance:read',
        'daily_care:record', 'daily_care:read',
        'development:assess', 'development:record', 'development:read',
        'activities:manage', 'activities:read',
        'communication:message', 'communication:read'
      ],
      parent: [
        'school:read', 'children:read_own',
        'attendance:read_own',
        'daily_care:read_own',
        'development:read_own',
        'activities:read',
        'communication:message', 'communication:read'
      ],
      admissions: [
        'school:read', 'admissions:manage', 'admissions:read',
        'children:read', 'users:read', 'reports:view',
        'communication:message', 'communication:read'
      ]
    };

    for (const [rId, perms] of Object.entries(roleMap)) {
      for (const permId of perms) {
        await client.query(
          `INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [rId, permId]
        );
      }
    }

    // 3. School & Campus
    const schoolRes = await client.query(
      `INSERT INTO schools (name, slug, code, tagline, address, city, country, phone, email, website)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [
        'Little Stars Early Years School',
        'little-stars',
        'LS-EYS',
        'Nurturing Curious Minds from 1 to 6 Years Old',
        'Bole Subcity, Woreda 03, Near Atlas Hotel',
        'Addis Ababa',
        'Ethiopia',
        '+251 11 661 2345',
        'contact@littlestars.edu',
        'https://littlestars.edu'
      ]
    );
    const schoolId = schoolRes.rows[0].id;

    const campusRes = await client.query(
      `INSERT INTO campuses (school_id, name, code, address, city, phone, email, is_main)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true)
       ON CONFLICT (school_id, code) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [schoolId, 'Sunshine Bole Main Campus', 'MAIN-01', 'Bole Subcity, Woreda 03', 'Addis Ababa', '+251 11 661 2345', 'bole@littlestars.edu']
    );
    const campusId = campusRes.rows[0].id;

    // Academic Year
    await client.query(
      `INSERT INTO academic_years (school_id, name, start_date, end_date, is_current, status)
       VALUES ($1, $2, $3, $4, true, 'active')
       ON CONFLICT DO NOTHING`,
      [schoolId, '2026 - 2027 Academic Year', '2026-09-01', '2027-06-30']
    );

    // 4. Programs
    const programsData = [
      { name: 'Infants Care', slug: 'infants', minM: 3, maxM: 12, desc: 'Gentle sensory environment and responsive care.', color: '#B86B77' },
      { name: 'Toddler Playgroup', slug: 'toddlers', minM: 12, maxM: 24, desc: 'Active exploration and early language acquisition.', color: '#C86D51' },
      { name: 'Nursery', slug: 'nursery', minM: 24, maxM: 36, desc: 'Curiosity-led learning and cooperative play.', color: '#E29578' },
      { name: 'Preschool (KG 1)', slug: 'kg1', minM: 36, maxM: 48, desc: 'Early numeracy, phonemic awareness, and creativity.', color: '#4A6B53' },
      { name: 'Kindergarten (KG 2 / Reception)', slug: 'kg2', minM: 48, maxM: 72, desc: 'Foundational literacy and primary school readiness.', color: '#2D5A43' },
    ];

    const programIds: Record<string, string> = {};
    for (const prog of programsData) {
      const pRes = await client.query(
        `INSERT INTO programs (school_id, name, slug, age_group_min_months, age_group_max_months, description, color_code)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (school_id, slug) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [schoolId, prog.name, prog.slug, prog.minM, prog.maxM, prog.desc, prog.color]
      );
      programIds[prog.slug] = pRes.rows[0].id;
    }

    // 5. Classrooms
    const classroomsData = [
      { name: 'Sunshine Classroom', room: 'A-101', capacity: 18, prog: 'kg1', color: '#FEF3C7' },
      { name: 'Rainbow Classroom', room: 'A-102', capacity: 16, prog: 'nursery', color: '#EDE9FE' },
      { name: 'Butterfly Room', room: 'B-101', capacity: 12, prog: 'toddlers', color: '#FCE7F3' },
      { name: 'Little Explorers', room: 'A-201', capacity: 20, prog: 'kg2', color: '#D1FAE5' },
    ];

    const classroomIds: Record<string, string> = {};
    for (const c of classroomsData) {
      const cRes = await client.query(
        `INSERT INTO classrooms (school_id, campus_id, program_id, name, room_number, capacity, color_accent)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING
         RETURNING id`,
        [schoolId, campusId, programIds[c.prog], c.name, c.room, c.capacity, c.color]
      );
      if (cRes.rows.length > 0) {
        classroomIds[c.name] = cRes.rows[0].id;
      } else {
        const exist = await client.query(`SELECT id FROM classrooms WHERE school_id = $1 AND name = $2`, [schoolId, c.name]);
        classroomIds[c.name] = exist.rows[0].id;
      }
    }

    // 6. Users
    const salt = await bcrypt.genSalt(10);
    const adminHash = await bcrypt.hash('Admin123!', salt);
    const teacherHash = await bcrypt.hash('Teacher123!', salt);
    const parentHash = await bcrypt.hash('Parent123!', salt);
    const admissionsHash = await bcrypt.hash('Admit123!', salt);

    const demoUsers = [
      { email: 'superadmin@littlestars.edu', password: adminHash, first_name: 'Alexander', last_name: 'Vance', role_id: 'super_admin', title: 'Platform Architect' },
      { email: 'admin@littlestars.edu', password: adminHash, first_name: 'Martha', last_name: 'Tadesse', role_id: 'school_admin', title: 'Head of School' },
      { email: 'teacher@littlestars.edu', password: teacherHash, first_name: 'Bethany', last_name: 'Claire', role_id: 'teacher', title: 'Lead Educator - Sunshine KG1' },
      { email: 'parent@littlestars.edu', password: parentHash, first_name: 'Sarah', last_name: 'Johnson', role_id: 'parent', title: 'Guardian (Emma & Noah)' },
      { email: 'admissions@littlestars.edu', password: admissionsHash, first_name: 'Helen', last_name: 'Mekonnen', role_id: 'admissions', title: 'Enrollment Coordinator' },
    ];

    const userIds: Record<string, string> = {};
    for (const u of demoUsers) {
      const uRes = await client.query(
        `INSERT INTO users (school_id, role_id, email, password_hash, first_name, last_name, title, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
         ON CONFLICT (email) DO UPDATE SET role_id = EXCLUDED.role_id, first_name = EXCLUDED.first_name
         RETURNING id`,
        [schoolId, u.role_id, u.email, u.password, u.first_name, u.last_name, u.title]
      );
      userIds[u.email] = uRes.rows[0].id;
    }

    // 7. Seed Parents
    const parentsData = [
      {
        user_id: userIds['parent@littlestars.edu'],
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'parent@littlestars.edu',
        phone: '+251 91 144 5566',
        address: 'Bole Subcity, House 512, Addis Ababa',
        occupation: 'Senior Research Analyst',
        employer: 'UN Economic Commission',
        portal_code: 'PAR-7821',
        portal_pin: '1234',
      },
      {
        first_name: 'David',
        last_name: 'Johnson',
        email: 'david.johnson@example.com',
        phone: '+251 91 144 5567',
        address: 'Bole Subcity, House 512, Addis Ababa',
        occupation: 'Civil Engineer',
        employer: 'Midroc Construction',
        portal_code: 'PAR-5542',
        portal_pin: '1234',
      },
      {
        first_name: 'Dr. Michael',
        last_name: 'Solomon',
        email: 'm.solomon@example.com',
        phone: '+251 92 233 4455',
        address: 'Old Airport, House 104, Addis Ababa',
        occupation: 'Pediatrician',
        employer: 'St. Paul Hospital',
        portal_code: 'PAR-32D8',
        portal_pin: '1234',
      },
      {
        first_name: 'Rahel',
        last_name: 'Bekele',
        email: 'rahel.bekele@example.com',
        phone: '+251 93 344 5566',
        address: 'CMC Michael, Addis Ababa',
        occupation: 'Architect',
        employer: 'Studio B',
        portal_code: 'PAR-86EC',
        portal_pin: '1234',
      },
      {
        first_name: 'Yonas',
        last_name: 'Abebe',
        email: 'yonas.abebe@example.com',
        phone: '+251 94 455 6677',
        address: 'Kazanchis, Addis Ababa',
        occupation: 'Software Engineer',
        employer: 'Tech Africa',
        portal_code: 'PAR-F9EC',
        portal_pin: '1234',
      },
    ];

    const parentIds: Record<string, string> = {};
    for (const pr of parentsData) {
      const prRes = await client.query(
        `INSERT INTO parents (school_id, user_id, first_name, last_name, email, phone, address, occupation, employer, portal_code, portal_pin)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [schoolId, pr.user_id || null, pr.first_name, pr.last_name, pr.email, pr.phone, pr.address, pr.occupation, pr.employer, pr.portal_code, pr.portal_pin]
      );
      parentIds[pr.email] = prRes.rows[0].id;
    }
    console.log(`  ✓ ${parentsData.length} Parent profiles registered.`);

    // 8. Seed 22 Realistic Early Years Children across Classrooms
    const childrenData = [
      // Sunshine Classroom (KG 1)
      {
        first: 'Emma', last: 'Johnson', middle: 'Grace', pref: 'Emma', dob: '2022-06-15', gender: 'Female',
        class: 'Sunshine Classroom', prog: 'kg1',
        allergies: ['Peanuts', 'Tree Nuts'],
        diet: ['Nut-Free'],
        food_pref: 'Loves fresh strawberries, oatmeal, steamed rice. Dislikes mushrooms.',
        meds: 'EpiPen stored in Sunshine emergency medical lockbox A-1.',
        nap: 'Sleeps 1:00 PM - 2:15 PM with soft lullaby audio. Pacifier not needed.',
        toilet: 'trained',
        parent_email: 'parent@littlestars.edu',
        relationship: 'Mother',
      },
      {
        first: 'Daniel', last: 'Solomon', middle: 'Abebe', pref: 'Danny', dob: '2022-05-10', gender: 'Male',
        class: 'Sunshine Classroom', prog: 'kg1',
        allergies: ['Cow Milk / Lactose'],
        diet: ['Dairy-Free', 'Halal'],
        food_pref: 'Enjoys soy yogurt, grilled chicken strips, sliced carrots.',
        nap: 'Needs story read before resting. Sleeps 45 minutes.',
        toilet: 'trained',
        parent_email: 'm.solomon@example.com',
        relationship: 'Father',
      },
      {
        first: 'Sara', last: 'Bekele', middle: 'Tadesse', pref: 'Sara', dob: '2022-10-01', gender: 'Female',
        class: 'Sunshine Classroom', prog: 'kg1',
        allergies: [],
        diet: ['Vegetarian'],
        food_pref: 'Prefers lentils, vegetable soup, and apple slices.',
        toilet: 'trained',
        parent_email: 'rahel.bekele@example.com',
        relationship: 'Mother',
      },
      {
        first: 'Lucas', last: 'Abebe', middle: 'Yonas', pref: 'Lucas', dob: '2022-07-20', gender: 'Male',
        class: 'Sunshine Classroom', prog: 'kg1',
        allergies: ['Eggs'],
        diet: ['Egg-Free'],
        nap: 'Quiet sleeper, typically 1 hour.',
        toilet: 'trained',
        parent_email: 'yonas.abebe@example.com',
        relationship: 'Father',
      },
      {
        first: 'Chloe', last: 'Vance', middle: 'Marie', pref: 'Chloe', dob: '2022-08-14', gender: 'Female',
        class: 'Sunshine Classroom', prog: 'kg1',
        allergies: [],
        diet: [],
        toilet: 'trained',
      },
      {
        first: 'Liam', last: 'Girma', middle: '', pref: 'Liam', dob: '2022-04-18', gender: 'Male',
        class: 'Sunshine Classroom', prog: 'kg1',
        allergies: ['Shellfish'],
        diet: [],
        toilet: 'trained',
      },

      // Butterfly Room (Toddlers)
      {
        first: 'Noah', last: 'Johnson', middle: 'David', pref: 'Noah', dob: '2024-12-20', gender: 'Male',
        class: 'Butterfly Room', prog: 'toddlers',
        allergies: [],
        diet: ['Soft foods cut small'],
        food_pref: 'Warm banana porridge, pureed sweet potato, avocado.',
        nap: 'Sleeps 11:30 AM - 1:15 PM. Needs gentle back patting to drift off.',
        toilet: 'diapers',
        other_care: 'Skin is sensitive to perfumed baby wipes; please use water wipes only.',
        parent_email: 'parent@littlestars.edu',
        relationship: 'Mother',
      },
      {
        first: 'Oliver', last: 'Davis', middle: '', pref: 'Ollie', dob: '2024-10-08', gender: 'Male',
        class: 'Butterfly Room', prog: 'toddlers',
        allergies: ['Dairy'],
        diet: ['Lactose-Free'],
        toilet: 'diapers',
      },
      {
        first: 'Hannah', last: 'Solomon', middle: '', pref: 'Hannah', dob: '2025-01-14', gender: 'Female',
        class: 'Butterfly Room', prog: 'toddlers',
        allergies: [],
        diet: [],
        toilet: 'diapers',
        parent_email: 'm.solomon@example.com',
        relationship: 'Father',
      },
      {
        first: 'Sophia', last: 'Kebede', middle: '', pref: 'Sofi', dob: '2025-02-02', gender: 'Female',
        class: 'Butterfly Room', prog: 'toddlers',
        allergies: [],
        diet: [],
        toilet: 'diapers',
      },

      // Rainbow Classroom (Nursery)
      {
        first: 'Samuel', last: 'Haile', middle: '', pref: 'Sammy', dob: '2023-11-12', gender: 'Male',
        class: 'Rainbow Classroom', prog: 'nursery',
        allergies: [],
        diet: [],
        toilet: 'in_training',
        nap: 'Sleeps 1 hour after lunch.',
      },
      {
        first: 'Mimi', last: 'Tsegaye', middle: '', pref: 'Mimi', dob: '2023-08-04', gender: 'Female',
        class: 'Rainbow Classroom', prog: 'nursery',
        allergies: ['Wheat / Gluten'],
        diet: ['Gluten-Free'],
        toilet: 'in_training',
      },
      {
        first: 'Ethan', last: 'Brown', middle: '', pref: 'Ethan', dob: '2023-10-25', gender: 'Male',
        class: 'Rainbow Classroom', prog: 'nursery',
        allergies: [],
        diet: [],
        toilet: 'trained',
      },
      {
        first: 'Bella', last: 'Mekonnen', middle: '', pref: 'Bella', dob: '2023-05-30', gender: 'Female',
        class: 'Rainbow Classroom', prog: 'nursery',
        allergies: [],
        diet: [],
        toilet: 'trained',
      },

      // Little Explorers (KG 2 / Reception)
      {
        first: 'Joshua', last: 'Vance', middle: 'Robert', pref: 'Josh', dob: '2021-06-10', gender: 'Male',
        class: 'Little Explorers', prog: 'kg2',
        allergies: [],
        diet: [],
        toilet: 'trained',
      },
      {
        first: 'Grace', last: 'Alemayehu', middle: '', pref: 'Gracie', dob: '2021-04-12', gender: 'Female',
        class: 'Little Explorers', prog: 'kg2',
        allergies: ['Peanuts'],
        diet: ['Nut-Free'],
        toilet: 'trained',
      },
      {
        first: 'Alexander', last: 'Bekele', middle: '', pref: 'Alex', dob: '2021-08-28', gender: 'Male',
        class: 'Little Explorers', prog: 'kg2',
        allergies: [],
        diet: [],
        toilet: 'trained',
        parent_email: 'rahel.bekele@example.com',
        relationship: 'Mother',
      },
      {
        first: 'Abigail', last: 'Desta', middle: '', pref: 'Abby', dob: '2021-05-19', gender: 'Female',
        class: 'Little Explorers', prog: 'kg2',
        allergies: [],
        diet: [],
        toilet: 'trained',
      },
    ];

    const childMap: Record<string, string> = {};

    for (let i = 0; i < childrenData.length; i++) {
      const c = childrenData[i];
      const admNum = `LS-2026-${1000 + i + 1}`;
      const cRes = await client.query(
        `INSERT INTO children (
          school_id, program_id, classroom_id, first_name, middle_name, last_name, preferred_name,
          date_of_birth, gender, admission_number, admission_date, enrollment_status,
          allergies, dietary_restrictions, food_preferences, medical_notes, medication_instructions,
          nap_preferences, toilet_training_status, other_care_instructions
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE - 30, 'active', $11, $12, $13, $14, $15, $16, $17, $18)
        RETURNING id`,
        [
          schoolId,
          programIds[c.prog],
          classroomIds[c.class],
          c.first,
          c.middle || null,
          c.last,
          c.pref || null,
          c.dob,
          c.gender,
          admNum,
          c.allergies || [],
          c.diet || [],
          c.food_pref || null,
          c.allergies?.length ? `Allergies on file: ${c.allergies.join(', ')}` : null,
          c.meds || null,
          c.nap || null,
          c.toilet || 'in_training',
          c.other_care || null,
        ]
      );

      const childId = cRes.rows[0].id;
      childMap[`${c.first} ${c.last}`] = childId;

      // Link Guardian if specified
      if (c.parent_email && parentIds[c.parent_email]) {
        await client.query(
          `INSERT INTO child_guardians (child_id, parent_id, relationship, is_primary, is_emergency_contact, emergency_priority, pickup_authorized)
           VALUES ($1, $2, $3, true, true, 1, true)
           ON CONFLICT DO NOTHING`,
          [childId, parentIds[c.parent_email], c.relationship || 'Guardian']
        );
      }
    }
    console.log(`  ✓ ${childrenData.length} Early Years Children registered & enrolled.`);

    // 9. Authorized Pickups for Emma Johnson & Noah Johnson (#7 Never allow unauthorized pickup)
    const emmaId = childMap['Emma Johnson'];
    const noahId = childMap['Noah Johnson'];

    if (emmaId && noahId) {
      // Also link Father David Johnson
      if (parentIds['david.johnson@example.com']) {
        await client.query(
          `INSERT INTO child_guardians (child_id, parent_id, relationship, is_primary, is_emergency_contact, emergency_priority, pickup_authorized)
           VALUES ($1, $2, 'Father', false, true, 2, true), ($3, $2, 'Father', false, true, 2, true)
           ON CONFLICT DO NOTHING`,
          [emmaId, parentIds['david.johnson@example.com'], noahId]
        );
      }

      // Authorized Pickup: Eleanor Johnson (Grandmother) - Approved
      await client.query(
        `INSERT INTO authorized_pickups (child_id, name, relationship, phone, authorization_status, notes, security_pin)
         VALUES 
         ($1, 'Eleanor Johnson', 'Grandmother', '+251 91 199 8877', 'approved', 'Authorized for Tuesday and Friday pickups.', '4812'),
         ($2, 'Eleanor Johnson', 'Grandmother', '+251 91 199 8877', 'approved', 'Authorized for toddler pickup.', '4812')`,
        [emmaId, noahId]
      );

      // Authorized Pickup: Maya Vance (Family Friend / Aunt) - Approved
      await client.query(
        `INSERT INTO authorized_pickups (child_id, name, relationship, phone, authorization_status, notes, security_pin)
         VALUES 
         ($1, 'Maya Vance', 'Aunt / Emergency Contact', '+251 91 122 3344', 'approved', 'Emergency backup pickup authorization.', '9934')`,
        [emmaId]
      );

      // Authorized Pickup: Mark Davis (Revoked Example to test #7 security)
      await client.query(
        `INSERT INTO authorized_pickups (child_id, name, relationship, phone, authorization_status, notes)
         VALUES 
         ($1, 'Mark Davis', 'Former Neighbor', '+251 91 100 0000', 'revoked', 'Authorization revoked by Mother on Sept 1, 2026.')`,
        [emmaId]
      );
      console.log(`  ✓ Authorized Pickups & Security Contacts seeded for Emma & Noah.`);
    }

    await client.query('COMMIT');
    console.log('🌟 Phase 2 Seeding completed successfully!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Phase 2 Seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runSeed()
    .then(() => {
      console.log('🏁 Phase 2 Seed finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
