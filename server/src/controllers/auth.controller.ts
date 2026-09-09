import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service.js';
import { AuthRequest } from '../types/index.js';
import { AuditService } from '../services/audit.service.js';

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.get('user-agent');

      const result = await AuthService.login(email, password, ip, userAgent);

      // Set secure cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        error: 'AUTHENTICATION_FAILED',
        message: error.message || 'Invalid email or password',
      });
    }
  }

  static async me(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Not logged in',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: req.user,
    });
  }

  static async logout(req: AuthRequest, res: Response): Promise<void> {
    if (req.user) {
      await AuditService.log({
        school_id: req.user.school_id,
        user_id: req.user.id,
        user_email: req.user.email,
        action: 'AUTH_LOGOUT',
        entity_type: 'users',
        entity_id: req.user.id,
        ip_address: req.ip,
      });
    }

    res.clearCookie('token');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  static async getDemoAccounts(req: Request, res: Response): Promise<void> {
    try {
      const accounts = await AuthService.getDemoAccounts();
      res.status(200).json({
        success: true,
        data: accounts,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'DEMO_FETCH_ERROR',
        message: error.message,
      });
    }
  }
}
