import { Response, NextFunction } from 'express';
import { AuthRequest, UserRole } from '../types/index.js';

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication is required for this resource.',
      });
      return;
    }

    if (req.user.role === 'super_admin') {
      // Super admin has global system access
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'FORBIDDEN_ROLE',
        message: `Access denied. Role "${req.user.role}" does not have sufficient permissions for this operation.`,
        requiredRoles: allowedRoles,
      });
      return;
    }

    next();
  };
};

export const requirePermissions = (...requiredPermissions: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'UNAUTHORIZED',
        message: 'Authentication required.',
      });
      return;
    }

    if (req.user.role === 'super_admin' || req.user.permissions.includes('system:all')) {
      return next();
    }

    const hasAll = requiredPermissions.every((p) => req.user?.permissions.includes(p));

    if (!hasAll) {
      res.status(403).json({
        success: false,
        error: 'INSUFFICIENT_PERMISSIONS',
        message: 'You do not hold the required permissions to perform this action.',
        requiredPermissions,
      });
      return;
    }

    next();
  };
};

export const requireSchoolAccess = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'UNAUTHORIZED', message: 'Authentication required.' });
    return;
  }

  if (req.user.role === 'super_admin') {
    return next();
  }

  const requestedSchoolId = req.params.schoolId || req.body.school_id || req.query.school_id;
  if (requestedSchoolId && requestedSchoolId !== req.user.school_id) {
    res.status(403).json({
      success: false,
      error: 'TENANT_VIOLATION',
      message: 'Cross-tenant access forbidden. You cannot access data outside your assigned school.',
    });
    return;
  }

  next();
};
