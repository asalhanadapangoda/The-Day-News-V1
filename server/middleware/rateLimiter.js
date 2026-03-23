import rateLimit from 'express-rate-limit';

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Rate limiter for login attempts - prevents brute force attacks
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 100 : 5, // More lenient in development
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skip: () => false, // Don't skip in development, just increase limit
});

// General API rate limiter - More lenient in development
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 5000 : 100, // Very high limit in development
  message: {
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for:
    // 1. File uploads (multipart/form-data)
    // 2. DELETE requests (delete operations)
    // 3. PUT requests (edit/update operations)
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      return true; // Skip for file uploads
    }
    if (req.method === 'DELETE') {
      return true; // Skip for delete operations
    }
    if (req.method === 'PUT') {
      return true; // Skip for edit/update operations
    }
    return false;
  },
});

// Rate limiter for admin routes - More lenient in development
export const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isDevelopment ? 10000 : 50, // Very high limit in development (effectively unlimited)
  message: {
    message: 'Too many admin requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for:
    // 1. File uploads (multipart/form-data)
    // 2. DELETE requests (delete operations)
    // 3. PUT requests (edit/update operations)
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('multipart/form-data')) {
      return true; // Skip for file uploads
    }
    if (req.method === 'DELETE') {
      return true; // Skip for delete operations
    }
    if (req.method === 'PUT') {
      return true; // Skip for edit/update operations
    }
    return false;
  },
});

