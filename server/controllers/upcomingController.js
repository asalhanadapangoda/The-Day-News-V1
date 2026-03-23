import Upcoming from '../models/Upcoming.js';
import { uploadToCloudinary } from '../middleware/upload.js';
import { isValidObjectId } from '../utils/validateObjectId.js';
import logger from '../utils/logger.js';

// @desc    Get all upcoming podcasts
// @route   GET /api/upcoming
// @access  Public
export const getUpcoming = async (req, res) => {
  try {
    const upcoming = await Upcoming.find().sort({ createdAt: -1 });
    res.json(upcoming);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create upcoming podcast (admin)
// @route   POST /api/upcoming
// @access  Private/Admin
export const createUpcoming = async (req, res) => {
  try {
    const upcomingData = { ...req.body };

    // Handle photo upload if file exists
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file, 'thedaynews/upcoming');
        upcomingData.photo = result.secure_url;
      } catch (uploadError) {
        logger.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({ 
          message: 'Failed to upload photo: ' + uploadError.message,
          error: 'UPLOAD_FAILED'
        });
      }
    }

    const upcoming = await Upcoming.create(upcomingData);
    res.status(201).json(upcoming);
  } catch (error) {
    logger.error('Error creating upcoming podcast:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update upcoming podcast (admin)
// @route   PUT /api/upcoming/:id
// @access  Private/Admin
export const updateUpcoming = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid upcoming podcast ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }

    const upcomingData = { ...req.body };

    // Handle photo upload if file exists
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file, 'thedaynews/upcoming');
        upcomingData.photo = result.secure_url;
      } catch (uploadError) {
        logger.error('Cloudinary upload error:', uploadError);
        return res.status(400).json({ 
          message: 'Failed to upload photo: ' + uploadError.message,
          error: 'UPLOAD_FAILED'
        });
      }
    }

    const upcoming = await Upcoming.findByIdAndUpdate(
      req.params.id,
      upcomingData,
      { new: true, runValidators: true }
    );

    if (!upcoming) {
      return res.status(404).json({ message: 'Upcoming podcast not found' });
    }

    res.json(upcoming);
  } catch (error) {
    logger.error('Error updating upcoming podcast:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete upcoming podcast (admin)
// @route   DELETE /api/upcoming/:id
// @access  Private/Admin
export const deleteUpcoming = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid upcoming podcast ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }

    const upcoming = await Upcoming.findByIdAndDelete(req.params.id);

    if (!upcoming) {
      return res.status(404).json({ message: 'Upcoming podcast not found' });
    }

    res.json({ message: 'Upcoming podcast deleted successfully' });
  } catch (error) {
    logger.error('Error deleting upcoming podcast:', error);
    res.status(500).json({ message: error.message });
  }
};

