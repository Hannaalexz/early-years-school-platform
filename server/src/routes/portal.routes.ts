import { Router } from 'express';
import { PortalController } from '../controllers/portal.controller.js';
import { authenticatePortalToken } from '../middleware/portalAuth.js';

const router = Router();

// Public: Parent Portal Login via Code / Phone + PIN
router.post('/login', PortalController.login);

// Protected: Requires valid Portal JWT token
router.use(authenticatePortalToken);

router.get('/me', PortalController.getMe);
router.get('/children', PortalController.getChildren);
router.get('/children/:childId', PortalController.getChildSummary);

export default router;
