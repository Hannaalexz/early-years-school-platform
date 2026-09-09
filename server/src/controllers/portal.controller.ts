import { Request, Response } from 'express';
import { PortalService } from '../services/portal.service.js';
import { PortalAuthRequest } from '../middleware/portalAuth.js';

export class PortalController {
  /**
   * Parent Portal PIN Login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, pin } = req.body;

      if (!identifier || !pin) {
        res.status(400).json({
          success: false,
          error: 'MISSING_FIELDS',
          message: 'Please provide both your Portal Access Code (or email/phone) and 4-digit PIN.',
        });
        return;
      }

      const result = await PortalService.loginWithPortalPin(identifier, pin);

      // Set cookie as well for easy browser navigation
      res.cookie('portal_token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: 'lax',
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      const isAuthError = error.message.startsWith('PARENT_NOT_FOUND') || error.message.startsWith('INVALID_PIN');
      res.status(isAuthError ? 401 : 500).json({
        success: false,
        error: isAuthError ? 'PORTAL_AUTH_FAILED' : 'SERVER_ERROR',
        message: error.message,
      });
    }
  }

  /**
   * Get Current Parent Profile in Portal
   */
  static async getMe(req: PortalAuthRequest, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: {
          parent: req.parentUser,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'SERVER_ERROR',
        message: error.message,
      });
    }
  }

  /**
   * Get all children for the authenticated parent
   */
  static async getChildren(req: PortalAuthRequest, res: Response): Promise<void> {
    try {
      const parentId = req.parentUser!.id;
      const children = await PortalService.getParentChildren(parentId);

      res.status(200).json({
        success: true,
        data: children,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: 'FETCH_CHILDREN_ERROR',
        message: error.message,
      });
    }
  }

  /**
   * Get live feed, daily care & development status for a specific child
   */
  static async getChildSummary(req: PortalAuthRequest, res: Response): Promise<void> {
    try {
      const parentId = req.parentUser!.id;
      const { childId } = req.params;

      const summary = await PortalService.getChildLiveFeed(parentId, childId);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({
        success: false,
        error: statusCode === 403 ? 'FORBIDDEN' : 'FETCH_SUMMARY_ERROR',
        message: error.message,
      });
    }
  }
}
