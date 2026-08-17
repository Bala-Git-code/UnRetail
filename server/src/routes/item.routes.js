import express from 'express';
import { getItems, getItemById, createItem, updateItem, deleteItem, markSoldInStore } from '../controllers/item.controller.js';
import { authenticateJwt } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.get('/', getItems);
router.get('/:itemId', getItemById);

// Authenticated Merchant/Admin routes
router.post('/', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), createItem);
router.patch('/:itemId', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), updateItem);
router.delete('/:itemId', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), deleteItem);
router.patch('/:itemId/mark-sold', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), markSoldInStore);

export default router;
