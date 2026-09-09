import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';

const router = Router();

router.use(authenticateToken);

router.get('/stats', DashboardController.getStats);
router.get(
  '/audit-logs',
  requireRoles('super_admin', 'school_admin'),
  DashboardController.getAuditLogs
);

export default router;
