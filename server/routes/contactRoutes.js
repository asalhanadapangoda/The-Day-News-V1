import express from 'express';
import { sendContactEmail } from '../controllers/contactController.js';
import { validateContact } from '../middleware/validation.js';

const router = express.Router();

// Contact form route - public
router.post('/', validateContact, sendContactEmail);

export default router;

