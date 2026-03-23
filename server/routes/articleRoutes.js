import express from 'express';
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticlesAdmin,
} from '../controllers/articleController.js';
import { protect } from '../middleware/auth.js';
import { validateArticle } from '../middleware/validation.js';
import { adminLimiter } from '../middleware/rateLimiter.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getArticles);
router.get('/:id', getArticle);

// Admin routes - All protected with rate limiting and validation
router.post('/', adminLimiter, protect, upload.single('photo'), validateArticle, createArticle);
router.put('/:id', adminLimiter, protect, upload.single('photo'), validateArticle, updateArticle);
router.delete('/:id', adminLimiter, protect, deleteArticle);
router.get('/admin/all', adminLimiter, protect, getAllArticlesAdmin);

export default router;

