import { Response } from 'express';
import { z } from 'zod';
import { UserService } from '../services/user.service.js';
import { AuthRequest, UserRole, UserStatus } from '../types/index.js';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  role_id: z.enum(['super_admin', 'school_admin', 'teacher', 'parent', 'finance', 'admissions']),
  phone: z.string().optional(),
  title: z.string().optional(),
  school_id: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['active', 'inactive', 'suspended']),
});

export class UsersController {
  static async listUsers(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { role, status, search, limit, offset } = req.query;
      const school_id = req.user?.role === 'super_admin' ? (req.query.school_id as string) : req.user?.school_id;

      const users = await UserService.listUsers({
        school_id,
        role: role as string,
        status: status as string,
        search: search as string,
        limit: limit ? parseInt(limit as string, 10) : 50,
        offset: offset ? parseInt(offset as string, 10) : 0,
      });

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'USER_FETCH_ERROR',
        message: error.message,
      });
    }
  }

  static async getUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'NOT_FOUND',
          message: 'User not found',
        });
        return;
      }

      // Check tenant authorization
      if (req.user?.role !== 'super_admin' && user.school_id !== req.user?.school_id) {
        res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Access to user from another school is forbidden',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'USER_FETCH_ERROR',
        message: error.message,
      });
    }
  }

  static async createUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      const school_id = req.user?.role === 'super_admin' ? (req.body.school_id || req.user?.school_id) : req.user?.school_id;

      if (!school_id) {
        res.status(400).json({
          success: false,
          error: 'SCHOOL_REQUIRED',
          message: 'A valid school_id is required to register a user',
        });
        return;
      }

      const newUser = await UserService.createUser(
        {
          ...req.body,
          school_id,
        },
        req.user?.id
      );

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'USER_CREATE_FAILED',
        message: error.message,
      });
    }
  }

  static async updateStatus(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const updated = await UserService.updateUserStatus(req.params.id, status as UserStatus, req.user?.id);

      res.status(200).json({
        success: true,
        message: `User status changed to ${status}`,
        data: updated,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'STATUS_UPDATE_FAILED',
        message: error.message,
      });
    }
  }

  static async deleteUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      await UserService.softDeleteUser(req.params.id, req.user?.id);
      res.status(200).json({
        success: true,
        message: 'User deactivated successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: 'DELETE_FAILED',
        message: error.message,
      });
    }
  }
}
