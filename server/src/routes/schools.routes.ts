import { Router } from 'express';
import { SchoolsController } from '../controllers/schools.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';

const router = Router();

router.use(authenticateToken);

router.get('/current', SchoolsController.getCurrentSchool);
router.put(
  '/current',
  requireRoles('super_admin', 'school_admin'),
  SchoolsController.updateSchool
);
router.get('/programs', SchoolsController.listPrograms);
router.get('/classrooms', SchoolsController.listClassrooms);

export default router;
