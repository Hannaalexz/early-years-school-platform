import { Router } from 'express';
import { ChildrenController } from '../controllers/children.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';

const router = Router();

router.use(authenticateToken);

router.get(
  '/',
  requireRoles('super_admin', 'school_admin', 'teacher', 'admissions'),
  ChildrenController.listParents
);

export default router;
