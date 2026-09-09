import { Router } from 'express';
import { AuthController, loginSchema } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = Router();

router.post('/login', validateBody(loginSchema), AuthController.login);
router.get('/me', authenticateToken, AuthController.me);
router.post('/logout', authenticateToken, AuthController.logout);
router.get('/demo-accounts', AuthController.getDemoAccounts);

export default router;
