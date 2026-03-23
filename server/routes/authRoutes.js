import express from 'express';
import { login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { validateLogin } from '../middleware/validation.js';

const router = express.Router();

// Login route with rate limiting and validation
router.post('/login', loginLimiter, validateLogin, login);

// Get current user - protected route
router.get('/me', protect, getMe);

export default router;

