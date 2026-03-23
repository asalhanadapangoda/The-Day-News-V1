import ArticleSection from '../models/ArticleSection.js';
import { isValidObjectId } from '../utils/validateObjectId.js';
import logger from '../utils/logger.js';

// @desc    Get all article sections
// @route   GET /api/article-sections
// @access  Public
export const getArticleSections = async (req, res) => {
  try {
    const sections = await ArticleSection.find().sort({ name: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create article section (admin)
// @route   POST /api/article-sections
// @access  Private/Admin
export const createArticleSection = async (req, res) => {
  try {
    const section = await ArticleSection.create(req.body);
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update article section (admin)
// @route   PUT /api/article-sections/:id
// @access  Private/Admin
export const updateArticleSection = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid section ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }

    const section = await ArticleSection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(section);
  } catch (error) {
    logger.error('Error updating article section:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete article section (admin)
// @route   DELETE /api/article-sections/:id
// @access  Private/Admin
export const deleteArticleSection = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid section ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }

    const section = await ArticleSection.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    logger.error('Error deleting article section:', error);
    res.status(500).json({ message: error.message });
  }
};

