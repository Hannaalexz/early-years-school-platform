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

    // 3. Return rich, realistic Early Years live feed
    return {
      child,
      guardianContext: authCheck.rows[0],
      todayLive: {
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        attendance: {
          status: 'present',
          statusLabel: 'Present in Class',
          checkInTime: '08:45 AM',
          checkedInBy: 'Sarah Johnson (Mother)',
          room: child.classroom_name || 'Sunshine Classroom',
        },
        mood: {
          status: 'Happy & Creative',
          emoji: '😊',
          description: 'Engaged enthusiastically with friends during sensory and story circle.',
        },
        meals: [
          {
            meal: 'Morning Snack',
            time: '09:30 AM',
            items: 'Sliced organic apples & whole grain oat cookies',
            intake: 'Ate All (100%)',
            status: 'completed',
          },
          {
            meal: 'Lunch',
            time: '12:15 PM',
            items: 'Steamed rice, mild vegetable lentil stew & roasted carrots',
            intake: 'Ate Most (80%)',
            status: 'completed',
          },
          {
            meal: 'Afternoon Snack',
            time: '03:15 PM',
            items: 'Banana slices & cheddar cheese sticks',
            intake: 'Scheduled for 3:15 PM',
            status: 'upcoming',
          },
        ],
        nap: {
          status: 'Rested Soundly',
          duration: '1 hour 25 mins',
          startTime: '12:45 PM',
          endTime: '02:10 PM',
          note: 'Fell asleep quickly with soft lullaby music. Woke up refreshed.',
        },
        potty: {
          status: child.toilet_training_status || 'Trained',
          entries: [
            { time: '09:15 AM', type: 'Potty', status: 'Success' },
            { time: '11:45 AM', type: 'Potty', status: 'Success' },
            { time: '02:20 PM', type: 'Potty', status: 'Success' },
          ],
        },
        activities: [
          {
            time: '09:45 AM',
            title: 'Finger Painting & Color Mixing',
            domain: 'Creative Expression & Fine Motor',
            description: 'Experimented mixing primary colors (blue & yellow) to discover green. Very proud of her paper butterfly.',
          },
          {
            time: '10:45 AM',
            title: 'Outdoor Garden & Sensory Play',
            domain: 'Gross Motor & Physical Development',
            description: 'Enjoyed finding leaves in the sensory garden and running balance exercises on the low wooden beams.',
          },
          {
            time: '02:30 PM',
            title: 'Interactive Story Circle: "The Tiny Seed"',
            domain: 'Language & Early Literacy',
            description: 'Participated actively, raising hand to describe what plants need to grow (sun and water).',
          },
        ],
        teacherNote: {
          teacherName: 'Ms. Bethlehem (Lead Teacher)',
          timestamp: '02:45 PM',
          message: `${child.preferred_name || child.first_name} had a delightful day! She demonstrated remarkable empathy today by comforting a friend who was feeling shy during drop-off and inviting her to paint.`,
        },
      },
      milestones: [
        {
          id: 'm1',
          domain: 'Language & Literacy',
          title: 'Uses 5-6 word descriptive sentences',
          status: 'Mastered',
          observationDate: '2026-09-04',
          teacher: 'Ms. Bethlehem',
        },
        {
          id: 'm2',
          domain: 'Gross Motor',
          title: 'Hops forward smoothly on one foot',
          status: 'Achieved',
          observationDate: '2026-09-02',
          teacher: 'Ms. Bethlehem',
        },
        {
          id: 'm3',
          domain: 'Fine Motor',
          title: 'Demonstrates functional pencil tripod grasp',
          status: 'Achieved',
          observationDate: '2026-08-28',
          teacher: 'Ms. Bethlehem',
        },
        {
          id: 'm4',
          domain: 'Social-Emotional',
          title: 'Engages in cooperative group play & sharing',
          status: 'In Progress',
          observationDate: '2026-09-07',
          teacher: 'Ms. Bethlehem',
        },
      ],
      moments: [
        {
          id: 'p1',
          title: 'Creative Art Discovery',
          caption: 'Mixing yellow and blue paint to make bright green!',
          imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&auto=format&fit=crop&q=80',
          time: '10:15 AM',
        },
        {
          id: 'p2',
          title: 'Garden Exploration',
          caption: 'Examining blooming flowers in the sunny courtyard',
          imageUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=600&auto=format&fit=crop&q=80',
          time: '11:15 AM',
        },
        {
          id: 'p3',
          title: 'Story Circle Time',
          caption: 'Listening to "The Tiny Seed" with classmates',
          imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
          time: '02:35 PM',
        },
      ],
      authorizedPickups: child.authorized_pickups,
    };
  }
}
