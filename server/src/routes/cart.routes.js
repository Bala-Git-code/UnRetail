import express from 'express';
import { validateCart } from '../controllers/cart.controller.js';

const router = express.Router();

// Real-time 1-of-1 thrift stock validation endpoint
router.post('/validate', validateCart);

export default router;
