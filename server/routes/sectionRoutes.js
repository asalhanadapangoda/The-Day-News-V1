import express from 'express';
import {
  getSections,
  createSection,
  updateSection,
  deleteSection,
} from '../controllers/sectionController.js';
import { protect } from '../middleware/auth.js';
import { validateSection } from '../middleware/validation.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.get('/', getSections);

// Admin routes - All protected with rate limiting and validation
router.post('/', adminLimiter, protect, validateSection, createSection);
router.put('/:id', adminLimiter, protect, validateSection, updateSection);
router.delete('/:id', adminLimiter, protect, deleteSection);

export default router;

