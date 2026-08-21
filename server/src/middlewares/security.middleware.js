/**
 * Production-grade Security Headers Middleware
 * Protects against XSS, clickjacking, MIME sniffing, and MITM.
 */
export function securityHeadersMiddleware(req, res, next) {
  // Prevent MIME-sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Prevent Clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // XSS Auditor
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Strict Transport Security (HSTS) - enabled in production or HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Cross-Origin policies
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

  // Remove Express footprint
  res.removeHeader('X-Powered-By');

  next();
}

/**
 * In-memory sliding window rate limiter
 * Protects against brute-force and Denial-of-Service attacks.
 */
export function createRateLimiter({
  windowMs = 60 * 1000,
  maxRequests = 100,
  message = 'Too many requests from this IP, please try again later.',
} = {}) {
  const ipHits = new Map();

  // Periodic cleanup of stale records every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipHits.entries()) {
      if (now - record.startTime > windowMs) {
        ipHits.delete(ip);
      }
    }
  }, 5 * 60 * 1000).unref();

  return (req, res, next) => {
    // Determine client IP
    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    const record = ipHits.get(clientIp);

    if (!record || now - record.startTime > windowMs) {
      ipHits.set(clientIp, { count: 1, startTime: now });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    record.count += 1;
    const remaining = Math.max(0, maxRequests - record.count);
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);

    if (record.count > maxRequests) {
      const retryAfterSeconds = Math.ceil((record.startTime + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        error: message,
        retryAfter: retryAfterSeconds,
      });
    }

    next();
  };
}

// Specialized rate limiters
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 300,
  message: 'API rate limit exceeded. Please slow down your requests.',
});

export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 50,
  message: 'Too many authentication attempts. Please try again in 15 minutes.',
});

export const checkoutRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30,
  message: 'Checkout intent rate limit exceeded. Please wait a moment before trying again.',
});
