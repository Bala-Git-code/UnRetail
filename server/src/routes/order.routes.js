import express from 'express';
import { createOrderIntent, getBuyerOrders, getMerchantOrders, updateOrderStatus } from '../controllers/order.controller.js';
import { authenticateJwt } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/create-intent', authenticateJwt, createOrderIntent);
router.get('/buyer', authenticateJwt, getBuyerOrders);
router.get('/merchant', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), getMerchantOrders);
router.patch('/:orderId/status', authenticateJwt, updateOrderStatus);

export default router;
