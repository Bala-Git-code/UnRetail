import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { googleAuth, getMe, adminLogin } from './controllers/auth.controller.js';
import { handleRazorpayWebhook, getCloudinarySignature } from './controllers/payment.controller.js';
import { getShops, getShopById, createShop, verifyShop } from './controllers/shop.controller.js';
import { authenticateJwt } from './middlewares/auth.middleware.js';
import { requireRole } from './middlewares/role.middleware.js';

// Import modular routes
import itemRoutes from './routes/item.routes.js';
import merchantRoutes from './routes/merchant.routes.js';
import orderRoutes from './routes/order.routes.js';
import disputeRoutes from './routes/dispute.routes.js';
import { initMeilisearchIndex } from '../config/meilisearch.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;


// Global Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health Check Endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'UnRetail Express API (ES Modules)', timestamp: new Date().toISOString() });
});

// API Routes Router
const apiRouter = express.Router();

// --- Health Route ---
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'UnRetail Express API (ES Modules)', timestamp: new Date().toISOString() });
});

// --- Auth Routes ---
apiRouter.post('/auth/google', googleAuth);
apiRouter.post('/auth/admin-login', adminLogin);
apiRouter.get('/auth/me', authenticateJwt, getMe);

// --- Cloudinary Signature Route ---
apiRouter.get('/cloudinary/signature', authenticateJwt, getCloudinarySignature);

// --- Modular Routes ---
apiRouter.use('/items', itemRoutes);
apiRouter.use('/merchant', merchantRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/disputes', disputeRoutes);

// --- Payment Webhook ---
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
  app.listen(PORT, async () => {
    console.log(`🚀 UnRetail Express API Server running on port ${PORT} (ES Modules)`);
    await initMeilisearchIndex();
  });
}

export default app;
