import express from 'express';
import { loginAdmin, getAdminProfile } from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/verify', protectAdmin, getAdminProfile);

export default router;
