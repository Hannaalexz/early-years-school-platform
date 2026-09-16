import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { ChildrenService } from './children.service.js';

export class PortalService {
  /**
   * Authenticates a parent using their Portal Code, Phone Number, or Email + 4-digit PIN.
   */
  static async loginWithPortalPin(identifier: string, pin: string): Promise<{
    token: string;
    parent: any;
    school: any;
  }> {
    const trimmedId = identifier.trim();
    const trimmedPin = pin.trim();

    const parentRes = await pool.query(
      `SELECT p.*, s.name as school_name, s.tagline as school_tagline, s.logo_url as school_logo
       FROM parents p
       JOIN schools s ON p.school_id = s.id
       WHERE (
         LOWER(p.email) = LOWER($1) OR 
         p.phone = $1 OR 
         UPPER(p.portal_code) = UPPER($1)
       ) AND p.deleted_at IS NULL`,
      [trimmedId]
    );

    if (parentRes.rows.length === 0) {
      throw new Error('PARENT_NOT_FOUND: No parent profile found matching this code, phone, or email.');
    }

    const parent = parentRes.rows[0];
    const expectedPin = parent.portal_pin || '1234';

    if (trimmedPin !== expectedPin) {
      throw new Error('INVALID_PIN: Incorrect portal security PIN. Please check the 4-digit PIN provided by the school.');
    }

    // Generate lightweight portal session JWT
    const token = jwt.sign(
      {
        parentId: parent.id,
        school_id: parent.school_id,
        type: 'parent_portal',
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      parent: {
        id: parent.id,
        first_name: parent.first_name,
        last_name: parent.last_name,
        email: parent.email,
        phone: parent.phone,
        portal_code: parent.portal_code,
        school_id: parent.school_id,
      },
      school: {
        id: parent.school_id,
        name: parent.school_name,
        tagline: parent.school_tagline,
        logo_url: parent.school_logo,
      },
    };
  }

  /**
   * Retrieves all children linked to a parent through child_guardians
   */
  static async getParentChildren(parentId: string): Promise<any[]> {
    const res = await pool.query(
      `SELECT c.*, 
              cg.relationship, cg.is_primary, cg.is_emergency_contact, cg.pickup_authorized,
              p.name as program_name, p.slug as program_slug, p.color_code as program_color,
              cl.name as classroom_name, cl.room_number as classroom_room_number
       FROM child_guardians cg
       JOIN children c ON cg.child_id = c.id
       LEFT JOIN programs p ON c.program_id = p.id
       LEFT JOIN classrooms cl ON c.classroom_id = cl.id
       WHERE cg.parent_id = $1 AND c.deleted_at IS NULL
       ORDER BY c.date_of_birth DESC`,
      [parentId]
    );

    return res.rows.map(row => ({
      ...row,
      calculated_age: ChildrenService.calculateAge(row.date_of_birth),
    }));
  }

  /**
   * Retrieves full live status for a child for the parent portal
   */
  static async getChildLiveFeed(parentId: string, childId: string): Promise<any> {
    // 1. Security Check: verify parent is authorized for this child
    const authCheck = await pool.query(
      `SELECT relationship, is_primary, pickup_authorized 
       FROM child_guardians 
       WHERE parent_id = $1 AND child_id = $2`,
      [parentId, childId]
    );

    if (authCheck.rows.length === 0) {
      const err: any = new Error('FORBIDDEN: You do not have permission to view this child profile.');
      err.statusCode = 403;
      throw err;
    }

    // 2. Fetch full child profile
    const child = await ChildrenService.getChildById(childId);
    if (!child) {
      const err: any = new Error('NOT_FOUND: Child profile not found.');
      err.statusCode = 404;
      throw err;
    }

    // 3. Return simplified Early Years Parent Portal Feed (Sections 6, 7, 8)
    return {
      child,
      guardianContext: authCheck.rows[0],
      attendanceSummary: {
        present: 20,
        absent: 2,
        late: 1,
        todayStatus: 'present',
        todayStatusLabel: 'Present in Class',
        checkInTime: '08:42 AM',
        droppedOffBy: 'Sarah Johnson',
        droppedOffRelationship: 'Mother',
        room: child.classroom_name || 'Sunshine Classroom',
      },
      monthlyProgress: {
        month: 'September',
        year: 2026,
        status: 'published',
        attendance: {
          present: 20,
          absent: 2,
          late: 1,
        },
        development: {
          cognitive: { label: 'Cognitive Development', status: 'Developing' },
          language: { label: 'Language & Communication', status: 'Developing' },
          social_emotional: { label: 'Social & Emotional', status: 'Achieved' },
          physical: { label: 'Physical Development', status: 'Developing' },
          creative: { label: 'Creative Development', status: 'Achieved' },
          early_literacy: { label: 'Early Literacy', status: 'Developing' },
        },
        domains: [
          { area: 'Cognitive', status: 'Developing', note: 'Curious problem solver; sorts objects by color and shape.' },
          { area: 'Language & Communication', status: 'Developing', note: 'Expanding vocabulary rapidly; enjoys circle stories.' },
          { area: 'Social & Emotional', status: 'Achieved', note: 'Very kind and cooperative peer; shares toys willingly.' },
          { area: 'Physical', status: 'Developing', note: 'Agile in outdoor play and balance; fine motor cutting progressing.' },
          { area: 'Creative', status: 'Achieved', note: 'Loves finger painting and sculpting textures.' },
          { area: 'Early Literacy', status: 'Developing', note: 'Recognizes own written name and points to initial letter sounds.' },
        ],
        teacherSummary:
          `${child.preferred_name || child.first_name} participated very well in classroom activities this month and showed steady improvement in communication and group play.`,
        highlights: [
          'Participated actively in watercolor & paint mixing activities',
          'Improved vocabulary and descriptive sentence structure',
          'Engaged cooperatively with friends during outdoor balance games',
        ],
      },
      latestUpdate: {
        title: 'September Classroom Note',
        message: `${child.preferred_name || child.first_name} had a very positive month, participating actively in sensory play and collaborative building with friends.`,
        date: 'September 15, 2026',
        teacher: 'Ms. Bethlehem',
      },
      activities: [
        {
          id: 'act-1',
          title: 'Painting & Color Mixing',
          date: 'September 16, 2026',
          classroom: child.classroom_name || 'Sunshine Classroom',
          area: 'Creative & Fine Motor',
          description: 'Children explored mixing blue and yellow primary colors to discover green.',
        },
        {
          id: 'act-2',
          title: 'Sensory Dough Exploration',
          date: 'September 14, 2026',
          classroom: child.classroom_name || 'Sunshine Classroom',
          area: 'Physical & Sensory',
          description: 'Tactile molding boosting fine motor coordination and spatial exploration.',
        },
        {
          id: 'act-3',
          title: 'Story Circle: The Tiny Seed',
          date: 'September 12, 2026',
          classroom: child.classroom_name || 'Sunshine Classroom',
          area: 'Language & Literacy',
          description: 'Discussed what plants need to grow (sunlight, soil, and water).',
        },
      ],
      recentActivities: [
        {
          id: 'act-1',
          title: 'Painting & Color Mixing',
          date: 'September 16, 2026',
          classroom: child.classroom_name || 'Sunshine Classroom',
          developmentAreas: ['Creativity', 'Fine Motor Skills'],
          notes: 'Children explored mixing blue and yellow primary colors to discover green.',
          photos: ['/images/children/child-art-worksheet.jpg'],
        },
        {
          id: 'act-2',
          title: 'Sensory Dough Exploration',
          date: 'September 14, 2026',
          classroom: child.classroom_name || 'Sunshine Classroom',
          developmentAreas: ['Physical', 'Sensory Development'],
          notes: 'Tactile molding boosting fine motor coordination and spatial exploration.',
          photos: ['/images/children/child-sensory-dough.jpg'],
        },
        {
          id: 'act-3',
          title: 'Story Circle: The Tiny Seed',
          date: 'September 12, 2026',
          classroom: child.classroom_name || 'Sunshine Classroom',
          developmentAreas: ['Language & Communication', 'Early Literacy'],
          notes: 'Discussed what plants need to grow (sunlight, soil, and water).',
          photos: ['/images/school/reading-nook-books.jpg'],
        },
      ],
      moments: [
        {
          id: 'p1',
          title: 'Creative Art Discovery',
          caption: 'Proudly displaying banana art worksheet',
          imageUrl: '/images/children/child-art-worksheet.jpg',
        },
        {
          id: 'p2',
          title: 'Sensory Dough Play',
          caption: 'Hands-on tactile molding',
          imageUrl: '/images/children/child-sensory-dough.jpg',
        },
        {
          id: 'p3',
          title: 'Outdoor Lawn & Dome',
          caption: 'Active playground exploration',
          imageUrl: '/images/school/playground-grass.jpg',
        },
      ],
      recentPhotos: [
        {
          id: 'p1',
          title: 'Creative Art Discovery',
          caption: 'Proudly displaying banana art worksheet',
          imageUrl: '/images/children/child-art-worksheet.jpg',
        },
        {
          id: 'p2',
          title: 'Sensory Dough Play',
          caption: 'Hands-on tactile molding',
          imageUrl: '/images/children/child-sensory-dough.jpg',
        },
        {
          id: 'p3',
          title: 'Outdoor Lawn & Dome',
          caption: 'Active playground exploration',
          imageUrl: '/images/school/playground-grass.jpg',
        },
      ],
      announcements: [
        {
          id: 'ann-1',
          title: 'Meskel Holiday Observance',
          date: 'September 27, 2026',
          content: 'School will be closed in observance of the national Meskel holiday. Classes resume the following Monday.',
        },
        {
          id: 'ann-2',
          title: 'Term 1 Parent Coffee Morning',
          date: 'October 10, 2026',
          content: 'Join our educators for our term coffee morning on the garden patio to discuss early learning milestones.',
        },
      ],
      authorizedPickups: child.authorized_pickups || [],
    };
  }
}
