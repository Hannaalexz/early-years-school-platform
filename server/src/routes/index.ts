import { Router } from 'express';
import authRoutes from './auth.routes.js';
import usersRoutes from './users.routes.js';
import schoolsRoutes from './schools.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import rolesRoutes from './roles.routes.js';
import childrenRoutes from './children.routes.js';
import parentsRoutes from './parents.routes.js';
import portalRoutes from './portal.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/schools', schoolsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/roles', rolesRoutes);
router.use('/children', childrenRoutes);
router.use('/parents', parentsRoutes);
router.use('/portal', portalRoutes);

export default router;
