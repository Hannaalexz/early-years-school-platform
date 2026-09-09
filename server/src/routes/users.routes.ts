import { Router } from 'express';
import { UsersController, createUserSchema, updateStatusSchema } from '../controllers/users.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles, requirePermissions } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

router.use(authenticateToken);

// List users - requires users:read or users:manage
router.get(
  '/',
  requireRoles('super_admin', 'school_admin', 'finance', 'admissions'),
  requirePermissions('users:read'),
  UsersController.listUsers
);

// Get single user
router.get(
  '/:id',
  requireRoles('super_admin', 'school_admin'),
  UsersController.getUser
);

// Create user - requires admin role
router.post(
  '/',
  requireRoles('super_admin', 'school_admin'),
  requirePermissions('users:manage'),
  validateBody(createUserSchema),
  UsersController.createUser
);

// Update status (active, inactive, suspended)
router.patch(
  '/:id/status',
  requireRoles('super_admin', 'school_admin'),
  requirePermissions('users:manage'),
  validateBody(updateStatusSchema),
  UsersController.updateStatus
);

// Soft delete / deactivate user
router.delete(
  '/:id',
  requireRoles('super_admin', 'school_admin'),
  requirePermissions('users:manage'),
  UsersController.deleteUser
);

export default router;
