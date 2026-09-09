import { pool } from '../config/db.js';

export interface CreateAuditLogParams {
  school_id?: string | null;
  user_id?: string | null;
  user_email?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  old_values?: any;
  new_values?: any;
  ip_address?: string | null;
  user_agent?: string | null;
}

export class AuditService {
  static async log(params: CreateAuditLogParams): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO audit_logs (school_id, user_id, user_email, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          params.school_id || null,
          params.user_id || null,
          params.user_email || null,
          params.action,
          params.entity_type,
          params.entity_id || null,
          params.old_values ? JSON.stringify(params.old_values) : null,
          params.new_values ? JSON.stringify(params.new_values) : null,
          params.ip_address || null,
          params.user_agent || null
        ]
      );
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }

  static async getRecentLogs(schoolId?: string | null, limit: number = 20) {
    let query = `
      SELECT a.*, u.first_name, u.last_name, u.role_id 
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
    `;
    const args: any[] = [];
    if (schoolId) {
      query += ` WHERE a.school_id = $1 `;
      args.push(schoolId);
    }
    query += ` ORDER BY a.created_at DESC LIMIT $${args.length + 1}`;
    args.push(limit);

    const res = await pool.query(query, args);
    return res.rows;
  }
}
