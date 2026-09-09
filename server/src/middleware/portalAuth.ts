import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { pool } from '../config/db.js';

export interface PortalAuthRequest extends Request {
  parentUser?: {
    id: string;
    school_id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    portal_code: string;
  };
}

export const authenticatePortalToken = async (
  req: PortalAuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.portal_token) {
      token = req.cookies.portal_token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'PORTAL_AUTH_REQUIRED',
        message: 'Parent Portal access requires a valid session token. Please enter your portal code & PIN.',
      });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as { parentId: string; type?: string };
    if (!decoded.parentId) {
      res.status(401).json({
        success: false,
        error: 'INVALID_PORTAL_TOKEN',
        message: 'Invalid parent portal authentication token.',
      });
      return;
    }

    const result = await pool.query(
      `SELECT id, school_id, first_name, last_name, email, phone, portal_code
       FROM parents 
       WHERE id = $1 AND deleted_at IS NULL`,
      [decoded.parentId]
    );

    if (result.rows.length === 0) {
      res.status(401).json({
        success: false,
        error: 'PARENT_NOT_FOUND',
        message: 'The parent account linked to this portal session no longer exists.',
      });
      return;
    }

    req.parentUser = result.rows[0];
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({
        success: false,
        error: 'PORTAL_TOKEN_EXPIRED',
        message: 'Your parent portal session has expired. Please enter your PIN again.',
      });
      return;
    }

    res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Portal authentication failed.',
    });
  }
};
