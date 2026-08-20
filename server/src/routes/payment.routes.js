import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  handleRazorpayWebhook,
  getCloudinarySignature,
} from '../controllers/payment.controller.js';
import { authenticateJwt } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Razorpay Order Creation Intent
router.post('/create-order', authenticateJwt, createPaymentOrder);

// Razorpay Payment Verification & Escrow Lock
router.post('/verify', authenticateJwt, verifyPayment);

// Razorpay Webhook Listener
router.post('/webhook', handleRazorpayWebhook);

// Cloudinary Signature Route
router.get('/cloudinary-signature', authenticateJwt, getCloudinarySignature);

export default router;
