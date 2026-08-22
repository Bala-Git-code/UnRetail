import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { validateEnvironment } from './config/env.js';
import { securityHeadersMiddleware, apiRateLimiter, authRateLimiter } from './middlewares/security.middleware.js';
import { globalErrorHandler, notFoundHandler } from './middlewares/error.middleware.js';
import { googleAuth, getMe, adminLogin } from './controllers/auth.controller.js';
import { getShops, getShopById, createShop, verifyShop } from './controllers/shop.controller.js';
import { getCloudinarySignature } from './controllers/payment.controller.js';
import { authenticateJwt } from './middlewares/auth.middleware.js';
import { requireRole } from './middlewares/role.middleware.js';

// Import modular routes
import itemRoutes from './routes/item.routes.js';
import merchantRoutes from './routes/merchant.routes.js';
import orderRoutes from './routes/order.routes.js';
import disputeRoutes from './routes/dispute.routes.js';
import cartRoutes from './routes/cart.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import { initMeilisearchIndex } from '../config/meilisearch.js';
import prisma from './prisma/client.js';

dotenv.config();
const envConfig = validateEnvironment();

const app = express();
const PORT = envConfig.PORT || 5001;

// Global Security & Parsing Middlewares
app.use(securityHeadersMiddleware);
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server) or any development origin
      if (!origin || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      const allowedOrigins = [
        process.env.CLIENT_URL,
        'http://localhost:3000',
        'http://localhost:5001',
      ].filter(Boolean);

      if (allowedOrigins.includes(origin) || allowedOrigins.some((o) => origin.startsWith(o))) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive fallback for multi-domain deployments
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-razorpay-signature'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Favicon & Health Check Endpoints (Root level)
app.get('/favicon.ico', (_req, res) => res.status(204).end());
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'UnRetail Express API (ES Modules)',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});


// API Routes Router (Mounted at /api/v1)
const apiRouter = express.Router();
apiRouter.use(apiRateLimiter);

// --- Health Route ---
apiRouter.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'UnRetail Express API (ES Modules)',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// --- Auth Routes (Rate Limited) ---
apiRouter.post('/auth/google', authRateLimiter, googleAuth);
apiRouter.post('/auth/admin-login', authRateLimiter, adminLogin);
apiRouter.get('/auth/me', authenticateJwt, getMe);

// --- Modular Routes ---
apiRouter.use('/items', itemRoutes);
apiRouter.use('/merchant', merchantRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/disputes', disputeRoutes);
apiRouter.use('/cart', cartRoutes);
apiRouter.use('/payments', paymentRoutes);

// --- Cloudinary Signature Routes ---
apiRouter.get('/cloudinary/signature', authenticateJwt, getCloudinarySignature);
apiRouter.get('/cloudinary-signature', authenticateJwt, getCloudinarySignature);

// --- Shop Routes ---
apiRouter.get('/shops', getShops);
apiRouter.get('/shops/:shopId', getShopById);
apiRouter.post('/shops', authenticateJwt, requireRole(['MERCHANT', 'ADMIN']), createShop);
apiRouter.patch('/shops/:shopId/verify', authenticateJwt, requireRole(['ADMIN']), verifyShop);


// Mount API router across /api/v1, /api, and root routes
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);
app.use('/', apiRouter);

// 404 Handler for unmatched routes
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(globalErrorHandler);

// Start Express Server & Handle Graceful Shutdown
let server;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, async () => {
    console.log(`🚀 UnRetail Express API Server running on port ${PORT} (ES Modules)`);
    try {
      await initMeilisearchIndex();
    } catch (searchErr) {
      console.warn('⚠️  Meilisearch initialization warning:', searchErr.message || searchErr);
    }
  });

  const gracefulShutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    if (server) {
      server.close(async () => {
        console.log('✅ Express HTTP server closed.');
        try {
          await prisma.$disconnect();
          console.log('✅ Prisma PostgreSQL database disconnected.');
        } catch (dbErr) {
          console.error('Error disconnecting Prisma client:', dbErr);
        }
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

export default app;
