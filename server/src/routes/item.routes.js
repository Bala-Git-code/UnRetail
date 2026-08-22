import express from 'express';
import { getItems, getItemById, createItem, updateItem, deleteItem, markSoldInStore } from '../controllers/item.controller.js';
import { authenticateJwt } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getItems);
router.get('/:itemId', getItemById);

// Authenticated Merchant/Admin routes (Role & boutique ownership validated in controllers)
router.post('/', authenticateJwt, createItem);
router.patch('/:itemId', authenticateJwt, updateItem);
router.delete('/:itemId', authenticateJwt, deleteItem);
router.patch('/:itemId/mark-sold', authenticateJwt, markSoldInStore);

export default router;

