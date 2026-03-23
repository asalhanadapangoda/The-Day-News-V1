import { body, validationResult } from 'express-validator';

// Validation middleware
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Get the first error message for better UX
    const firstError = errors.array()[0];
    return res.status(400).json({
      message: firstError.msg || 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Login validation rules
export const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors,
];

// Podcast validation rules
export const validatePodcast = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Podcast name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Podcast name must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  handleValidationErrors,
];

// Section validation rules
export const validateSection = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Section name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Section name must be between 2 and 50 characters'),
  handleValidationErrors,
];

// Upcoming validation rules
export const validateUpcoming = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Name must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  handleValidationErrors,
];

// Article validation rules
export const validateArticle = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Article name is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Article name must be between 3 and 200 characters'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Article content is required')
    .isLength({ min: 10 })
    .withMessage('Article content must be at least 10 characters long'),
  handleValidationErrors,
];

// Article Section validation rules
export const validateArticleSection = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Section name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Section name must be between 2 and 50 characters'),
  handleValidationErrors,
];

// Contact form validation rules
export const validateContact = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('submitTip')
    .optional()
    .customSanitizer((value) => {
      // Convert to boolean: handle undefined, null, string "true"/"false", or actual boolean
      if (value === undefined || value === null || value === '') return false;
      if (value === 'true' || value === true) return true;
      if (value === 'false' || value === false) return false;
      return Boolean(value);
    }),
  handleValidationErrors,
];

