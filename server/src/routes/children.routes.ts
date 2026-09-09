import { Router } from 'express';
import {
  ChildrenController,
  createChildSchema,
  addPickupSchema,
} from '../controllers/children.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireRoles } from '../middleware/rbac.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

router.use(authenticateToken);

// Parent personal children route
router.get('/my', ChildrenController.getMyChildren);

// List children with filters
router.get(
  '/',
  requireRoles('super_admin', 'school_admin', 'teacher', 'admissions', 'parent'),
  ChildrenController.listChildren
);

// Get single child 360 profile
router.get(
  '/:id',
  requireRoles('super_admin', 'school_admin', 'teacher', 'parent', 'admissions'),
  ChildrenController.getChild
);

// Register child
router.post(
  '/',
  requireRoles('super_admin', 'school_admin', 'admissions'),
  validateBody(createChildSchema),
  ChildrenController.createChild
);

// Update child profile
router.put(
  '/:id',
  requireRoles('super_admin', 'school_admin', 'teacher'),
  ChildrenController.updateChild
);

// Authorized pickups
router.post(
  '/:id/authorized-pickups',
  requireRoles('super_admin', 'school_admin', 'parent'),
  validateBody(addPickupSchema),
  ChildrenController.addAuthorizedPickup
);

router.patch(
  '/:id/authorized-pickups/:pickupId/status',
  requireRoles('super_admin', 'school_admin'),
  ChildrenController.updatePickupStatus
);

export default router;
