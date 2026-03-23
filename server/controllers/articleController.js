import Article from '../models/Article.js';
import { uploadToCloudinary } from '../middleware/upload.js';
import { isValidObjectId } from '../utils/validateObjectId.js';
import logger from '../utils/logger.js';

// @desc    Get all articles (public)
// @route   GET /api/articles
// @access  Public
export const getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = { published: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const articles = await Article.find(query)
      .populate('section')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Article.countDocuments(query);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
export const getArticle = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid article ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }

    const article = await Article.findById(req.params.id).populate('section');

    if (!article || !article.published) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    logger.error('Error fetching article:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create article (admin)
// @route   POST /api/articles
// @access  Private/Admin
export const createArticle = async (req, res) => {
  try {
    const articleData = { ...req.body };
    let uploadedPhoto = null;

    // Handle photo upload if file exists
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file, 'thedaynews/articles');
        uploadedPhoto = result.secure_url;
        articleData.photo = uploadedPhoto;
      } catch (uploadError) {
        logger.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({ 
          message: 'Failed to upload photo: ' + uploadError.message,
          error: 'UPLOAD_FAILED'
        });
      }
    }

    const article = await Article.create(articleData);
    res.status(201).json(article);
  } catch (error) {
    logger.error('Error creating article:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update article (admin)
// @route   PUT /api/articles/:id
// @access  Private/Admin
export const updateArticle = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid article ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }

    const articleData = { ...req.body };

    // Handle photo upload if file exists
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file, 'thedaynews/articles');
        articleData.photo = result.secure_url;
      } catch (uploadError) {
        logger.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({ 
          message: 'Failed to upload photo: ' + uploadError.message,
          error: 'UPLOAD_FAILED'
        });
      }
    }

    const article = await Article.findByIdAndUpdate(
      req.params.id,
      articleData,
      { new: true, runValidators: true }
    ).populate('section');

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    logger.error('Error updating article:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete article (admin)
// @route   DELETE /api/articles/:id
// @access  Private/Admin
export const deleteArticle = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid article ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }

    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    logger.error('Error deleting article:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all articles (admin - includes unpublished)
// @route   GET /api/articles/admin/all
// @access  Private/Admin
export const getAllArticlesAdmin = async (req, res) => {
  try {
    const articles = await Article.find().populate('section').sort({ createdAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

