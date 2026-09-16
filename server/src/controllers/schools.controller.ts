import { Response } from 'express';
import { pool } from '../config/db.js';
import { AuthRequest } from '../types/index.js';
import { AuditService } from '../services/audit.service.js';

export class SchoolsController {
  static async getCurrentSchool(req: AuthRequest, res: Response): Promise<void> {
    try {
      const schoolId = req.user?.school_id;

      // If user is super_admin without school_id, default to first school
      let query = 'SELECT * FROM schools WHERE is_active = true';
      const params: any[] = [];
      if (schoolId) {
        query += ' AND id = $1';
        params.push(schoolId);
      }
      query += ' LIMIT 1';

      const schoolRes = await pool.query(query, params);
      if (schoolRes.rows.length === 0) {
        res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'No active school found' });
        return;
      }

      const school = schoolRes.rows[0];

      // Fetch campuses, programs, classrooms, and current academic year
      const [campuses, programs, classrooms, academicYears] = await Promise.all([
        pool.query('SELECT * FROM campuses WHERE school_id = $1 ORDER BY is_main DESC, name ASC', [school.id]),
        pool.query('SELECT * FROM programs WHERE school_id = $1 ORDER BY age_group_min_months ASC', [school.id]),
        pool.query(
          `SELECT c.*, p.name as program_name, p.color_code as program_color, cp.name as campus_name
           FROM classrooms c
           LEFT JOIN programs p ON c.program_id = p.id
           LEFT JOIN campuses cp ON c.campus_id = cp.id
           WHERE c.school_id = $1 ORDER BY c.name ASC`,
          [school.id]
        ),
        pool.query('SELECT * FROM academic_years WHERE school_id = $1 ORDER BY is_current DESC, start_date DESC', [school.id]),
      ]);

      res.status(200).json({
        success: true,
        data: {
          school,
          campuses: campuses.rows,
          programs: programs.rows,
          classrooms: classrooms.rows,
          current_academic_year: academicYears.rows.find((y) => y.is_current) || academicYears.rows[0] || null,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'SCHOOL_FETCH_ERROR',
        message: error.message,
      });
    }
  }

  static async updateSchool(req: AuthRequest, res: Response): Promise<void> {
    try {
      const schoolId = (req.user?.school_id || req.params.id) as string;
      const { name, tagline, address, city, phone, email, website, currency } = req.body;

      const updated = await pool.query(
        `UPDATE schools
         SET name = COALESCE($1, name),
             tagline = COALESCE($2, tagline),
             address = COALESCE($3, address),
             city = COALESCE($4, city),
             phone = COALESCE($5, phone),
             email = COALESCE($6, email),
             website = COALESCE($7, website),
             currency = COALESCE($8, currency)
         WHERE id = $9
         RETURNING *`,
        [name, tagline, address, city, phone, email, website, currency, schoolId]
      );

      await AuditService.log({
        school_id: schoolId,
        user_id: req.user?.id,
        action: 'SCHOOL_PROFILE_UPDATED',
        entity_type: 'schools',
        entity_id: schoolId,
        new_values: req.body,
      });

      res.status(200).json({
        success: true,
        message: 'School profile updated successfully',
        data: updated.rows[0],
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'UPDATE_FAILED',
        message: error.message,
      });
    }
  }

  static async listPrograms(req: AuthRequest, res: Response): Promise<void> {
    try {
      const schoolId = req.user?.school_id || (req.query.school_id as string);
      const resData = await pool.query(
        `SELECT * FROM programs WHERE school_id = $1 ORDER BY age_group_min_months ASC`,
        [schoolId]
      );
      res.status(200).json({ success: true, data: resData.rows });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'PROGRAMS_FETCH_ERROR', message: error.message });
    }
  }

  static async listClassrooms(req: AuthRequest, res: Response): Promise<void> {
    try {
      const schoolId = req.user?.school_id || (req.query.school_id as string);
      const resData = await pool.query(
        `SELECT c.*, p.name as program_name, p.color_code as program_color, cp.name as campus_name
         FROM classrooms c
         LEFT JOIN programs p ON c.program_id = p.id
         LEFT JOIN campuses cp ON c.campus_id = cp.id
         WHERE c.school_id = $1
         ORDER BY c.name ASC`,
        [schoolId]
      );
      res.status(200).json({ success: true, data: resData.rows });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'CLASSROOMS_FETCH_ERROR', message: error.message });
    }
  }
}
