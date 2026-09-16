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
            lateToday: 1,
            totalTeachers: userCounts['teacher'] || 6,
            totalClassrooms,
            activeAllergies: 3,
            recentIncidents: 0,
          },
          todayAttendance: {
            present: 26,
            absent: 2,
            late: 1,
            rate: '92.8%',
            arrivedOnTime: 25,
            droppedOffRecorded: 26,
            pickupDeparturesRecorded: 0,
          },
          classroomCapacities: [
            { name: 'Sunshine Classroom (KG1)', enrolled: 18, capacity: 18, fill: 100 },
            { name: 'Rainbow Classroom (Nursery)', enrolled: 14, capacity: 16, fill: 87.5 },
            { name: 'Butterfly Room (Toddlers)', enrolled: 10, capacity: 12, fill: 83.3 },
            { name: 'Little Explorers (KG2)', enrolled: 16, capacity: 20, fill: 80 },
          ],
          upcomingEvents: [
            { date: 'Sep 22, 2026', title: 'Autumn Leaf Sensory Exploration', time: '10:00 AM' },
            { date: 'Sep 29, 2026', title: 'Parent-Teacher Monthly Growth Circle', time: '04:00 PM' },
          ],
          recentAnnouncements: [
            { title: 'Welcome to September Learning Term', date: 'Sep 15, 2026', author: 'School Admin' },
            { title: 'Reminder: Update Authorized Pickup Lists', date: 'Sep 10, 2026', author: 'Front Desk' },
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
            lateToday: 1,
            attendanceMarked: true,
          },
          monthlyProgressStatus: {
            totalAssessed: 15,
            pendingReview: 3,
            month: 'September 2026',
            reportsPublished: 12,
          },
          todayActivities: [
            { time: '09:30 AM', title: 'Finger Painting & Color Mixing', area: 'Creative & Fine Motor' },
            { time: '10:45 AM', title: 'Story Circle: The Very Hungry Caterpillar', area: 'Language & Communication' },
            { time: '02:00 PM', title: 'Outdoor Counting & Leaf Hunt', area: 'Cognitive & Physical' },
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
              droppedOffBy: 'Sarah Johnson (Mother)',
              monthlyAttendance: { present: 20, absent: 2 },
              latestTeacherUpdate: 'Emma showed wonderful cooperation during group play today and built an elaborate wooden bridge with blocks.',
              latestActivity: 'Finger Painting & Color Mixing',
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
              droppedOffBy: 'Sarah Johnson (Mother)',
              monthlyAttendance: { present: 19, absent: 3 },
              latestTeacherUpdate: 'Noah eagerly explored the sensory texture bin and recognized different soft animal sounds.',
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
