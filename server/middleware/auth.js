import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../utils/logger.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // No token provided
  if (!token) {
    return res.status(401).json({ 
      message: 'Not authorized, no token provided',
      code: 'NO_TOKEN'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    req.user = await User.findById(decoded.userId).select('-password');
    
    // User not found (token valid but user deleted)
    if (!req.user) {
      return res.status(401).json({ 
        message: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Check if user is admin (additional security check)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin privileges required.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    // User is authenticated and authorized
    next();
  } catch (error) {
    // Handle different JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token. Please login again.',
        code: 'INVALID_TOKEN'
      });
    }
    
    // Generic error
    logger.error('Auth middleware error:', error);
    return res.status(401).json({ 
      message: 'Not authorized, token verification failed',
      code: 'TOKEN_VERIFICATION_FAILED'
    });
  }
};

