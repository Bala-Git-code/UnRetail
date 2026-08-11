import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { googleAuth, getMe } from './controllers/auth.controller';
import { getItems, getItemById, createItem, updateItem, deleteItem } from './controllers/item.controller';
import { createOrder, handleRazorpayWebhook, getCloudinarySignature } from './controllers/payment.controller';
import { getShops, getShopById, createShop, verifyShop } from './controllers/shop.controller';
import { authenticateJwt } from './middlewares/auth.middleware';
import { requireRole } from './middlewares/role.middleware';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'UnRetail API Backend', timestamp: new Date().toISOString() });
});

// API Routes Router
const apiRouter = express.Router();

// --- Auth Routes ---
apiRouter.post('/auth/google', googleAuth);
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
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, error: 'API route not found' });
});

// Start Express Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 UnRetail Express API Server running on port ${PORT}`);
  });
}

export default app;
