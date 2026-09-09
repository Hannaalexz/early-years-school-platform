import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AuthRequest, AuthenticatedUser } from '../types/index.js';
import { AuthService } from '../services/auth.service.js';

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required. No token provided.',
      });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
    const userProfile = await AuthService.getUserProfile(decoded.id);

    if (!userProfile) {
      res.status(401).json({
        success: false,
        error: 'USER_NOT_FOUND',
        message: 'The account associated with this session no longer exists or has been removed.',
      });
      return;
    }

    req.user = userProfile;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'TOKEN_EXPIRED',
        message: 'Your session has expired. Please log in again.',
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Authentication failed. Invalid token signature.',
    });
  }
};
