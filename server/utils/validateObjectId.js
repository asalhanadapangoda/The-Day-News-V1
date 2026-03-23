import mongoose from 'mongoose';

/**
 * Validates if a string is a valid MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid ObjectId, false otherwise
 */
export const isValidObjectId = (id) => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Middleware to validate ObjectId in request params
 * Returns 400 if invalid, calls next() if valid
 */
export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (id && !isValidObjectId(id)) {
    return res.status(400).json({ 
      message: 'Invalid ID format',
      error: 'INVALID_ID_FORMAT'
    });
  }
  
  next();
};

export default isValidObjectId;

