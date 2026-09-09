import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { User, UserRole, UserStatus } from '../types/index.js';
import { AuditService } from './audit.service.js';

export interface CreateUserInput {
  school_id: string;
  role_id: UserRole;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  title?: string;
  avatar_url?: string;
}

export interface UpdateUserInput {
  first_name?: string;
  last_name?: string;
  phone?: string;
  title?: string;
  avatar_url?: string;
  role_id?: UserRole;
}

export class UserService {
  static async listUsers(options: {
    school_id?: string | null;
    role?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = `
      SELECT u.id, u.school_id, u.role_id, u.email, u.first_name, u.last_name, 
             u.phone, u.avatar_url, u.title, u.status, u.last_login_at, u.created_at,
             r.display_name as role_name, s.name as school_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN schools s ON u.school_id = s.id
      WHERE u.deleted_at IS NULL
    `;
    const params: any[] = [];

    if (options.school_id) {
      params.push(options.school_id);
      query += ` AND u.school_id = $${params.length}`;
    }

    if (options.role) {
      params.push(options.role);
      query += ` AND u.role_id = $${params.length}`;
    }

    if (options.status) {
      params.push(options.status);
      query += ` AND u.status = $${params.length}`;
    }

    if (options.search) {
      params.push(`%${options.search.toLowerCase()}%`);
      query += ` AND (
        LOWER(u.first_name) LIKE $${params.length} OR 
        LOWER(u.last_name) LIKE $${params.length} OR 
        LOWER(u.email) LIKE $${params.length}
      )`;
    }

    query += ` ORDER BY u.created_at DESC`;

    const limit = options.limit || 50;
    const offset = options.offset || 0;
    params.push(limit);
    query += ` LIMIT $${params.length}`;
    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const res = await pool.query(query, params);
    return res.rows;
  }

  static async getUserById(userId: string) {
    const res = await pool.query(
      `SELECT u.id, u.school_id, u.role_id, u.email, u.first_name, u.last_name, 
              u.phone, u.avatar_url, u.title, u.status, u.last_login_at, u.created_at,
              r.display_name as role_name, s.name as school_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       LEFT JOIN schools s ON u.school_id = s.id
       WHERE u.id = $1 AND u.deleted_at IS NULL`,
      [userId]
    );
    return res.rows[0] || null;
  }

  static async createUser(data: CreateUserInput, actorId?: string): Promise<User> {
    const existing = await pool.query(
      `SELECT id FROM users WHERE LOWER(email) = LOWER($1) AND deleted_at IS NULL`,
      [data.email]
    );
    if (existing.rows.length > 0) {
      throw new Error(`A user with email "${data.email}" already exists.`);
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const res = await pool.query(
      `INSERT INTO users (school_id, role_id, email, password_hash, first_name, last_name, phone, title, avatar_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'active')
       RETURNING id, school_id, role_id, email, first_name, last_name, phone, title, avatar_url, status, created_at, updated_at`,
      [
        data.school_id,
        data.role_id,
        data.email.toLowerCase(),
        passwordHash,
        data.first_name,
        data.last_name,
        data.phone || null,
        data.title || null,
        data.avatar_url || null,
      ]
    );

    const user = res.rows[0];

    await AuditService.log({
      school_id: data.school_id,
      user_id: actorId,
      action: 'USER_CREATED',
      entity_type: 'users',
      entity_id: user.id,
      new_values: { email: user.email, role_id: user.role_id, name: `${user.first_name} ${user.last_name}` },
    });

    return user;
  }

  static async updateUserStatus(userId: string, status: UserStatus, actorId?: string) {
    const prev = await this.getUserById(userId);
    if (!prev) throw new Error('User not found');

    const res = await pool.query(
      `UPDATE users SET status = $1 WHERE id = $2 RETURNING id, status, email`,
      [status, userId]
    );

    await AuditService.log({
      school_id: prev.school_id,
      user_id: actorId,
      action: 'USER_STATUS_UPDATED',
      entity_type: 'users',
      entity_id: userId,
      old_values: { status: prev.status },
      new_values: { status },
    });

    return res.rows[0];
  }

  static async softDeleteUser(userId: string, actorId?: string) {
    const user = await this.getUserById(userId);
    if (!user) throw new Error('User not found');

    await pool.query(
      `UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [userId]
    );

    await AuditService.log({
      school_id: user.school_id,
      user_id: actorId,
      action: 'USER_DELETED',
      entity_type: 'users',
      entity_id: userId,
    });

    return true;
  }
}
