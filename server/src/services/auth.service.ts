import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';
import { AuthenticatedUser, User } from '../types/index.js';
import { AuditService } from './audit.service.js';

export class AuthService {
  static generateToken(user: AuthenticatedUser): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        school_id: user.school_id,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );
  }

  static async getPermissionsForRole(roleId: string): Promise<string[]> {
    const res = await pool.query(
      `SELECT permission_id FROM role_permissions WHERE role_id = $1`,
      [roleId]
    );
    return res.rows.map((r) => r.permission_id);
  }

  static async login(
    email: string,
    password: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ user: AuthenticatedUser; token: string }> {
    const userRes = await pool.query(
      `SELECT u.*, s.name as school_name, s.code as school_code 
       FROM users u
       LEFT JOIN schools s ON u.school_id = s.id
       WHERE LOWER(u.email) = LOWER($1) AND u.deleted_at IS NULL`,
      [email]
    );

    if (userRes.rows.length === 0) {
      await AuditService.log({
        action: 'AUTH_LOGIN_FAILED_NOT_FOUND',
        entity_type: 'users',
        user_email: email,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
      throw new Error('Invalid email or password');
    }

    const rawUser = userRes.rows[0];

    if (rawUser.status === 'suspended') {
      throw new Error('Your account has been suspended. Please contact the school administrator.');
    }

    if (rawUser.status === 'inactive') {
      throw new Error('Your account is currently inactive. Please contact school administration.');
    }

    const isMatch = await bcrypt.compare(password, rawUser.password_hash);
    if (!isMatch) {
      await AuditService.log({
        school_id: rawUser.school_id,
        user_id: rawUser.id,
        user_email: rawUser.email,
        action: 'AUTH_LOGIN_FAILED_WRONG_PASSWORD',
        entity_type: 'users',
        entity_id: rawUser.id,
        ip_address: ipAddress,
        user_agent: userAgent,
      });
      throw new Error('Invalid email or password');
    }

    // Update last login
    await pool.query(
      `UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [rawUser.id]
    );

    const permissions = await this.getPermissionsForRole(rawUser.role_id);

    const authUser: AuthenticatedUser = {
      id: rawUser.id,
      email: rawUser.email,
      role: rawUser.role_id,
      school_id: rawUser.school_id,
      first_name: rawUser.first_name,
      last_name: rawUser.last_name,
      permissions,
    };

    const token = this.generateToken(authUser);

    await AuditService.log({
      school_id: rawUser.school_id,
      user_id: rawUser.id,
      user_email: rawUser.email,
      action: 'AUTH_LOGIN_SUCCESS',
      entity_type: 'users',
      entity_id: rawUser.id,
      ip_address: ipAddress,
      user_agent: userAgent,
    });

    return { user: authUser, token };
  }

  static async getUserProfile(userId: string): Promise<AuthenticatedUser | null> {
    const res = await pool.query(
      `SELECT u.id, u.email, u.role_id, u.school_id, u.first_name, u.last_name, u.title, u.avatar_url, u.status,
              s.name as school_name, s.code as school_code, s.currency as school_currency
       FROM users u
       LEFT JOIN schools s ON u.school_id = s.id
       WHERE u.id = $1 AND u.deleted_at IS NULL`,
      [userId]
    );

    if (res.rows.length === 0) return null;

    const row = res.rows[0];
    const permissions = await this.getPermissionsForRole(row.role_id);

    return {
      id: row.id,
      email: row.email,
      role: row.role_id,
      school_id: row.school_id,
      first_name: row.first_name,
      last_name: row.last_name,
      permissions,
    };
  }

  static async getDemoAccounts() {
    const res = await pool.query(
      `SELECT u.id, u.email, u.role_id, u.first_name, u.last_name, u.title, r.display_name as role_name
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.email IN (
         'superadmin@littlestars.edu',
         'admin@littlestars.edu',
         'teacher@littlestars.edu',
         'parent@littlestars.edu',
         'finance@littlestars.edu',
         'admissions@littlestars.edu'
       )
       ORDER BY 
         CASE u.role_id
           WHEN 'super_admin' THEN 1
           WHEN 'school_admin' THEN 2
           WHEN 'teacher' THEN 3
           WHEN 'parent' THEN 4
           WHEN 'finance' THEN 5
           WHEN 'admissions' THEN 6
           ELSE 7
         END`
    );

    const defaultPasswords: Record<string, string> = {
      super_admin: 'Admin123!',
      school_admin: 'Admin123!',
      teacher: 'Teacher123!',
      parent: 'Parent123!',
      finance: 'Finance123!',
      admissions: 'Admit123!',
    };

    return res.rows.map((r) => ({
      ...r,
      default_password: defaultPasswords[r.role_id] || 'Password123!',
    }));
  }
}
