import express from 'express';
import { getMyShop, getDashboardStats } from '../controllers/merchant.controller.js';
import { authenticateJwt } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/my-shop', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), getMyShop);
router.get('/dashboard-stats', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), getDashboardStats);

export default router;
