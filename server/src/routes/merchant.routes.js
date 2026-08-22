import express from 'express';
import {
  getMyShop,
  getDashboardStats,
  submitMerchantOnboarding,
  getMerchantStatus,
  getAllMerchants,
  approveMerchant,
  rejectMerchant,
} from '../controllers/merchant.controller.js';
import { authenticateJwt } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// Merchant routes
router.get('/my-shop', authenticateJwt, getMyShop);
router.get('/dashboard-stats', authenticateJwt, getDashboardStats);
router.post('/onboarding', authenticateJwt, submitMerchantOnboarding);
router.get('/status', authenticateJwt, getMerchantStatus);

// Admin merchant governance routes
router.get('/admin/all', authenticateJwt, requireRole(['ADMIN']), getAllMerchants);
router.patch('/admin/:userId/approve', authenticateJwt, requireRole(['ADMIN']), approveMerchant);
router.patch('/admin/:userId/reject', authenticateJwt, requireRole(['ADMIN']), rejectMerchant);

export default router;


