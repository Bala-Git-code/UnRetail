import dotenv from 'dotenv';

dotenv.config();

const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'JWT_SECRET',
];

const OPTIONAL_BUT_RECOMMENDED = [
  'GOOGLE_CLIENT_ID',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'MEILISEARCH_HOST',
];

/**
 * Validates critical environment variables on server boot.
 * In production, exits the process early if critical configurations are absent.
 */
export function validateEnvironment() {
  const missingCritical = [];
  const missingRecommended = [];

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key] || process.env[key].trim() === '') {
      missingCritical.push(key);
    }
  }

  for (const key of OPTIONAL_BUT_RECOMMENDED) {
    if (!process.env[key] || process.env[key].trim() === '') {
      missingRecommended.push(key);
    }
  }

  if (missingRecommended.length > 0) {
    console.warn(`⚠️  [ENV CONFIG] Recommended environment keys not set (using sandboxed/mock fallbacks): ${missingRecommended.join(', ')}`);
  }

  if (missingCritical.length > 0) {
    const errorMsg = `🚨 [FATAL ENV ERROR] Missing mandatory environment variables: ${missingCritical.join(', ')}`;
    console.error(errorMsg);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMsg);
    }
  }

  return {
    PORT: process.env.PORT || 5001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'unretail_super_secret_jwt_key_change_in_production_2026',
    DATABASE_URL: process.env.DATABASE_URL,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyIdHere',
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'YourRazorpayKeySecretHere',
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'YourRazorpayWebhookSecretHere',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'l8el6dpt',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '114627665747722',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'fX98r2icbVwMxNpo06koLnxtga0',
    MEILISEARCH_HOST: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
    MEILISEARCH_ADMIN_KEY: process.env.MEILISEARCH_ADMIN_KEY || 'masterKey',
  };
}

export const env = validateEnvironment();
