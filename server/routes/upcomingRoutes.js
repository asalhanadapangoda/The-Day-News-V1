import express from 'express';
import {
  getUpcoming,
  createUpcoming,
  updateUpcoming,
  deleteUpcoming,
} from '../controllers/upcomingController.js';
import { protect } from '../middleware/auth.js';
import { validateUpcoming } from '../middleware/validation.js';
import { adminLimiter } from '../middleware/rateLimiter.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getUpcoming);

// Admin routes - All protected with rate limiting and validation
router.post('/', adminLimiter, protect, upload.single('photo'), validateUpcoming, createUpcoming);
router.put('/:id', adminLimiter, protect, upload.single('photo'), validateUpcoming, updateUpcoming);
router.delete('/:id', adminLimiter, protect, deleteUpcoming);

export default router;

