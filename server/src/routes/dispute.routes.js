import express from 'express';
import { createDispute, getDisputes, resolveDispute } from '../controllers/dispute.controller.js';
import { authenticateJwt } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.post('/', authenticateJwt, createDispute);
router.get('/', authenticateJwt, getDisputes);
router.patch('/:disputeId', authenticateJwt, requireRole(['ADMIN']), resolveDispute);

export default router;
