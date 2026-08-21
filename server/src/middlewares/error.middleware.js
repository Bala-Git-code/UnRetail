/**
 * Centralized Global Error Handling Middleware
 * Ensures all uncaught asynchronous/synchronous errors return structured JSON.
 */
export function globalErrorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  const isProd = process.env.NODE_ENV === 'production';

  console.error(`[Unhandled Error] ${req.method} ${req.originalUrl || req.url}:`, {
    message: err.message,
    stack: isProd ? undefined : err.stack,
    statusCode,
  });

  return res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error occurred',
    ...(isProd ? {} : { stack: err.stack }),
  });
}

/**
 * 404 Route Not Found Middleware
 */
export function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl || req.url}`,
  });
}
