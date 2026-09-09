import { Response } from 'express';
import { AuthRequest } from '../types/index.js';
import { AuditService } from '../services/audit.service.js';
import { pool } from '../config/db.js';

export class DashboardController {
  static async getStats(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = req.user!;
      const schoolId = user.school_id;

      // Common counts from DB
      const userCountRes = await pool.query(
        `SELECT role_id, COUNT(*) as count FROM users WHERE school_id = $1 AND deleted_at IS NULL GROUP BY role_id`,
        [schoolId]
      );
      const userCounts = userCountRes.rows.reduce((acc, row) => {
        acc[row.role_id] = parseInt(row.count, 10);
        return acc;
      }, {} as Record<string, number>);

      const classroomRes = await pool.query(
        `SELECT COUNT(*) as count FROM classrooms WHERE school_id = $1`,
        [schoolId]
      );
      const totalClassrooms = parseInt(classroomRes.rows[0]?.count || '4', 10);

      // Return role-specific dashboard payload
      let statsPayload: any = {
        role: user.role,
        school_id: schoolId,
        user_name: `${user.first_name} ${user.last_name}`,
      };

      if (user.role === 'super_admin' || user.role === 'school_admin') {
        statsPayload = {
          ...statsPayload,
          kpis: {
            totalChildren: 28,
            presentToday: 26,
            absentToday: 2,
            totalStaff: (userCounts['teacher'] || 1) + (userCounts['school_admin'] || 1),
            attendanceRate: 92.8,
            totalClassrooms,
            dailyReportsCompleted: 24,
            activeAllergies: 3,
            todayIncidents: 0,
          },
          todayOverview: {
            arrivedOnTime: 24,
            lateArrivals: 2,
            napTimeInProgress: 14,
            mealsServed: 'Breakfast & Morning Snack completed',
            incidentReports: 0,
            totalClassrooms,
          },
          classroomCapacities: [
            { name: 'Sunshine Classroom (KG1)', enrolled: 18, capacity: 18, fill: 100 },
            { name: 'Rainbow Classroom (Nursery)', enrolled: 14, capacity: 16, fill: 87.5 },
            { name: 'Butterfly Room (Toddlers)', enrolled: 10, capacity: 12, fill: 83.3 },
            { name: 'Little Explorers (KG2)', enrolled: 16, capacity: 20, fill: 80 },
          ],
        };
      } else if (user.role === 'teacher') {
        statsPayload = {
          ...statsPayload,
          classroom: {
            name: 'Sunshine Classroom',
            program: 'Preschool (KG 1)',
            room: 'A-101',
            totalChildren: 18,
            presentToday: 16,
            absentToday: 2,
            attendanceMarked: true,
          },
          dailyCareStatus: {
            breakfastRecorded: 18,
            snackRecorded: 18,
            lunchRecorded: 16,
            napsRecorded: 16,
            reportsPending: 2,
          },
          todayActivities: [
            { time: '09:30 AM', title: 'Finger Painting & Color Mixing', area: 'Fine Motor / Creativity' },
            { time: '10:45 AM', title: 'Story Time: The Very Hungry Caterpillar', area: 'Language & Literacy' },
            { time: '02:00 PM', title: 'Outdoor Counting Scavenger Hunt', area: 'Cognitive / Math' },
          ],
        };
      } else if (user.role === 'parent') {
        statsPayload = {
          ...statsPayload,
          children: [
            {
              id: 'child-emma',
              name: 'Emma Johnson',
              age: '4 years 3 months',
              program: 'Preschool (KG 1)',
              classroom: 'Sunshine Classroom',
              statusToday: 'Present',
              arrivedAt: '08:55 AM',
              mood: 'Happy 😊',
              nap: '1h 15m (Rested well)',
              meals: {
                breakfast: 'Ate all (Oatmeal & sliced bananas)',
                lunch: 'Ate most (Steamed veggies & chicken rice)',
                snack: 'Ate all (Apple slices & crackers)',
              },
              latestActivity: 'Finger Painting — Color Mixing Exploration',
              recentPhotoCount: 6,
            },
            {
              id: 'child-noah',
              name: 'Noah Johnson',
              age: '1 year 8 months',
              program: 'Toddler Playgroup',
              classroom: 'Butterfly Room',
              statusToday: 'Present',
              arrivedAt: '08:55 AM',
              mood: 'Playful & Calm 🥰',
              nap: '1h 45m (Sleeping peacefully)',
              meals: {
                breakfast: 'Ate well (Warm porridge)',
                lunch: 'In progress',
                snack: 'Pending afternoon',
              },
              latestActivity: 'Sensory Texture Ball Exploration',
              recentPhotoCount: 4,
            },
          ],
        };
      }

      res.status(200).json({
        success: true,
        data: statsPayload,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'STATS_FETCH_ERROR',
        message: error.message,
      });
    }
  }

  static async getAuditLogs(req: AuthRequest, res: Response): Promise<void> {
    try {
      const schoolId = req.user?.role === 'super_admin' ? null : req.user?.school_id;
      const logs = await AuditService.getRecentLogs(schoolId, 25);

      res.status(200).json({
        success: true,
        data: logs,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'AUDIT_FETCH_ERROR',
        message: error.message,
      });
    }
  }
}
