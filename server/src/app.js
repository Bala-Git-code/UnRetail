import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { googleAuth, getMe, adminLogin } from './controllers/auth.controller.js';
import { getItems, getItemById, createItem, updateItem, deleteItem } from './controllers/item.controller.js';
import { createOrder, handleRazorpayWebhook, getCloudinarySignature } from './controllers/payment.controller.js';
import { getShops, getShopById, createShop, verifyShop } from './controllers/shop.controller.js';
import { authenticateJwt } from './middlewares/auth.middleware.js';
import { requireRole } from './middlewares/role.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Global Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'UnRetail Express API (ES Modules)', timestamp: new Date().toISOString() });
});

// API Routes Router
const apiRouter = express.Router();

// --- Auth Routes ---
apiRouter.post('/auth/google', googleAuth);
apiRouter.post('/auth/admin-login', adminLogin);
apiRouter.get('/auth/me', authenticateJwt, getMe);

// --- Cloudinary Signature Route ---
apiRouter.get('/cloudinary/signature', authenticateJwt, getCloudinarySignature);

// --- Items Routes ---
apiRouter.get('/items', getItems);
apiRouter.get('/items/:itemId', getItemById);
apiRouter.post('/items', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), createItem);
apiRouter.patch('/items/:itemId', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), updateItem);
apiRouter.delete('/items/:itemId', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), deleteItem);

// --- Payment & Razorpay Routes ---
apiRouter.post('/payments/create-order', authenticateJwt, createOrder);
apiRouter.post('/payments/webhook', handleRazorpayWebhook);

// --- Shop Routes ---
apiRouter.get('/shops', getShops);
apiRouter.get('/shops/:shopId', getShopById);
apiRouter.post('/shops', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), createShop);
apiRouter.patch('/shops/:shopId/verify', authenticateJwt, requireRole(['ADMIN']), verifyShop);

// Mount API v1 router
app.use('/api/v1', apiRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Start Express Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 UnRetail Express API Server running on port ${PORT} (ES Modules)`);
  });
}

export default app;
