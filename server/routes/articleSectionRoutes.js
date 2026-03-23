import express from 'express';
import {
  getArticleSections,
  createArticleSection,
  updateArticleSection,
  deleteArticleSection,
} from '../controllers/articleSectionController.js';
import { protect } from '../middleware/auth.js';
import { validateArticleSection } from '../middleware/validation.js';
import { adminLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public routes
router.get('/', getArticleSections);

// Admin routes - All protected with rate limiting and validation
router.post('/', adminLimiter, protect, validateArticleSection, createArticleSection);
router.put('/:id', adminLimiter, protect, validateArticleSection, updateArticleSection);
router.delete('/:id', adminLimiter, protect, deleteArticleSection);

export default router;

