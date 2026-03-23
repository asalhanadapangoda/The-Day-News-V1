import express from 'express';
import { chat } from '../controllers/chatbotController.js';

const router = express.Router();

// Public route - no authentication required for chatbot
router.post('/', chat);

export default router;

