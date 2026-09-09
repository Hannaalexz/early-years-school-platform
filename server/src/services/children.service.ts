import { pool } from '../config/db.js';
import {
  Child,
  ChildProfileDTO,
  ChildGuardian,
  AuthorizedPickup,
  Parent,
  PickupAuthorizationStatus
} from '../types/children.js';
import { AuditService } from './audit.service.js';

export class ChildrenService {
  /**
   * Calculates age in years and months accurately for early-years education
   */
  static calculateAge(dobStr: string | Date): { years: number; months: number; formatted: string } {
    const dob = new Date(dobStr);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();

    if (today.getDate() < dob.getDate()) {
      months--;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    let formatted = '';
    if (years === 0) {
      formatted = `${months} month${months === 1 ? '' : 's'}`;
    } else if (months === 0) {
      formatted = `${years} year${years === 1 ? '' : 's'}`;
    } else {
      formatted = `${years} year${years === 1 ? '' : 's'} ${months} month${months === 1 ? '' : 's'}`;
    }

    return { years, months, formatted };
  }

  static async listChildren(options: {
    school_id?: string | null;
    classroom_id?: string;
    program_id?: string;
    status?: string;
    search?: string;
    has_allergy?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    let query = `
      SELECT c.*, 
             p.name as program_name, p.slug as program_slug, p.color_code as program_color,
             cl.name as classroom_name, cl.room_number as classroom_room_number
      FROM children c
      LEFT JOIN programs p ON c.program_id = p.id
      LEFT JOIN classrooms cl ON c.classroom_id = cl.id
      WHERE c.deleted_at IS NULL
    `;
    const params: any[] = [];

    if (options.school_id) {
      params.push(options.school_id);
      query += ` AND c.school_id = $${params.length}`;
    }

    if (options.classroom_id) {
      params.push(options.classroom_id);
      query += ` AND c.classroom_id = $${params.length}`;
    }

    if (options.program_id) {
      params.push(options.program_id);
      query += ` AND c.program_id = $${params.length}`;
    }

    if (options.status) {
      params.push(options.status);
      query += ` AND c.enrollment_status = $${params.length}`;
    }

    if (options.has_allergy) {
      query += ` AND cardinality(c.allergies) > 0`;
    }

    if (options.search) {
      params.push(`%${options.search.toLowerCase()}%`);
      query += ` AND (
        LOWER(c.first_name) LIKE $${params.length} OR 
        LOWER(c.last_name) LIKE $${params.length} OR 
        LOWER(COALESCE(c.preferred_name, '')) LIKE $${params.length} OR
        LOWER(COALESCE(c.admission_number, '')) LIKE $${params.length}
      )`;
    }

    query += ` ORDER BY c.first_name ASC, c.last_name ASC`;

    const limit = options.limit || 100;
    const offset = options.offset || 0;
    params.push(limit);
    query += ` LIMIT $${params.length}`;
    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const res = await pool.query(query, params);

    return res.rows.map((row) => ({
      ...row,
      calculated_age: this.calculateAge(row.date_of_birth),
    }));
  }

  static async getChildById(childId: string): Promise<ChildProfileDTO | null> {
    const childRes = await pool.query(
      `SELECT c.*, 
              p.name as program_name, p.slug as program_slug, p.color_code as program_color,
              cl.name as classroom_name, cl.room_number as classroom_room_number
       FROM children c
       LEFT JOIN programs p ON c.program_id = p.id
       LEFT JOIN classrooms cl ON c.classroom_id = cl.id
       WHERE c.id = $1 AND c.deleted_at IS NULL`,
      [childId]
    );

    if (childRes.rows.length === 0) return null;

    const child = childRes.rows[0];

    // Fetch Guardians
    const guardiansRes = await pool.query(
      `SELECT cg.*, 
              pr.first_name as parent_first_name, pr.last_name as parent_last_name,
              pr.email as parent_email, pr.phone as parent_phone, pr.address as parent_address,
              pr.occupation as parent_occupation
       FROM child_guardians cg
       JOIN parents pr ON cg.parent_id = pr.id
       WHERE cg.child_id = $1
       ORDER BY cg.is_primary DESC, cg.emergency_priority ASC`,
      [childId]
    );

    // Fetch Authorized Pickups
    const pickupsRes = await pool.query(
      `SELECT * FROM authorized_pickups WHERE child_id = $1 ORDER BY created_at ASC`,
      [childId]
    );

    return {
      ...child,
      guardians: guardiansRes.rows,
      authorized_pickups: pickupsRes.rows,
      calculated_age: this.calculateAge(child.date_of_birth),
    };
  }

  static async createChild(data: any, actorId?: string): Promise<Child> {
    const admissionNumber =
      data.admission_number || `LS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const res = await pool.query(
      `INSERT INTO children (
        school_id, program_id, classroom_id, first_name, middle_name, last_name, 
        preferred_name, date_of_birth, gender, photo_url, admission_number, 
        admission_date, enrollment_status, allergies, dietary_restrictions, 
        food_preferences, medical_notes, medication_instructions, nap_preferences, 
        toilet_training_status, other_care_instructions
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`,
      [
        data.school_id,
        data.program_id || null,
        data.classroom_id || null,
        data.first_name,
        data.middle_name || null,
        data.last_name,
        data.preferred_name || null,
        data.date_of_birth,
        data.gender,
        data.photo_url || null,
        admissionNumber,
        data.admission_date || new Date().toISOString().split('T')[0],
        data.enrollment_status || 'active',
        data.allergies || [],
        data.dietary_restrictions || [],
        data.food_preferences || null,
        data.medical_notes || null,
        data.medication_instructions || null,
        data.nap_preferences || null,
        data.toilet_training_status || 'in_training',
        data.other_care_instructions || null,
      ]
    );

    const child = res.rows[0];

    await AuditService.log({
      school_id: data.school_id,
      user_id: actorId,
      action: 'CHILD_REGISTERED',
      entity_type: 'children',
      entity_id: child.id,
      new_values: { name: `${child.first_name} ${child.last_name}`, admission_number: admissionNumber },
    });

    return child;
  }

  static async updateChild(childId: string, data: any, actorId?: string): Promise<Child> {
    const existing = await this.getChildById(childId);
    if (!existing) throw new Error('Child not found');

    const res = await pool.query(
      `UPDATE children SET
        program_id = COALESCE($1, program_id),
        classroom_id = COALESCE($2, classroom_id),
        first_name = COALESCE($3, first_name),
        middle_name = COALESCE($4, middle_name),
        last_name = COALESCE($5, last_name),
        preferred_name = COALESCE($6, preferred_name),
        date_of_birth = COALESCE($7, date_of_birth),
        gender = COALESCE($8, gender),
        photo_url = COALESCE($9, photo_url),
        enrollment_status = COALESCE($10, enrollment_status),
        allergies = COALESCE($11, allergies),
        dietary_restrictions = COALESCE($12, dietary_restrictions),
        food_preferences = COALESCE($13, food_preferences),
        medical_notes = COALESCE($14, medical_notes),
        medication_instructions = COALESCE($15, medication_instructions),
        nap_preferences = COALESCE($16, nap_preferences),
        toilet_training_status = COALESCE($17, toilet_training_status),
        other_care_instructions = COALESCE($18, other_care_instructions)
       WHERE id = $19
       RETURNING *`,
      [
        data.program_id !== undefined ? data.program_id : null,
        data.classroom_id !== undefined ? data.classroom_id : null,
        data.first_name,
        data.middle_name,
        data.last_name,
        data.preferred_name,
        data.date_of_birth,
        data.gender,
        data.photo_url,
        data.enrollment_status,
        data.allergies,
        data.dietary_restrictions,
        data.food_preferences,
        data.medical_notes,
        data.medication_instructions,
        data.nap_preferences,
        data.toilet_training_status,
        data.other_care_instructions,
        childId,
      ]
    );

    await AuditService.log({
      school_id: existing.school_id,
      user_id: actorId,
      action: 'CHILD_PROFILE_UPDATED',
      entity_type: 'children',
      entity_id: childId,
      old_values: { allergies: existing.allergies, toilet_training_status: existing.toilet_training_status },
      new_values: data,
    });

    return res.rows[0];
  }

  static async addAuthorizedPickup(childId: string, data: any, actorId?: string): Promise<AuthorizedPickup> {
    const res = await pool.query(
      `INSERT INTO authorized_pickups (
        child_id, name, relationship, phone, photo_url, id_card_number, authorization_status, notes, security_pin
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        childId,
        data.name,
        data.relationship,
        data.phone,
        data.photo_url || null,
        data.id_card_number || null,
        data.authorization_status || 'approved',
        data.notes || null,
        data.security_pin || null,
      ]
    );

    const pickup = res.rows[0];

    await AuditService.log({
      user_id: actorId,
      action: 'AUTHORIZED_PICKUP_ADDED',
      entity_type: 'authorized_pickups',
      entity_id: pickup.id,
      new_values: { child_id: childId, name: pickup.name, relationship: pickup.relationship },
    });

    return pickup;
  }

  static async updatePickupStatus(
    pickupId: string,
    status: PickupAuthorizationStatus,
    actorId?: string
  ): Promise<AuthorizedPickup> {
    const res = await pool.query(
      `UPDATE authorized_pickups SET authorization_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      [status, pickupId]
    );

    if (res.rows.length === 0) throw new Error('Authorized pickup not found');

    const updated = res.rows[0];

    await AuditService.log({
      user_id: actorId,
      action: 'PICKUP_AUTHORIZATION_CHANGED',
      entity_type: 'authorized_pickups',
      entity_id: pickupId,
      new_values: { status },
    });

    return updated;
  }

  static async listParents(options: { school_id?: string | null; search?: string }): Promise<any[]> {
    let query = `
      SELECT pr.*, 
             COALESCE(
               json_agg(
                 json_build_object(
                   'child_id', c.id,
                   'child_name', c.first_name || ' ' || c.last_name,
                   'relationship', cg.relationship,
                   'classroom_name', cl.name
                 )
               ) FILTER (WHERE c.id IS NOT NULL), '[]'
             ) as children
      FROM parents pr
      LEFT JOIN child_guardians cg ON pr.id = cg.parent_id
      LEFT JOIN children c ON cg.child_id = c.id AND c.deleted_at IS NULL
      LEFT JOIN classrooms cl ON c.classroom_id = cl.id
      WHERE pr.deleted_at IS NULL
    `;
    const params: any[] = [];

    if (options.school_id) {
      params.push(options.school_id);
      query += ` AND pr.school_id = $${params.length}`;
    }

    if (options.search) {
      params.push(`%${options.search.toLowerCase()}%`);
      query += ` AND (
        LOWER(pr.first_name) LIKE $${params.length} OR 
        LOWER(pr.last_name) LIKE $${params.length} OR 
        LOWER(pr.email) LIKE $${params.length} OR
        LOWER(pr.phone) LIKE $${params.length}
      )`;
    }

    query += ` GROUP BY pr.id ORDER BY pr.first_name ASC`;

    const res = await pool.query(query, params);
    return res.rows;
  }

  static async getParentChildren(userId: string): Promise<ChildProfileDTO[]> {
    // Find parent record matching user_id or email
    const parentRes = await pool.query(
      `SELECT p.id FROM parents p
       JOIN users u ON LOWER(p.email) = LOWER(u.email) OR p.user_id = u.id
       WHERE u.id = $1`,
      [userId]
    );

    if (parentRes.rows.length === 0) return [];

    const parentId = parentRes.rows[0].id;

    const childIdsRes = await pool.query(
      `SELECT child_id FROM child_guardians WHERE parent_id = $1`,
      [parentId]
    );

    const children: ChildProfileDTO[] = [];
    for (const row of childIdsRes.rows) {
      const child = await this.getChildById(row.child_id);
      if (child) children.push(child);
    }

    return children;
  }

  static async checkParentAccessToChild(userId: string, childId: string): Promise<boolean> {
    const res = await pool.query(
      `SELECT 1 FROM child_guardians cg
       JOIN parents p ON cg.parent_id = p.id
       JOIN users u ON LOWER(p.email) = LOWER(u.email) OR p.user_id = u.id
       WHERE u.id = $1 AND cg.child_id = $2`,
      [userId, childId]
    );
    return res.rows.length > 0;
  }
}
