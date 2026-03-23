import Section from '../models/Section.js';
import { isValidObjectId } from '../utils/validateObjectId.js';
import logger from '../utils/logger.js';

// @desc    Get all sections
// @route   GET /api/sections
// @access  Public
export const getSections = async (req, res) => {
  try {
    const sections = await Section.find().sort({ name: 1 });
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create section (admin)
// @route   POST /api/sections
// @access  Private/Admin
export const createSection = async (req, res) => {
  try {
    const section = await Section.create(req.body);
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update section (admin)
// @route   PUT /api/sections/:id
// @access  Private/Admin
export const updateSection = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid section ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }

    const section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(section);
  } catch (error) {
    logger.error('Error updating section:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete section (admin)
// @route   DELETE /api/sections/:id
// @access  Private/Admin
export const deleteSection = async (req, res) => {
  try {
    // Validate ObjectId format
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        message: 'Invalid section ID format',
        error: 'INVALID_ID_FORMAT'
      });
    }

    const section = await Section.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    logger.error('Error deleting section:', error);
    res.status(500).json({ message: error.message });
  }
};

