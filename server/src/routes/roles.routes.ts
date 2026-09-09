import { Router, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';
import { pool } from '../config/db.js';
import { AuthRequest } from '../types/index.js';

const router = Router();

router.use(authenticateToken);

router.get('/', requireRoles('super_admin', 'school_admin'), async (req: AuthRequest, res: Response) => {
  try {
    const rolesRes = await pool.query(
      `SELECT r.id, r.display_name, r.description, r.is_system, r.created_at,
              COUNT(DISTINCT rp.permission_id) as permissions_count,
              COUNT(DISTINCT u.id) as user_count
       FROM roles r
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN users u ON r.id = u.role_id AND u.deleted_at IS NULL
       GROUP BY r.id, r.display_name, r.description, r.is_system, r.created_at
       ORDER BY 
         CASE r.id
           WHEN 'super_admin' THEN 1
           WHEN 'school_admin' THEN 2
           WHEN 'teacher' THEN 3
           WHEN 'parent' THEN 4
           WHEN 'finance' THEN 5
           WHEN 'admissions' THEN 6
           ELSE 7
         END`
    );

    const permissionsRes = await pool.query(
      `SELECT * FROM permissions ORDER BY category ASC, id ASC`
    );

    const rolePermsRes = await pool.query(
      `SELECT role_id, permission_id FROM role_permissions`
    );

    res.status(200).json({
      success: true,
      data: {
        roles: rolesRes.rows,
        permissions: permissionsRes.rows,
        role_permissions: rolePermsRes.rows,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: 'ROLES_FETCH_FAILED', message: err.message });
  }
});

export default router;
